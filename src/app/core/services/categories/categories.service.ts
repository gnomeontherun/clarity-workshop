import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../models/category';
import { environment } from '../../../../environments/environment';

@Injectable()
export class CategoriesService {
  constructor(private http: HttpClient) {}

  private url = `${environment.api}/categories`;
  private buildUrl(id: string) {
    return `${this.url}/${id}`;
  }

  /* 
   * @description   Get a list of of categories
   */
  public query() {
    return this.http.get<Category[]>(this.url);
  }

  public get(id: string) {
    return this.http.get<Category>(this.buildUrl(id));
  }

  public update(id: string, category: Category) {
    return this.http.put(this.buildUrl(id), category);
  }

  public create(category: Account) {
    return this.http.post(this.url, category);
  }

  public remove(id: string) {
    return this.http.delete(this.buildUrl(id));
  }
}
