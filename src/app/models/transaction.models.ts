export type CardType = 'Platinum' | 'Gold' | 'Silver';
export type CategoryType = 'Food' | 'Travel' | 'Shopping' | 'Utilities' | 'Entertainment';

export interface Transaction {
  id: string;
  card: CardType;
  category: CategoryType;
  amount: number;
  date: Date;
  description: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}