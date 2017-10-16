export interface Category {
  id: string;
  name: string;
  budgeted: number;
  activity: number;
  available: number;
  type: 'credit' | 'debit';
}
