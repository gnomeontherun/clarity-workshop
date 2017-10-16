# Session 1 - Budgeting

> “As a user, I need to define a budget so that I can manage where my money is going.”

The goal for this session is to implement authentication features for the application. This includes login and logout. Clarity defines some of these behaviors but others are open to interpretation, so consider the design patterns and design the best experience you can.

### Objectives and Constraints

* Define budget amount for each category
  * Do not exceed total available in accounts
  * Update totals of balance, budgeted and left to budget
* Manage list of categories
  * Add new categories
  * Rename categories
  * Remove categories
  * Can only delete when no transactions are attached
  * Handle errors appropriately

### Session objectives

* [ ] Each person sketch at least 3 ideas in the first 3 minutes.
* [ ] Share your sketches in the group, 1 minute each.
* [ ] Decide on the best implementation, and sketch it.
* [ ] Collaboratively implement a prototype of the feature, focus on demonstrating the UX over perfection.
* [ ] Prepare some notes to share about _what your implementation is_ and _why you think it is the best_.

### Implementation Notes

* [Budget Component](../src/budget/budget/budget.component.ts) has a basic display of the balances and list of categories with their associated budget values.
* [Accounts Service](../src/core/services/account/account.service.ts) is used to load the list of accounts, which contains the balance information
* [Categories Service](../src/core/services/categories/categories.service.ts) is used to manage the list of categories, with methods for creating, editing, and removing categories
