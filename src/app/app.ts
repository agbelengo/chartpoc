import { Component, signal, inject, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreditCardService } from './services/credit-card.service';
import { BaseChartDirective } from 'ng2-charts';
import  { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, BaseChartDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private cardService = inject(CreditCardService);

 // protected readonly title = signal('chartpoc');
 // New: Track which card is clicked
  selectedCard = signal<string | null>(null);
  selectedCategory = signal<string | null>(null); // New!
 
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

// Multi-filter Logic: Combines Card and Category filters
  filteredTransactions = computed(() => {
    const card = this.selectedCard();
    const cat = this.selectedCategory();
    let data = this.cardService.getTransactions()();

    if (card) data = data.filter(t => t.card === card);
    if (cat) data = data.filter(t => t.category === cat);
    
    return data;
  });


  // New: Handler for chart clicks
  onChartClick({ event, active }: { event?: any, active?: any[] }): void {
    if (active && active.length > 0) {
      const index = active[0].index;
      const cardLabel = this.barChartData.labels?.[index] as string;
      
      // Toggle selection: click same bar again to clear filter
      this.selectedCard.update(current => current === cardLabel ? null : cardLabel);
    }
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
