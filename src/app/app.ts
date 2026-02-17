import { Component, signal, inject, computed, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreditCardService } from './services/credit-card.service';
import { BaseChartDirective } from 'ng2-charts';
import  { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private cardService = inject(CreditCardService);

  // Pagination Signals
  currentPage = signal(1);
  pageSize = signal(10);
  pageSizeOptions = [5, 10, 25];

 // protected readonly title = signal('chartpoc');
 // New: Track which card is clicked
  selectedCard = signal<string | null>(null);
  selectedCategory = signal<string | null>(null); // New!
 

  // Multi-filter Logic: Combines Card and Category filters
  filteredTransactions = computed(() => {
    const card = this.selectedCard();
    const cat = this.selectedCategory();
    let data = this.cardService.getTransactions()();

    if (card) data = data.filter(t => t.card === card);
    if (cat) data = data.filter(t => t.category === cat);
    
    return data;
  });

// 2. NEW: Slice the data for the current page
  paginatedTransactions = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.filteredTransactions().slice(startIndex, endIndex);
  });

  // 3. NEW: Calculate total pages
  totalPages = computed(() => Math.ceil(this.filteredTransactions().length / this.pageSize()));

  // 4. NEW: Reset page to 1 whenever filters change
  constructor() {
    effect(() => {
      this.selectedCard();
      this.selectedCategory();
      this.currentPage.set(1); // Jump back to page 1 if we filter the data
    }, { allowSignalWrites: true });
  }
// Helper methods for the UI
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }


  // 1. Data for the Bar Chart (Card Totals)
  public barChartData: ChartData<'bar'> = {
    labels: this.cardService.cardTotals().map(d => d.label),
    datasets: [
      { 
        data: this.cardService.cardTotals().map(d => d.value), 
        label: 'Spending by Card',
        backgroundColor: ['#1e3a8a', '#fbbf24', '#94a3b8'] 
      }
    ]
  };

  // 2. Data for the Doughnut Chart (Category Totals)
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.cardService.categoryTotals().map(d => d.label),
    datasets: [
      { 
        data: this.cardService.categoryTotals().map(d => d.value),
        backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa']
      }
    ]
  };

  // 3. Simple Options
  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' }
    }
  };




  // New: Handler for chart clicks
  onChartClick({ event, active }: { event?: any, active?: any[] }): void {
    if (active && active.length > 0) {
      const index = active[0].index;
      const cardLabel = this.barChartData.labels?.[index] as string;
      
      // Toggle selection: click same bar again to clear filter
      this.selectedCard.update(current => current === cardLabel ? null : cardLabel);
    }
  }

  onPageSizeChange(event: Event) {
  // 1. Get the HTML element from the event
  const selectElement = event.target as HTMLSelectElement;
  
  // 2. Extract the new number (converting string "5" to number 5)
  const newSize = Number(selectElement.value);
  
  // 3. Update your signals
  this.pageSize.set(newSize);
  this.currentPage.set(1); 
}

  // Calculate the sum of the filtered data
  tableTotal = computed(() => {
    return this.filteredTransactions().reduce((sum, t) => sum + t.amount, 0);
  });

  // Handle Card Bar Clicks
  onCardClick({ active }: { active?: any[] }): void {
    if (active && active.length > 0) {
      const index = active[0].index;
      const label = this.barChartData.labels?.[index] as string;
      this.selectedCard.update(curr => curr === label ? null : label);
    }
  }

  // Handle Category Doughnut Clicks
  onCategoryClick({ active }: { active?: any[] }): void {
    if (active && active.length > 0) {
      const index = active[0].index;
      const label = this.doughnutChartData.labels?.[index] as string;
      this.selectedCategory.update(curr => curr === label ? null : label);
    }
  }

  clearFilters() {
    this.selectedCard.set(null);
    this.selectedCategory.set(null);
  }
  

}
