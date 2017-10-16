import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import {
  AccountsService,
  Account,
  Transaction,
  TransactionsService
} from '@app/core';

@Component({
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  // Properties to hold loaded data
  accounts: Account[] = [];
  transactions: Transaction[] = [];

  constructor(
    private accountsService: AccountsService,
    private transactionsService: TransactionsService
  ) {}

  /**
   * Load the account and transactions data
   */
  ngOnInit() {
    this.getAccounts();
    this.getTransactions();
  }

  /**
   * Load the list of accounts
   */
  private getAccounts(): void {
    this.accountsService.query().subscribe((accounts: Account[]) => {
      this.accounts = accounts;
    });
  }

  /**
   * Load a list the most recent 10 transactions
   */
  private getTransactions(): void {
    this.transactionsService
      .query([`_limit=10`, `_sort=date`, `_order=desc`])
      .subscribe((response: HttpResponse<Transaction[]>) => {
        this.transactions = response.body;
      });
  }

  /**
   * Helper to lookup the account name by id
   */
  public lookupAccount(accountId: string): string {
    if (this.accounts) {
      const account = this.accounts
        .find((account: Account) => account.id === accountId);
      if (account) {
        return account.name;
      }
    }
    return '';
  }
}
