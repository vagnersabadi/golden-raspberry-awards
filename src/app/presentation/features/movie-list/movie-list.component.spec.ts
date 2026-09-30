import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MovieListComponent } from './movie-list.component';
import { GetMoviesUseCase } from '@domain/usecases/get-movies.usecase';
import { PagedResponse } from '@domain/models/pagination.model';
import { Movie } from '@domain/models/movie.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('MovieListComponent', () => {
  let component: MovieListComponent;
  let mockGetMoviesUseCase: { execute: ReturnType<typeof vi.fn> };

  const mockResponse: PagedResponse<Movie> = {
    content: [
      {
        id: 1,
        year: 1980,
        title: "Can't Stop the Music",
        studios: ['Associated Film Distribution'],
        producers: ['Allan Carr'],
        winner: true,
      },
      {
        id: 2,
        year: 1980,
        title: 'Cruising',
        studios: ['Lorimar Productions'],
        producers: ['Jerry Weintraub'],
        winner: false,
      },
    ],
    pageable: {
      sort: { sorted: false, unsorted: true },
      pageSize: 15,
      pageNumber: 0,
      offset: 0,
      paged: true,
      unpaged: false,
    },
    totalElements: 2,
    last: true,
    totalPages: 1,
    first: true,
    sort: { sorted: false, unsorted: true },
    number: 0,
    numberOfElements: 2,
    size: 15,
  };

  beforeEach(async () => {
    mockGetMoviesUseCase = {
      execute: vi.fn().mockReturnValue(of(mockResponse)),
    };

    await TestBed.configureTestingModule({
      imports: [MovieListComponent],
      providers: [{ provide: GetMoviesUseCase, useValue: mockGetMoviesUseCase }],
    }).compileComponents();

    const fixture = TestBed.createComponent(MovieListComponent);
    component = fixture.componentInstance;
  });

  it('deve instanciar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve buscar e carregar a lista de filmes inicial no ngOnInit', async () => {
    component.ngOnInit();

    // Aguardar o debounceTime
    await new Promise((resolve) => setTimeout(resolve, 400));

    expect(mockGetMoviesUseCase.execute).toHaveBeenCalledWith({
      page: 0,
      size: 15,
      year: undefined,
      winner: undefined,
    });
    expect(component.movies()).toEqual(mockResponse.content);
    expect(component.totalElements()).toBe(2);
  });

  it('deve resetar para a primeira página ao alterar filtros', () => {
    component.currentPage.set(3);
    component.filterYear.set('1985');
    component.onFilterChange();

    expect(component.currentPage()).toBe(0);
  });

  it('deve atualizar página e tamanho ao acionar onPageChange', async () => {
    component.ngOnInit();
    component.onPageChange({ pageIndex: 2, pageSize: 25, length: 50 });

    await new Promise((resolve) => setTimeout(resolve, 400));

    expect(component.currentPage()).toBe(2);
    expect(component.pageSize()).toBe(25);
  });

  it('deve aceitar filterYear como number e executar busca com ano numérico', async () => {
    component.ngOnInit();
    // Simula binding do input type=number do Angular que entrega tipo number
    component.filterYear.set(1986 as unknown as string);
    component.onFilterChange();

    await new Promise((resolve) => setTimeout(resolve, 400));

    expect(mockGetMoviesUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        year: 1986,
      })
    );
  });
});
