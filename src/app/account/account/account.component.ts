import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { State } from 'clarity-angular';
import { HttpResponse } from '@angular/common/http';
import 'rxjs/add/observable/forkJoin';
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
  // Properties for managing the forms
  alerts = {
    success: false,
    error: false
  };
  changesMade = false;
  editIndex = 0;
  editForm: FormGroup;
  edits = [];  
  deleteModal = false;
  editModal = false;
  months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  years = [];
  days = [];

  constructor(
    private route: ActivatedRoute,
    private accountsService: AccountsService,
    private categoriesService: CategoriesService,
    private transactionsService: TransactionsService,
    formBuilder: FormBuilder
  ) {
    const year = new Date().getFullYear();
    const endYear = year - 30;
    for (let i = year; i > endYear; i--) {
      this.years.push(i);
    }

    this.editForm = formBuilder.group({
      date: formBuilder.group({
        // This will be converted to/from full date
        day: [0, Validators.required],
        month: [0, Validators.required],
        year: [0, Validators.required]
      }),
      amount: [0, Validators.required], // Expect to be currency number
      payee: ['', Validators.required],
      id: '',
      categoryId: ['', Validators.required],
      accountId: ['', Validators.required],
      comment: ''
    });
  }

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
      this.selected = [];
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
   * Open the new flow and set the state
   */
  public openAdd() {
    this.createNew();
    this.editModal = true;
  }

  /**
   * Open the edit flow and set the state
   */
  public openEdit(): void {
    this.edits = this.selected.slice(0);
    this.editSelect(0);
    this.editModal = true;
  }

  /**
   * Select which item in the list to edit
   */
  public editSelect(index: number): void {
    if (index === 0) {
      this.editIndex = index;
    } else {
      this.editIndex += index;
    }
    if (this.editIndex < 0) {
      this.editIndex = 0;
    }
    const item = Object.assign({}, this.edits[this.editIndex]);
    const date = new Date(item.date);
    item.date = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };
    this.editForm.setValue(item);
    this.updateDays();
  }

  /**
   * Closes and resets the states
   */
  public cancel(): void {
    this.editModal = this.deleteModal = false;
    this.alerts.error = false;
    this.alerts.success = false;
    if (this.changesMade) {
      this.selected = this.edits = [];
      this.state$.next(false);
    }
    this.changesMade = false;
  }

  /**
   * Sets up the form for a new record
   */
  private createNew(): void {
    const now = new Date();
    this.editForm.reset();
    this.editForm.get('accountId').setValue(this.account.id);
    this.editForm.get('date').setValue({
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear()
    });
    this.updateDays();
  }

  /**
   * Calculate the number of days in a month. Does not support leap years.
   */
  private updateDays(): void {
    const days31 = [1, 3, 5, 7, 8, 10, 12];
    const days30 = [4, 6, 9, 11];
    this.days = [];
    let total = 28;
    const month = this.editForm.get('date.month').value;

    if (days31.indexOf(month) >= 0) {
      total = 31;
    } else if (days30.indexOf(month) >= 0) {
      total = 30;
    }

    const days = [];
    for (let i = 1; i <= total; i++) {
      days.push(i);
    }
    this.days = days;
  }

  /**
   * Use selected items and set the category
   */
  public setCategory(category: Category): void {
    if (this.selected.length) {
      const tasks = [];
      this.selected.forEach((transaction: Transaction) => {
        transaction.categoryId = category.id;
        tasks.push(
          this.transactionsService.update(transaction.id, transaction)
        );
      });
      this.batchTasks(tasks);
    }
  }

  /**
   * Save a new or modified transaction, and optionally go forwards/backwards in the list of edits
   */
  public save(next = false, previous = false): void {
    if (this.editForm.valid) {
      const transaction = this.editForm.value;
      transaction.date = transaction.date.year + '-' +
        transaction.date.month + '-' +
        transaction.date.day;
      if (transaction.id) {
        // Update the transaction
        this.transactionsService
          .update(transaction.id, transaction)
          .subscribe((transaction: Transaction) => {
            this.changesMade = true;
            this.edits[this.editIndex] = transaction;
            if (next) {
              this.editSelect(1);
            } else if (previous) {
              this.editSelect(-1);
            } else {
              this.cancel();
            }
          });
      } else {
        // Create a new transaction
        this.transactionsService
          .create(transaction)
          .subscribe((transaction: Transaction) => {
            this.changesMade = true;
            if (next) {
              this.createNew();
              this.alerts.success = true;
            } else {
              this.cancel();
            }
          }, error => {
            this.alerts.error = true;
          });
      }
    }
  }

  /**
   * Delete transactions
   */
  public delete(): void {
    if (this.selected.length) {
      const tasks = [];
      this.selected.forEach((transaction: Transaction) => {
        tasks.push(this.transactionsService.remove(transaction.id));
      });
      this.batchTasks(tasks);
    }
  }

  /**
   * Batch HTTP requests to run and only then close the modal
   */
  private batchTasks(tasks: Observable<any>[]): void {
    Observable.forkJoin(...tasks).subscribe(results => {
      this.changesMade = true;
      this.cancel();
    });
  }
}
