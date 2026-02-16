import { Injectable, signal, computed } from '@angular/core';
import { Transaction, CardType, CategoryType } from '../models/transaction.models';

@Injectable({ providedIn: 'root' })
export class CreditCardService {
  // 1. The Raw Data Signal
  private allTransactions = signal<Transaction[]>(this.generateDummyData());

  // 2. Computed Signal: Totals by Card (For the Bar Chart)
  cardTotals = computed(() => {
    const cards: CardType[] = ['Platinum', 'Gold', 'Silver'];
    return cards.map(card => ({
      label: card,
      value: this.allTransactions()
        .filter(t => t.card === card)
        .reduce((sum, t) => sum + t.amount, 0)
    }));
  });

  // 3. Computed Signal: Totals by Category (For the Doughnut Chart)
  categoryTotals = computed(() => {
    const categories: CategoryType[] = ['Food', 'Travel', 'Shopping', 'Utilities', 'Entertainment'];
    return categories.map(cat => ({
      label: cat,
      value: this.allTransactions()
        .filter(t => t.category === cat)
        .reduce((sum, t) => sum + t.amount, 0)
    }));
  });

  // Helper to get all transactions (useful for the table)
  getTransactions() {
    return this.allTransactions;
  }

  private generateDummyData(): Transaction[] {
    const data: Transaction[] = [];
    const cards: CardType[] = ['Platinum', 'Gold', 'Silver'];
    const categories: CategoryType[] = ['Food', 'Travel', 'Shopping', 'Utilities', 'Entertainment'];
    const months = [0, 1, 2]; // Jan, Feb, Mar (0-indexed for Date)

    let idCounter = 1;

    months.forEach(month => {
      cards.forEach(card => {
        categories.forEach(cat => {
          data.push({
            id: (idCounter++).toString(),
            card: card,
            category: cat,
            // Random amount between $10 and $500
            amount: Math.floor(Math.random() * 490) + 10,
            date: new Date(2026, month, Math.floor(Math.random() * 28) + 1),
            description: `${cat} purchase on ${card}`
          });
        });
      });
    });
    return data;
  }
}