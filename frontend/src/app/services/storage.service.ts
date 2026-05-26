import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * @class StorageService
 * @description Coordinates REST data exchanges for both inventory items and tracking categories.
 * Provides complete CRUD operations integrated with JWT token authentication.
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * @private
   * @property {string} baseApi - The root URL endpoint for the backend NestJS service application.
   */
  private baseApi = 'http://localhost:3000';

  /**
   * @constructor
   * @param {HttpClient} http - Angular's built-in HTTP client service used to dispatch network requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * @private
   * @method getAuthHeaders
   * @description Pulls the active JWT token from browser local storage using the 'storage_jwt' key
   * and wraps it into a standard HTTP Bearer Authorization header object.
   * @returns {HttpHeaders} HttpHeaders instance populated with the bearer authentication token.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('storage_jwt') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // --- Categories CRUD Methods ---

  /**
   * @method getCategories
   * @description GET request to retrieve all categories.
   * @returns {Observable<any[]>} Observable stream resolving to an array of category records.
   */
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApi}/categories`, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * @method createCategory
   * @description POST request to create new category
   * @param {string} name - name for new category
   * @returns {Observable<any>} Observable stream resolving to the newly created backend category entity object.
   */
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
   * @description PATCH request to update existing category
   * @param {number} id - identifier of the targeted category
   * @param {string} categoryName - updated name
   * @returns {Observable<any>} Observable stream resolving to the updated backend category entity context payload.
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

  /**
   * @method deleteCategory
   * @description DELETE request to delete category
   * @param {number} id - identifier of the category
   * @returns {Observable<any>} Observable stream tracking operation completion confirmation metadata.
   */
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseApi}/categories/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // --- Items CRUD Methods ---

  /**
   * @method getItems
   * @description GET request to query all items
   * @returns {Observable<any[]>} Observable stream resolving to an array of system inventory item records.
   */
  getItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApi}/items`, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * @method createItem
   * @description POST request to create new item
   * @param {any} itemData - object of required parameters
   * @returns {Observable<any>} Observable stream resolving to the freshly persisted inventory backend record context.
   */
  createItem(itemData: any): Observable<any> {
    return this.http.post(`${this.baseApi}/items`, itemData, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * @method updateItem
   * @description PATCH request to save inline edits for item
   * @param {number} id - identifier of the item targeted for update.
   * @param {any} itemData - object of updated parameters
   * @returns {Observable<any>} Observable stream resolving to the mutated backend item record framework state.
   */
  updateItem(id: number, itemData: any): Observable<any> {
    return this.http.patch(`${this.baseApi}/items/${id}`, itemData, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * @method deleteItem
   * @description DELETE request to drop a item completely.
   * @param {number} id - identifier of the item targeted for discard.
   * @returns {Observable<any>} Observable stream tracking operation completion confirmation metadata.
   */
  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.baseApi}/items/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
