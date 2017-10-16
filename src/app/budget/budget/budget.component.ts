import { Component, OnInit } from '@angular/core';
import {
  CategoriesService,
  Category,
  AccountsService,
  Account
} from '@app/core';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
  // Properties to hold loaded data
  accounts: Account[];
  categories: Category[];
  // Properties to manage budget display
  budget = {
    budgeted: 0,
    balance: 0
  };
  // Properties to manage data in forms
  editing: number;
  edit: Category = { id: '', name: '' } as Category;
  categoryEditModal = false;
  categoryRemoveModal = false;
  error: any;

  constructor(
    private accountsService: AccountsService,
    private categoriesService: CategoriesService
  ) {}

  /**
   * Load categories and accounts on init
   */
  ngOnInit() {
    this.getCategories();
    this.getAccounts();
  }

  /**
   * Need to load the accounts to calculate overall available balance
   */
  private getAccounts() {
    this.accountsService.query().subscribe((accounts: Account[]) => {
      this.accounts = accounts;
      this.accounts.forEach((account: Account) => {
        if (account.type === 'debit') {
          this.budget.balance += account.balance;
        } else {
          this.budget.balance -= account.balance;
        }
      });
    });
  }

  /**
   * Load the list of categories, only to display the credit types
   */
  private getCategories() {
    this.categoriesService.query().subscribe((categories: Category[]) => {
      // List of categories
      this.categories = categories.filter(
        (category: Category) => category.type === 'credit'
      );
      this.calculateBudget();
    });
  }

  /**
   * Calculate the budget after category budgeted values are known or change
   */
  private calculateBudget() {
    this.budget.budgeted = 0;
    this.categories.forEach((category: Category) => {
      this.budget.budgeted += category.budgeted * 100;
    });
    this.budget.budgeted = this.budget.budgeted / 100;
  }

  public editCategory(
    category: Category = {
      name: '',
      id: '',
      budgeted: 0,
      available: 0,
      activity: 0,
      type: 'credit'
    }
  ): void {
    this.edit = category;
    this.categoryEditModal = true;
  }

  public confirmRemoveCategory(category): void {
    this.edit = category;
    this.categoryRemoveModal = true;
  }

  /**
   * Close the modal and reset error states
   */
  public cancel(): void {
    this.categoryEditModal = false;
    this.categoryRemoveModal = false;
    this.error = null;
  }

  public removeCategory(): void {
    this.categoriesService.remove(this.edit.id).subscribe(
      () => {
        // Category was removed
        this.cancel();
        this.getCategories();
      },
      error => {
        this.error = JSON.parse(error.error);
      }
    );
  }

  /**
   * Save the currently edited category
   */
  public save(): void {
    if (this.edit.id) {
      this.categoriesService
        .update(this.edit.id, this.edit)
        .subscribe((category: Category) => {
          // Category was saved
          this.cancel();
          this.getCategories();
        }, error => {
          this.error = JSON.parse(error.error);
        });
    } else {
      this.categoriesService
        .create(this.edit)
        .subscribe((category: Category) => {
          // Category was created
          this.cancel();
          this.getCategories();
        }, error => {
          this.error = JSON.parse(error.error);
        });
    }
  }

  /**
   * Save a category directly without putting it into the modal
   */
  public saveCategory(category: Category): void {
    this.edit = category;
    this.save();
  }
}
