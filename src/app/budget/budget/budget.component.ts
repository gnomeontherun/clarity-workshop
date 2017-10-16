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

  /*
  * How to use service to create a new category
  */
  // this.categoriesService
  //   .update(categoryObject)
  //   .subscribe((category: Category) => {
  //     // Category was saved
  //   }, error => {
  //     // Category was not saved
  //   });

  /*
  * How to use service to update a new category
  */
  // this.categoriesService
  //   .update(categoryId, categoryObject)
  //   .subscribe((category: Category) => {
  //     // Category was saved
  //   }, error => {
  //     // Category was not saved
  //   });
}
