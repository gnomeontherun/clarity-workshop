# Session 4 - Editing Transactions

> “As a user, I need to modify or remove transactions in the ledger, so that I can keep my transactions current.”

The goal for this session is to create new trasactions for an account. There is a button already provided to click for creating a new transaction. When storing a transaction, it should store the date, payee, amount, category id, and optional comment.

### Objectives and Constraints

* Define way to enter edit transactions
  * Button provided for edit when you select items in datagrid
  * You may reuse your add transaction UX or create a new one
  * Validate inputs before submitting
  * Ideally support editing multiple transactions
  * Validate inputs and show error messaging
* Define a way to delete transactions
  * Button provided for delete when you select items in datagrid
  * Ideally support deleting multiple transactions
  * Handle errors for when it fails to delete
* Define a way to batch categorize transactions
  * Button already provided when you select items in datagrid
  * Should only set the category for the transactions and not modify other properties

### Session objectives

* [ ] Each person sketch at least 3 ideas in the first 3 minutes.
* [ ] Share your sketches in the group, 1 minute each.
* [ ] Decide on the best implementation, and sketch it.
* [ ] Collaboratively implement a prototype of the feature, focus on demonstrating the UX over perfection.
* [ ] Prepare some notes to share about _what your implementation is_ and _why you think it is the best_.

### Implementation Notes

* [Account Component](../src/account/account/account.component.ts) has a datagrid with the transactions for each account.
* There is already a button provided to edit, delete, and categorize transactions, though you could choose a different UX.
* [Accounts Service](../src/core/services/account/account.service.ts) is used to load the list of accounts, which contains the balance information.
* [Categories Service](../src/core/services/categories/categories.service.ts) is used to manage the list of categories, with methods for creating, editing, and removing categories.
* [Transactions Service](../src/core/services/transactions/transactions.service.ts) is used to load the list of transactions, create, edit, and delete.
