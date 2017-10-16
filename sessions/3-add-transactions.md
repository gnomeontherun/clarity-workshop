# Session 3 - Add Transactions

> “As a user, I need to add transactions to the ledger for a specific account so that I can track my money.”

The goal for this session is to create new trasactions for an account. There is a button already provided to click for creating a new transaction. When storing a transaction, it should store the date, payee, amount, category id, and optional comment.

### Objectives and Constraints

* Define way to enter new transactions
  * Include a Date, Payee, Amount, Category, Comment
  * Validate inputs before submitting
* Consider if you will reuse this for editing or not
* Validate inputs and show error messaging

### Session objectives

* [ ] Each person sketch at least 3 ideas in the first 3 minutes.
* [ ] Share your sketches in the group, 1 minute each.
* [ ] Decide on the best implementation, and sketch it.
* [ ] Collaboratively implement a prototype of the feature, focus on demonstrating the UX over perfection.
* [ ] Prepare some notes to share about _what your implementation is_ and _why you think it is the best_.

### Implementation Notes

* [Account Component](../src/account/account/account.component.ts) has a datagrid with the transactions for each account.
* There is already a button provided to add a new transaction, though you could choose a different UX.
* [Accounts Service](../src/core/services/account/account.service.ts) is used to load the list of accounts, which contains the balance information.
* [Categories Service](../src/core/services/categories/categories.service.ts) is used to manage the list of categories, with methods for creating, editing, and removing categories.
* [Transactions Service](../src/core/services/transactions/transactions.service.ts) is used to load the list of transactions, create, edit, and delete.
