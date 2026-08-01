import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book, ErrorResponse } from '../../models/models';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { BookFormComponent } from '../book-form/book-form';
import { BookDetailComponent } from '../book-detail/book-detail';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { bookStatusIcon, bookStatusLabel } from '../../models/book-status';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    BookFormComponent,
    BookDetailComponent,
    ConfirmDialogComponent,
    FormsModule,
    NgClass,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookListComponent implements OnInit {
  readonly statusLabel = bookStatusLabel;
  readonly statusIcon = bookStatusIcon;
  books = signal<Book[]>([]);
  categories = signal<string[]>([]);
  statuses = signal<string[]>([]);
  keyword = signal('');
  selectedCategory = signal('');
  selectedStatus = signal('');
  loading = signal(false);
  errorMessage = signal('');
  showForm = false;
  editingBook: Book | null = null;
  selectedBook: Book | null = null;
  pendingDelete: Book | null = null;
  searchTimeout: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private bookService: BookService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadMeta();
  }

  get userName(): string {
    return this.auth.user?.fullName || this.auth.user?.username || '';
  }

  get userInitial(): string {
    const name = this.userName;
    return name ? name.trim().charAt(0).toUpperCase() : '';
  }

  loadBooks(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.bookService
      .getAll(this.selectedCategory() || undefined, this.selectedStatus() || undefined, this.keyword() || undefined)
      .subscribe({
        next: (books) => {
          this.books.set(books);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.errorMessage.set('Không thể tải danh sách sách');
        },
      });
  }

  loadMeta(): void {
    this.bookService.getCategories().subscribe((c) => this.categories.set(c));
    this.bookService.getStatuses().subscribe((s) => this.statuses.set(s));
  }

  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.loadBooks(), 300);
  }

  onCategoryChange(cat: string): void {
    this.selectedCategory.set(cat);
    this.loadBooks();
  }

  onStatusChange(status: string): void {
    this.selectedStatus.set(status);
    this.loadBooks();
  }

  clearFilters(): void {
    this.selectedCategory.set('');
    this.selectedStatus.set('');
    this.keyword.set('');
    this.loadBooks();
  }

  openCreate(): void {
    this.editingBook = null;
    this.showForm = true;
  }

  openEdit(book: Book): void {
    this.editingBook = book;
    this.showForm = true;
  }

  onFormSaved(): void {
    this.showForm = false;
    this.loadBooks();
    this.loadMeta();
  }

  onFormCancelled(): void {
    this.showForm = false;
  }

  deleteBook(book: Book): void {
    this.pendingDelete = book;
  }

  confirmDelete(): void {
    if (!this.pendingDelete) return;
    const book = this.pendingDelete;
    this.pendingDelete = null;
    this.bookService.delete(book.id).subscribe({
      next: () => this.loadBooks(),
      error: (err: HttpErrorResponse) => {
        const body = err.error as ErrorResponse;
        alert(body?.message || 'Xóa sách thất bại');
      },
    });
  }

  cancelDelete(): void {
    this.pendingDelete = null;
  }

  openDetail(book: Book): void {
    this.selectedBook = book;
  }

  closeDetail(): void {
    this.selectedBook = null;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  statusClass(status: string | null): string {
    const map: Record<string, string> = {
      MUON_DOC: 'status-want',
      DANG_DOC: 'status-reading',
      DA_DOC: 'status-done',
      BO_QUA: 'status-skip',
    };
    return status ? map[status] || 'status-default' : 'status-default';
  }
}
