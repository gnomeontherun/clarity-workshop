import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../user/user.service';

@Injectable()
export class UserGuardService implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(): boolean {
    if (!!this.userService.user) {
      return true;
    } else {
      this.router.navigateByUrl('/');
      return false;
    }
  }
}
