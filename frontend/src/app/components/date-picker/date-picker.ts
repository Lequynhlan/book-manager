import { Component, ElementRef, HostListener, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.css',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerComponent), multi: true },
  ],
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() placeholder = 'dd/mm/yyyy';

  weekdays = WEEKDAYS;
  value: string | null = null; // format: yyyy-MM-dd
  open = false;
  disabled = false;
  viewYear = new Date().getFullYear();
  viewMonth = new Date().getMonth(); // 0-based
  panelStyle: { top: string; left: string; width: string } = { top: '0px', left: '0px', width: '0px' };

  private onChange: (v: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef) {}

  get displayValue(): string {
    return this.value ? this.toDisplay(this.value) : '';
  }

  get days(): Date[] {
    const first = new Date(this.viewYear, this.viewMonth, 1, 12);
    const offset = (first.getDay() + 6) % 7; // tuần bắt đầu từ thứ 2
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(this.viewYear, this.viewMonth, 1 - offset + i, 12);
      return d;
    });
  }

  // ---------- ControlValueAccessor ----------
  writeValue(v: string | null): void {
    this.value = v || null;
    this.syncView();
  }

  registerOnChange(fn: (v: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  // ---------- UI ----------
  toggle(): void {
    if (this.disabled) return;
    if (this.open) {
      this.close();
    } else {
      this.syncView();
      this.positionPanel();
      this.open = true;
    }
  }

  prevMonth(): void {
    if (this.viewMonth === 0) {
      this.viewMonth = 11;
      this.viewYear--;
    } else {
      this.viewMonth--;
    }
  }

  nextMonth(): void {
    if (this.viewMonth === 11) {
      this.viewMonth = 0;
      this.viewYear++;
    } else {
      this.viewMonth++;
    }
  }

  selectDay(d: Date): void {
    this.value = this.format(d);
    this.onChange(this.value);
    this.onTouched();
    this.close();
  }

  selectToday(): void {
    this.selectDay(new Date());
  }

  clearValue(): void {
    this.value = null;
    this.onChange(null);
    this.onTouched();
    this.close();
  }

  close(): void {
    this.open = false;
  }

  isToday(d: Date): boolean {
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  }

  isSelected(d: Date): boolean {
    return !!this.value && this.format(d) === this.value;
  }

  isOutOfMonth(d: Date): boolean {
    return d.getMonth() !== this.viewMonth;
  }

  // ---------- helpers ----------
  private syncView(): void {
    const d = this.value ? this.parse(this.value) : new Date();
    if (d) {
      this.viewYear = d.getFullYear();
      this.viewMonth = d.getMonth();
    }
  }

  private positionPanel(): void {
    const input = this.el.nativeElement.querySelector('.date-input') as HTMLElement;
    if (!input) return;
    const rect = input.getBoundingClientRect();
    this.panelStyle = {
      top: `${rect.bottom + 6}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
    };
  }

  private format(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  private parse(v: string): Date | null {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3], 12);
  }

  private toDisplay(v: string): string {
    const d = this.parse(v);
    if (!d) return v;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  }

  // Dùng document:mousedown thay vì document:click — modal cha (book-form)
  // chặn sự kiện click bằng $event.stopPropagation() nên click bên trong modal
  // không bao giờ tới document, panel datepicker sẽ không đóng được.
  // mousedown không bị stopPropagation chặn, luôn bong bóng lên document.
  @HostListener('document:mousedown', ['$event'])
  onDocMousedown(e: MouseEvent): void {
    if (this.open && !this.el.nativeElement.contains(e.target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  @HostListener('document:scroll')
  @HostListener('window:resize')
  onReposition(): void {
    if (this.open) this.positionPanel();
  }
}
