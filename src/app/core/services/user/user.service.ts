import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user';
import { environment } from '../../../../environments/environment';

/*
 * Provides services for authentication
 */
@Injectable()
export class UserService {
  private url = `${environment.api}`;
  private _user: User;

  constructor(private http: HttpClient) {}

  public get user() {
    return this._user;
  }

  /*
   * Method used by the UserGuardService to check the user prior to initializing the application
   */
  init() {
    return Observable.create(observer => {
      this.http.get(`${this.url}/user`).subscribe(
        (user: User) => {
          this._user = user;
          observer.next(user);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /*
   * Method to login, will automatically cache the user in localStorage for persistence
   */
  login(email: string, password: string) {
    return Observable.create(observer => {
      this.http.post(`${this.url}/login`, { email, password }).subscribe(
        (user: User) => {
          this._user = user;
          localStorage.setItem('user', JSON.stringify(user));
          observer.next(user);
          observer.complete();
        },
        error => {
          this._user = null;
          observer.error(error);
        }
      );
    });
  }

  /*
   * Method to login, will automatically clear the logged in cache
   */
  logout() {
    return Observable.create(observer => {
      this.http.post(`${this.url}/logout`, {}).subscribe(
        () => {
          localStorage.removeItem('user');
          this._user = null;
          observer.next();
          observer.complete(null);
        },
        error => {
          this._user = null;
          observer.error(error);
        }
      );
    });
  }
}
