import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SvCacheService } from './Services/Cache/sv-cache.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const cacheService = inject(SvCacheService);
  const token = cacheService.getToken();

  if (!token) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};
