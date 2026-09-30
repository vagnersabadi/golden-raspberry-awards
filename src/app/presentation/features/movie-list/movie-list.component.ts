import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subject, debounceTime, switchMap, tap } from 'rxjs';
import { GetMoviesUseCase } from '@domain/usecases/get-movies.usecase';
import { Movie } from '@domain/models/movie.model';

@Component({
  selector: 'app-movie-list',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
  ],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListComponent implements OnInit {
  private readonly getMoviesUseCase = inject(GetMoviesUseCase);

  readonly movies = signal<Movie[]>([]);
  readonly totalElements = signal<number>(0);
  readonly currentPage = signal<number>(0);
  readonly pageSize = signal<number>(15);

  readonly filterYear = signal<string>('');
  readonly filterWinner = signal<string>(''); // '': Todos, 'true': Sim, 'false': Não

  readonly displayedColumns: string[] = ['id', 'year', 'title', 'winner'];

  readonly winnerOptions = [
    { label: 'Yes/No', value: '' },
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];

  private readonly searchSubject$ = new Subject<void>();

  ngOnInit(): void {
    // Debounce no filtro de busca para evitar requisições desnecessárias a cada tecla
    this.searchSubject$
      .pipe(
        debounceTime(350),
        switchMap(() => this.fetchMovies())
      )
      .subscribe();

    this.triggerSearch();
  }

  triggerSearch(): void {
    this.searchSubject$.next();
  }

  onFilterChange(): void {
    this.currentPage.set(0); // Reseta a paginação ao mudar os filtros
    this.triggerSearch();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.triggerSearch();
  }

  private fetchMovies() {
    const yearVal = this.filterYear().trim();
    const winnerVal = this.filterWinner();

    return this.getMoviesUseCase
      .execute({
        page: this.currentPage(),
        size: this.pageSize(),
        year: yearVal ? parseInt(yearVal, 10) : undefined,
        winner: winnerVal === '' ? undefined : winnerVal === 'true',
      })
      .pipe(
        tap((res) => {
          this.movies.set(res.content);
          this.totalElements.set(res.totalElements);
        })
      );
  }
}
