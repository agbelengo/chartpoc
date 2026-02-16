import { ApplicationConfig, provideZonelessChangeDetection, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'; // <--- New

export const appConfig: ApplicationConfig = {
  providers: [
   
    provideZonelessChangeDetection(), // <--- Modern, Signal-friendly, and no Zone.js required
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideCharts(withDefaultRegisterables())
  ]
};
