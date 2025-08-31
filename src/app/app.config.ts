import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: definePreset(Aura, {
          semantic: {
            primary: {
              50: '{surface.50}',
              100: '{surface.100}',
              200: '{surface.200}',
              300: '{surface.300}',
              400: '{surface.400}',
              500: '{surface.500}',
              600: '{surface.600}',
              700: '{surface.700}',
              800: '{surface.800}',
              900: '{surface.900}',
              950: '{surface.950}',
            },
            colorScheme: {
              light: {
                primary: {
                  color: '{primary.950}',
                  contrastColor: '#ffffff',
                  hoverColor: '{primary.800}',
                  activeColor: '{primary.700}',
                },
                highlight: {
                  background: '{primary.950}',
                  focusBackground: '{primary.700}',
                  color: '#ffffff',
                  focusColor: '#ffffff',
                },
              },
              dark: {
                primary: {
                  color: '{primary.50}',
                  contrastColor: '{primary.950}',
                  hoverColor: '{primary.200}',
                  activeColor: '{primary.300}',
                },
                highlight: {
                  background: '{primary.50}',
                  focusBackground: '{primary.300}',
                  color: '{primary.950}',
                  focusColor: '{primary.950}',
                },
              },
            },
          },
        }),
      },
    }),
  ],
};
