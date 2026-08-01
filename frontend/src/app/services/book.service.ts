import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Book, BookRequest } from '../models/models';
import { API_URL } from './auth.service';

@Injectable({ providedIn: 'root' })
export class BookService {
  constructor(private http: HttpClient) {}

  getAll(category?: string, status?: string, keyword?: string): Observable<Book[]> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    if (status) params = params.set('status', status);
    if (keyword) params = params.set('keyword', keyword);
    return this.http.get<Book[]>(`${API_URL}/books`, { params }).pipe(
      tap((books) => console.log('[BookService] loaded', books?.length, 'books')),
      catchError((err) => {
        console.error('[BookService] error', err);
        return throwError(() => err);
      })
    );
  }

  getById(id: number): Observable<Book> {
    return this.http.get<Book>(`${API_URL}/books/${id}`);
  }

  create(data: BookRequest): Observable<Book> {
    return this.http.post<Book>(`${API_URL}/books`, data);
  }

  update(id: number, data: BookRequest): Observable<Book> {
    return this.http.put<Book>(`${API_URL}/books/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/books/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${API_URL}/books/meta/categories`);
  }

  getStatuses(): Observable<string[]> {
    return this.http.get<string[]>(`${API_URL}/books/meta/statuses`);
  }
}
