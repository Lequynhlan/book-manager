import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book, BookRequest, ErrorResponse } from '../../models/models';
import { BookService } from '../../services/book.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePickerComponent } from '../date-picker/date-picker';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BOOK_STATUSES, bookStatusIcon, bookStatusLabel } from '../../models/book-status';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePickerComponent,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css',
})
export class BookFormComponent implements OnInit {
  readonly statusLabel = bookStatusLabel;
  readonly statusIcon = bookStatusIcon;
  @Input() book: Book | null = null;
  @Input() categories: string[] = [];
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  errorMessage = '';
  fieldErrors: Record<string, string> = {};
  statuses = BOOK_STATUSES;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      author: ['', [Validators.maxLength(200)]],
      category: ['', [Validators.maxLength(20)]],
      status: [''],
      rating: [null, [Validators.min(0), Validators.max(5)]],
      description: ['', [Validators.maxLength(2000)]],
      coverUrl: ['', [Validators.maxLength(500)]],
      link: ['', [Validators.maxLength(500)]],
      startedDate: [''],
      finishedDate: [''],
    });
  }

  get isEdit(): boolean {
    return !!this.book;
  }

  get categoryOptions(): string[] {
    return [...new Set([...this.categories, ...(this.book?.category ? [this.book.category] : [])])];
  }

  ngOnInit(): void {
    if (this.book) {
      this.form.patchValue({
        title: this.book.title,
        author: this.book.author || '',
        category: this.book.category || '',
        status: this.book.status || '',
        rating: this.book.rating ?? null,
        description: this.book.description || '',
        coverUrl: this.book.coverUrl || '',
        link: this.book.link || '',
        startedDate: this.book.startedDate || '',
        finishedDate: this.book.finishedDate || '',
      });
      const cat = this.book.category || '';
      this.form.controls['category'].setValue(cat);
    }
  }

  onClear(controlName: string): void {
    this.form.controls[controlName].setValue('');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.fieldErrors = {};
    const value = this.form.value;
    const payload: BookRequest = {
      title: value.title.trim(),
      author: value.author?.trim() || null,
      category: value.category?.trim() || null,
      status: value.status || null,
      rating: value.rating ?? 0,
      description: value.description?.trim() || null,
      coverUrl: value.coverUrl?.trim() || null,
      link: value.link?.trim() || null,
      startedDate: value.startedDate || null,
      finishedDate: value.finishedDate || null,
    };

    const request = this.book
      ? this.bookService.update(this.book.id, payload)
      : this.bookService.create(payload);

    request.subscribe({
      next: () => this.saved.emit(),
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        const body = err.error as ErrorResponse;
        this.errorMessage = body?.message || 'Lưu sách thất bại, vui lòng thử lại';
        if (body?.fieldErrors) {
          this.fieldErrors = body.fieldErrors;
        }
      },
    });
  }
}
