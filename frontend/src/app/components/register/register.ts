import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ErrorResponse } from '../../models/models';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatIconModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  errorMessage = '';
  fieldErrors: Record<string, string> = {};

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.maxLength(100)]],
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: (g) => (g.get('password')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true }) }
    );
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.fieldErrors = {};
    const { confirmPassword, ...payload } = this.form.value;
    this.auth.register(payload).subscribe({
      next: () => this.router.navigate(['/books']),
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        const body = err.error as ErrorResponse;
        this.errorMessage = body?.message || 'Đăng ký thất bại, vui lòng thử lại';
        if (body?.fieldErrors) {
          this.fieldErrors = body.fieldErrors;
        }
      },
    });
  }
}
