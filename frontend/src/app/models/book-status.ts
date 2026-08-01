export interface BookStatusOption {
  value: string;
  label: string;
  icon: string;
}

export const BOOK_STATUSES: BookStatusOption[] = [
  { value: 'MUON_DOC', label: 'Muốn đọc', icon: 'bookmark_add' },
  { value: 'DANG_DOC', label: 'Đang đọc', icon: 'menu_book' },
  { value: 'DA_DOC', label: 'Đã đọc', icon: 'task_alt' },
  { value: 'BO_QUA', label: 'Bỏ qua', icon: 'block' },
];

export function bookStatusLabel(status: string | null): string {
  return BOOK_STATUSES.find((item) => item.value === status)?.label ?? status ?? '—';
}

export function bookStatusIcon(status: string | null): string {
  return BOOK_STATUSES.find((item) => item.value === status)?.icon ?? 'help';
}
