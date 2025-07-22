import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from './loader.service';
import { finalize } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  // Skip loading if the request has the 'skip-loading' header
  const skipLoading = req.headers.has('skip-loading');

  if (!skipLoading) {
    loaderService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!skipLoading) {
        loaderService.hide();
      }
    })
  );
};
