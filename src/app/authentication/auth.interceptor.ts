import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { ToastService } from '../shared/toast/toast.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const destroyRef = inject(DestroyRef);
  const router = inject(Router);
  const currentUser = authService.currentUser();

  // If the request is for the refresh token endpoint, add the refresh token to the request
  if (req.url.includes('/auth/refresh') && currentUser?.refresh_token) {
    const refreshReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${currentUser.refresh_token}`,
      },
    });

    return next(refreshReq);
  }

  // Add Bearer token to request if user is authenticated
  if (currentUser?.personal_access_token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${currentUser.personal_access_token}`,
      },
    });

    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors (token expired)
        if (
          error.status === 401 &&
          currentUser?.refresh_token &&
          !req.url.includes('/auth/') // Avoid infinite loops on auth endpoints
        ) {
          // Attempt to refresh the access token
          return authService.refreshToken().pipe(
            switchMap((newTokenData) => {
              // Retry the original request with the new token
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newTokenData.personal_access_token}`,
                },
              });

              return next(retryReq);
            }),
            catchError(() => {
              // Refresh token has expired, show error message to user
              toastService.showError(
                'Your session has expired. Please log in again.'
              );

              // Optionally, you can redirect to login or clear user data
              authService
                .logout()
                .pipe(takeUntilDestroyed(destroyRef))
                .subscribe({
                  complete: () => {
                    router.navigate(['/login']);
                  },
                });

              return throwError(() => error);
            })
          );
        }

        // For all other errors, just pass them through
        return throwError(() => error);
      })
    );
  }

  // If no token available, proceed with original request
  return next(req);
};
