export interface Account {
  name: string;
  balance: number;
  type: 'debit' | 'credit';
  id: string;
  accountNumber: string;
}
