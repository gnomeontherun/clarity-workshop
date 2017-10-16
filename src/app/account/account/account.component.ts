import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { State } from 'clarity-angular';
import { HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
  Account,
  AccountsService,
  Category,
  CategoriesService,
  Transaction,
  TransactionsService
} from '@app/core';

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  // Properties to hold loaded data
  account: Account;
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  // Properties for managing the datagrid state
  state: State;
  perPage = 10;
  page = 1;
  total = 0;
  selected = [];
  loading = false;
  state$ = new BehaviorSubject<any>({});

  constructor(
    private route: ActivatedRoute,
    private accountsService: AccountsService,
    private categoriesService: CategoriesService,
    private transactionsService: TransactionsService
  ) {}

  /**
   * Initialize by loading the data
   */
  ngOnInit() {
    this.getAccounts();
    this.getCategories();
    this.getTransactions();
  }

  /**
   * Gets the list of accounts
   */
  private getAccounts(): void {
    this.accountsService.query().subscribe((accounts: Account[]) => {
      this.accounts = accounts;
    });
  }

  /**
   * Gets the list of categories
   */
  private getCategories(): void {
    this.categoriesService.query().subscribe((categories: Category[]) => {
      this.categories = categories;
    });
  }

  /**
   * Loads the list of transactions based on the current account id param in URL
   */
  private getTransactions(): void {
    // Subscribe to route param changes
    this.route.params.subscribe((params: Params) => {
      // Load the account associated with this id
      this.accountsService.get(params.id).subscribe((account: Account) => {
        // Set the account details
        this.account = account;

        // Setup the requests for transactions, which may be triggered by state changes.
        // state$ is a BehaviorSubject we can use next() to reload the list.
        this.state$
          .switchMap(state => {
            // If we changed state, set the new value
            if (state) {
              this.state = state;
            }
            this.loading = true;            
            return this.transactionsService.query(this.getFilters(), true);
          })
          .subscribe((response: HttpResponse<Transaction[]>) => {
            // Transactions service returns the full response object so we can get the headers
            this.transactions = response.body;
            this.total = parseInt(response.headers.get('x-total-count'));
            this.loading = false;            
          });
      });
    });
  }

  /**
   * Creates the query filters based on the datagrid state
   */
  private getFilters(): string[] {
    const filters = [];
    if (this.state) {
      if (this.state.sort && this.state.sort.by) {
        filters.push(`_sort=${this.state.sort.by}`);
      } else {
        filters.push(`_sort=date`);
      }
      if (this.state.sort && this.state.sort.reverse) {
        filters.push(`_order=${this.state.sort.reverse ? 'asc' : 'desc'}`);
      } else {
        filters.push(`_order=desc`);
      }
      if (this.state.page && this.state.page.from) {
        filters.push(`_start=${this.state.page.from}`);
      } else {
        filters.push(`_start=0`);
      }
      if (this.state.page && this.state.page.size) {
        filters.push(`_limit=${this.state.page.size}`);
      } else {
        filters.push(`_limit=10`);
      }
      if (this.account && this.account.id) {
        filters.push(`accountId=${this.account.id}`);
      }
      if (this.state.filters && this.state.filters.length) {
        this.state.filters.forEach((filter: {property: string, value: string}) => {
          filters.push(`${filter.property}=${filter.value}`);
        });
      }
    }
    return filters;
  }

  /**
   * Helper method to take the categoryId and lookup the name
   */
  public lookupCategory(categoryId: string): string {
    const index = this.categories.findIndex(
      (category: Category) => category.id === categoryId
    );
    return this.categories[index].name;
  }

  /**
   * Called by the datagrid to load server driven list
   */
  public load(state: State): void {
    // Skip initial load state, as this fires before account data is available.
    if (this.account && this.account.id) {
      this.state$.next(state);
    }
  }

  public trackBy(index: number, transaction: Transaction): string {
    return transaction.id;
  }

  /** 
   * This is how to use the service to create 
   */
  // this.transactionsService
  // .create(transaction)
  // .subscribe((transaction: Transaction) => { /* success */ }, error => { /* error */});

  /** 
   * This is how to use the service to update 
   */
  // this.transactionsService
  // .update(transaction.id, transaction)
  // .subscribe((transaction: Transaction) => { /* success */ }, error => { /* error */});

}
