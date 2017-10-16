import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { User } from '../models/user';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router: Router, private userService: UserService) {}

  /**
   * How to use the service to login
   */
  // this.userService.login(email, password).subscribe((user: User) => {
  //     // Success, you'll get the user object, and it is persisted in localstorage for you
  //   },
  //   error => {
  //     // `error` is an HttpErrorResponse object type
  //   }
  // );
}
