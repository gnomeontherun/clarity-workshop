import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { User } from '../../models/user';

export function UserInitFactory(userService: UserService) {
  return () =>
    new Promise((resolve, reject) => {
      userService.init().subscribe(() => resolve(), () => resolve());
    });
}
