import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { MessageService } from 'primeng/api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const messageService = inject(MessageService);
  const destroyRef = inject(DestroyRef);

  const clonedReq = req.clone({
    withCredentials: true,
  });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/Logout') && !req.url.includes('/Status')) {
        messageService.add({
          severity: 'warn',
          summary: 'Session Expired',
          detail: 'Please log in again.',
        });
        authService.logout().pipe(takeUntilDestroyed(destroyRef)).subscribe();
      }

      return throwError(() => error);
    })
  );
};
