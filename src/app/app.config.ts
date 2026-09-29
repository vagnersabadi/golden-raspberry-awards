import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { MOVIE_REPOSITORY_TOKEN } from '@domain/repositories/movie.repository';
import { MovieHttpRepository } from '@infrastructure/repositories/movie-http.repository';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideRouter(routes, withComponentInputBinding()),
    // Injeção de dependência Clean Architecture: Interface ligada à Implementação
    {
      provide: MOVIE_REPOSITORY_TOKEN,
      useClass: MovieHttpRepository,
    },
  ],
};

