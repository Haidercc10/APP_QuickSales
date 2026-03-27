import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SvCacheService } from 'src/app/Services/Cache/sv-cache.service';

export const authGuard: CanActivateFn = () => {
  const cacheService = inject(SvCacheService);
  const router = inject(Router);

  if (cacheService.hasToken()) {
    console.log('Sí');
    return true;
  }

  return router.createUrlTree(['']);
};
