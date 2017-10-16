import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '@app/core';
import { environment } from '../../../../environments/environment';

@Injectable()
export class TransactionsService {
  constructor(private http: HttpClient) {}

  private url = `${environment.api}/transactions`;
  private buildUrl(id?: string, filters?: string[]) {
    let url = this.url;
    if (id) {
      url += `/${id}`;
    }
    if (filters) {
      url += `?${filters.join('&')}`;
    }
    return url;
  }

  public query(filters?: string[], full = false) {
    return this.http.get<Account[]>(this.buildUrl(null, filters), {
      observe: 'response'
    });
  }

  public get(id: string) {
    return this.http.get<Account>(this.buildUrl(id));
  }

  public update(id: string, account: Account) {
    return this.http.put(this.buildUrl(id), account);
  }

  public create(account: Account) {
    return this.http.post(this.url, account);
  }

  public remove(id: string) {
    return this.http.delete(this.buildUrl(id));
  }
}
