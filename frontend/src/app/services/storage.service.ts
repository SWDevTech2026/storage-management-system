import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * @class StorageService
 * @description Coordinates REST data exchanges for both inventory items and tracking categories.
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private baseApi = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * @method getAuthHeaders
   * @description Pulls the active JWT token from browser local storage using the 'storage_jwt' key.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('storage_jwt') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // --- Categories CRUD Methods ---
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApi}/categories`, {
      headers: this.getAuthHeaders(),
    });
  }

  createCategory(name: string): Observable<any> {
    return this.http.post(
      `${this.baseApi}/categories`,
      { category_name: name },
      {
        headers: this.getAuthHeaders(),
      },
    );
  }

  /**
   * @method updateCategory
   * @description Updates an existing category profile.
   */
  updateCategory(id: number, categoryName: string): Observable<any> {
    return this.http.patch(
      `${this.baseApi}/categories/${id}`,
      { category_name: categoryName },
      {
        headers: this.getAuthHeaders(),
      },
    );
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseApi}/categories/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // --- Items CRUD Methods ---
  getItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApi}/items`, {
      headers: this.getAuthHeaders(),
    });
  }

  createItem(itemData: any): Observable<any> {
    return this.http.post(`${this.baseApi}/items`, itemData, {
      headers: this.getAuthHeaders(),
    });
  }

  updateItem(id: number, itemData: any): Observable<any> {
    return this.http.patch(`${this.baseApi}/items/${id}`, itemData, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.baseApi}/items/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
