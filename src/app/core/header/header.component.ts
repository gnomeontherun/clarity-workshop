import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router: Router, public userService: UserService) {}

  /**
   * How to use service to logout
   */
  // this.userService.logout().subscribe(() => {
  //   // Logged out
  // }, error => {
  //   // Error logging out
  // });
}
