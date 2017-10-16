# Session 1 - Authentication

> “As a user, I need to login and logout so I that I can use the application, view my own data, and end a session.”

The goal for this session is to implement authentication features for the application. This includes login and logout. Clarity defines some of these behaviors but others are open to interpretation, so consider the design patterns and design the best experience you can.

### Objectives and Constraints

* Login should validate client side
* Successful login should take user to their accounts
* Errored login should show a meaningful message
* Logout should immediately logout the user

### Session objectives

* [ ] Each person sketch at least 3 ideas in the first 3 minutes.
* [ ] Share your sketches in the group, 1 minute each.
* [ ] Decide on the best implementation, and sketch it.
* [ ] Collaboratively implement a prototype of the feature, focus on demonstrating the UX over perfection.
* [ ] Prepare some notes to share about _what your implementation is_ and _why you think it is the best_.

### Implementation Notes

* The credentials for the user are
  * Username: `user@vmware.com`
  * Password: `vmware`
* [User](../src/app/core/models/user.ts) model defines the user object
* [User Service](../src/app/core/services/user/user.service.ts) has login/logout methods provided
* User login state is already persisted for you in the [User Service](../src/app/core/services/user/user.service.ts)
* Routes have guards to check if the user is logged in or not before activating
  * [Account Routing Module](../src/app/account/account-routing.module.ts)
  * [Budget Routing Module](../src/app/budget/budget-routing.module.ts)
* The [Login Component](../src/app/core/login/login.component.ts) is already provided for you and has a route in the [App Module](../src/app/app.module.ts)
