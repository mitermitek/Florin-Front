import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loaderInterceptor } from './shared/loader/loader.interceptor';
import { authInterceptor } from './authentication/auth.interceptor';
import { provideMatomo, withRouter } from 'ngx-matomo-client';
import { environment } from '../environments/environment.development';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, loaderInterceptor])),
    provideMatomo(
      { trackerUrl: 'https://matomo.mitermitek.fr/', siteId: '2', disabled: !environment.production },
      withRouter(),
    ),
  ],
};
