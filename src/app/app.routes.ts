import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('@presentation/features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    title: 'Dashboard - Golden Raspberry Awards',
  },
  {
    path: 'movies',
    loadComponent: () =>
      import('@presentation/features/movie-list/movie-list.component').then(
        (m) => m.MovieListComponent
      ),
    title: 'List - Golden Raspberry Awards',
  },
  { path: '**', redirectTo: 'dashboard' },
];

