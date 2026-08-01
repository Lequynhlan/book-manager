import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Book } from '../../models/models';
import { MatIconModule } from '@angular/material/icon';
import { bookStatusIcon, bookStatusLabel } from '../../models/book-status';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, NgClass, MatIconModule],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css',
})
export class BookDetailComponent {
  readonly statusLabel = bookStatusLabel;
  readonly statusIcon = bookStatusIcon;
  @Input() book!: Book;
  @Output() closed = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closed.emit();
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
