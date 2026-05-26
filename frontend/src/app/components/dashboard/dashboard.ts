import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';

/**
 * @class DashboardComponent
 * @description displaying full interactive stock and grouping tables.
 * Coordinates real-time inline CRUD modifications for both categories and items while restricting administrative features based on user privilege roles.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  /**
   * @property {number | null} editingItemId - identifier of the item row currently being altered inline. Null if no item is being edited.
   */
  editingItemId: number | null = null;

  /**
   * @property {number | null} editingCategoryId - identifier of the category row currently being altered inline. Null if no category is being edited.
   */
  editingCategoryId: number | null = null;

  /**
   * @property {Object} editItemData - object containing the mutating properties for the item selected for edits.
   * @property {string} editItemData.item_name
   * @property {number} editItemData.quantity
   * @property {number} editItemData.price
   * @property {number | null} editItemData.category_id - foreign key target category ID.
   */
  editItemData = { item_name: '', quantity: 0, price: 0, category_id: null as number | null };

  /**
   * @property {string} editCategoryName - placeholder to modify category
   */
  editCategoryName = '';

  /**
   * @property {any[]} items - array of all items
   */
  items: any[] = [];

  /**
   * @property {any[]} categories - array of all categories
   */
  categories: any[] = [];

  /**
   * @property {boolean} isAdmin - check user role Admin
   */
  isAdmin = false;

  /**
   * @property {boolean} showRegisterModal - control toggling registration model
   */
  showRegisterModal = false;

  /**
   * @property {Object} newUser - details for new user.
   * @property {string} newUser.username
   * @property {string} newUser.email
   * @property {string} newUser.password
   * @property {string} newUser.role
   */
  newUser = { username: '', email: '', password: '', role: 'user' };

  /**
   * @property {string} registrationMessage - feedback message
   */
  registrationMessage = '';

  /**
   * @property {boolean} registrationSuccess - registration status
   */
  registrationSuccess = false;

  /**
   * @property {string} newCategoryName - Form model string binding dedicated to capturing the label string of a targeted fresh inventory group category.
   */
  newCategoryName = '';

  /**
   * @property {Object} newItem - Form tracking binding dedicated to capturing input parameters when initializing a product item record.
   * @property {string} newItem.item_name - Intended product label identity.
   * @property {string} newItem.category_id - Bound string ID representation of the associated tracking category group mapping.
   * @property {number} newItem.quantity - Initial quantity allocation value.
   * @property {number} newItem.price - Unit valuation currency descriptor float.
   */
  newItem = { item_name: '', category_id: '', quantity: 0, price: 0.0 };

  /**
   * @constructor
   * @param {StorageService} storageService - Injected data engine orchestrating HTTP REST exchanges for physical inventory nodes.
   * @param {AuthService} authService - Injected profile engine managing authentication sessions, roles, and authorization procedures.
   * @param {Router} router - Angular routing pipeline allowing programmatic target routing transformations.
   * @param {ChangeDetectorRef} cdr - Angular viewport change detection reference mechanism explicitly injected to execute synchronous immediate tree refreshes.
   */
  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  /**
   * @method ngOnInit
   * @description Component lifecycle initialization trigger. requests to pull records, reads the active user access role profile
   * @returns {void}
   */
  ngOnInit(): void {
    this.loadDashboardData();
    this.isAdmin = this.authService.getUserRole() === 'admin';
  }

  /**
   * @method loadDashboardData
   * @description load both item and category necessary for display on UI
   * @returns {void}
   */
  loadDashboardData(): void {
    this.storageService.getCategories().subscribe({
      next: (res) => {
        // Sort categories by category_id sequentially
        this.categories = res.sort((a, b) => a.category_id - b.category_id);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading categories:', err),
    });

    this.storageService.getItems().subscribe({
      next: (res) => {
        // Sort items by item_id sequentially
        this.items = res.sort((a, b) => a.item_id - b.item_id);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading items:', err),
    });
  }

  /**
   * @method openRegisterModal
   * @description open registration model
   * @returns {void}
   */
  openRegisterModal(): void {
    this.showRegisterModal = true;
    this.registrationMessage = '';
    this.cdr.detectChanges();
  }

  /**
   * @method closeRegisterModal
   * @description close registeration model
   * @returns {void}
   */
  closeRegisterModal(): void {
    this.showRegisterModal = false;
    this.newUser = { username: '', email: '', password: '', role: 'user' };
    this.cdr.detectChanges();
  }

  /**
   * @method registerNewUser
   * @description Validates form variables and create new user
   * @returns {void}
   */
  registerNewUser(): void {
    if (!this.newUser.username.trim() || !this.newUser.password.trim()) {
      this.registrationMessage = 'Username and password cannot be blank.';
      this.registrationSuccess = false;
      this.cdr.detectChanges();
      return;
    }

    this.authService.registerUser(this.newUser).subscribe({
      next: (res) => {
        this.registrationSuccess = true;
        this.registrationMessage = `Account "${this.newUser.username}" created successfully!`;
        this.newUser = { username: '', email: '', password: '', role: 'user' };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.registrationSuccess = false;
        this.registrationMessage = err.error?.message || 'Failed to create user account.';
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * @method addCategory
   * @description create new category
   * @returns {void}
   */
  addCategory(): void {
    if (!this.newCategoryName.trim()) return;

    this.storageService.createCategory(this.newCategoryName).subscribe({
      next: () => {
        this.newCategoryName = '';
        this.loadDashboardData();
      },
      error: (err) => console.error('Error adding category:', err),
    });
  }

  /**
   * @method startEditCategory
   * @description switch view mode to edit mode
   * @param {any} category - targeted category
   * @returns {void}
   */
  startEditCategory(category: any): void {
    this.editingCategoryId = category.category_id;
    this.editCategoryName = category.category_name;
    this.cdr.detectChanges();
  }

  /**
   * @method saveCategoryUpdate
   * @description update category
   * @param {number} id - identifier of targeted category
   * @returns {void}
   */
  saveCategoryUpdate(id: number): void {
    if (!this.editCategoryName.trim()) return;

    this.storageService.updateCategory(id, this.editCategoryName).subscribe({
      next: () => {
        this.editingCategoryId = null;
        this.loadDashboardData();
      },
      error: (err) => console.error('Error updating category:', err),
    });
  }

  /**
   * @method deleteCategory
   * @description delete category with safety prompt
   * @param {number} id - identifier of targeted category
   * @returns {void}
   */
  deleteCategory(id: number): void {
    if (
      confirm(
        'Are you sure you want to drop this category? (Items pointing here will clear fields)',
      )
    ) {
      this.storageService.deleteCategory(id).subscribe({
        next: () => {
          this.loadDashboardData();
        },
        error: (err) => console.error('Error deleting category:', err),
      });
    }
  }

  /**
   * @method addItem
   * @description create new item
   * @returns {void}
   */
  addItem(): void {
    if (!this.newItem.item_name.trim()) return;

    const body = {
      ...this.newItem,
      category_id: this.newItem.category_id ? Number(this.newItem.category_id) : null,
    };

    this.storageService.createItem(body).subscribe({
      next: () => {
        this.newItem = { item_name: '', category_id: '', quantity: 0, price: 0.0 };
        this.loadDashboardData();
      },
      error: (err) => console.error('Error adding item:', err),
    });
  }

  /**
   * @method startEditItem
   * @description switch view mode to edit mode
   * @param {any} item - The current item
   * @returns {void}
   */
  startEditItem(item: any): void {
    this.editingItemId = item.item_id;
    this.editItemData = {
      item_name: item.item_name,
      quantity: item.quantity,
      price: item.price,
      category_id: item.category?.category_id || null,
    };
    this.cdr.detectChanges();
  }

  /**
   * @method saveItemUpdate
   * @description update the targeted item
   * @param {number} id - identifier for targeted item
   * @returns {void}
   */
  saveItemUpdate(id: number): void {
    this.storageService.updateItem(id, this.editItemData).subscribe({
      next: () => {
        this.editingItemId = null;
        this.loadDashboardData();
      },
      error: (err) => console.error('Error updating item:', err),
    });
  }

  /**
   * @method deleteItem
   * @description delete targeted item with a safety prompt
   * @param {number} id - identifier for targeted item
   * @returns {void}
   */
  deleteItem(id: number): void {
    if (confirm('Permanently drop this item record from stock tracking?')) {
      this.storageService.deleteItem(id).subscribe({
        next: () => {
          this.loadDashboardData();
        },
        error: (err) => console.error('Error deleting item:', err),
      });
    }
  }

  /**
   * @method onLogout
   * @description Breaks down security access states across authorization infrastructure models and changes the active browser routing location to the login interface.
   * @returns {void}
   */
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
