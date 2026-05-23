import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Added ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';

/**
 * @class DashboardComponent
 * @description The core unified control cockpit displaying full interactive stock and grouping tables.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  editingItemId: number | null = null;
  editingCategoryId: number | null = null;

  editItemData = { item_name: '', quantity: 0, price: 0, category_id: null as number | null };
  editCategoryName = '';

  items: any[] = [];
  categories: any[] = [];

  isAdmin = false;
  showRegisterModal = false;
  newUser = { username: '', password: '', role: 'user' };
  registrationMessage = '';
  registrationSuccess = false;

  // Creation bindings
  newCategoryName = '';
  newItem = { item_name: '', category_id: '', quantity: 0, price: 0.0 };

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef, // 2. Inject ChangeDetectorRef here
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.isAdmin = this.authService.getUserRole() === 'admin';
  }

  /**
   * @method loadDashboardData
   * @description Fetches tracking records and enforces strict numerical ID ordering.
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

  openRegisterModal(): void {
    this.showRegisterModal = true;
    this.registrationMessage = ''; // Clear out stale errors from last time
    this.cdr.detectChanges();
  }

  closeRegisterModal(): void {
    this.showRegisterModal = false;
    // Reset form fields
    this.newUser = { username: '', password: '', role: 'user' };
    this.cdr.detectChanges();
  }

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
        // Clear input fields on success
        this.newUser = { username: '', password: '', role: 'user' };
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
   * @description Creates a fresh inventory group category.
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

  startEditCategory(category: any): void {
    this.editingCategoryId = category.category_id;
    this.editCategoryName = category.category_name;
    this.cdr.detectChanges(); // Force rendering of input fields immediately
  }

  /**
   * @method saveCategoryUpdate
   * @description Submits patches for category descriptors.
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
   * @description Drops a custom category row cleanly.
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
   * @description Registers new items into active tracking streams.
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

  startEditItem(item: any): void {
    this.editingItemId = item.item_id;
    this.editItemData = {
      item_name: item.item_name,
      quantity: item.quantity,
      price: item.price,
      // Captures the current ID so the dropdown defaults to the correct selection
      category_id: item.category?.category_id || null,
    };
    this.cdr.detectChanges(); // Wakes up Angular to render the dropdown immediately
  }

  /**
   * @method saveItemUpdate
   * @description Saves edits for quantities, pricing, or descriptions inline.
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
   * @description Discards item stock tracking records completely.
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

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
