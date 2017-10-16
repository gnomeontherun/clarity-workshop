import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../../models/account';
import { environment } from '../../../../environments/environment';

@Injectable()
export class AccountsService {
  constructor(private http: HttpClient) {}

  private url = `${environment.api}/accounts`;
  private buildUrl(id: string) {
    return `${this.url}/${id}`;
  }

  public query() {
    return this.http.get<Account[]>(this.url);
  }

  public get(id: string) {
    return this.http.get<Account>(this.buildUrl(id));
  }

  public update(id: string, account: Account) {
    return this.http.put(this.buildUrl(id), account);
  }

  public create(account: Account) {
    return this.http.put(this.url, account);
  }

  public remove(id: string) {
    return this.http.delete(this.buildUrl(id));
  }
}
