import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(public userService: UserService, private router: Router) {
    // Redirect user to their accounts if they are logged in
    if (this.userService.user) {
      this.router.navigateByUrl('/accounts');
    }
  }
}
