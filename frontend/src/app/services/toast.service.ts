import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Toast message tập trung (MatSnackBar) — góc trên bên phải.
 * - success(): xanh lá, icon check
 * - error(): đỏ, icon error
 * Hiển thị 3s, tự đóng; toast cũ bị thay khi có toast mới.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string): void {
    this.show(message, 'success', 'check_circle');
  }

  error(message: string): void {
    this.show(message, 'error', 'error');
  }

  private show(message: string, type: 'success' | 'error', icon: string): void {
    this.snackBar.dismiss();
    this.snackBar.openFromComponent(ToastContentComponent, {
      duration: 3000,
      panelClass: ['app-toast', `app-toast-${type}`],
      verticalPosition: 'top',
      horizontalPosition: 'right',
      data: { message, icon },
    });
  }
}

import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-toast-content',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="toast-content">
      <mat-icon class="toast-icon" aria-hidden="true">{{ data.icon }}</mat-icon>
      <span class="toast-message">{{ data.message }}</span>
    </div>
  `,
})
export class ToastContentComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string; icon: string }) {}
}
