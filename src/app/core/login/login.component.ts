import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { User } from '../models/user';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form = {
    email: '',
    password: ''
  };
  error = null;

  constructor(private router: Router, private userService: UserService) {}

  login() {
    this.error = null;
    this.userService.login(this.form.email, this.form.password).subscribe(
      (user: User) => {
        this.router.navigateByUrl('/accounts');
      },
      error => {
        this.error = JSON.parse(error.error);
      }
    );
  }

}
