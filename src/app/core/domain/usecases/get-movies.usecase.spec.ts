import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GetMoviesUseCase } from './get-movies.usecase';
import { MOVIE_REPOSITORY_TOKEN, MovieRepository } from '@domain/repositories/movie.repository';
import { Movie, MovieFilterParams } from '@domain/models/movie.model';
import { PagedResponse } from '@domain/models/pagination.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('GetMoviesUseCase', () => {
  let useCase: GetMoviesUseCase;
  let mockRepository: Partial<MovieRepository>;

  const mockPagedResponse: PagedResponse<Movie> = {
    content: [
      {
        id: 1,
        year: 1980,
        title: "Can't Stop the Music",
        studios: ['Associated Film Distribution'],
        producers: ['Allan Carr'],
        winner: true,
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
    totalElements: 1,
    last: true,
    totalPages: 1,
    first: true,
    sort: { sorted: false, unsorted: true },
    number: 0,
    numberOfElements: 1,
    size: 15,
  };

  beforeEach(() => {
    mockRepository = {
      getMovies: vi.fn().mockReturnValue(of(mockPagedResponse)),
    };

    TestBed.configureTestingModule({
      providers: [
        GetMoviesUseCase,
        {
          provide: MOVIE_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    });

    useCase = TestBed.inject(GetMoviesUseCase);
  });

  it('deve ser instanciado corretamente', () => {
    expect(useCase).toBeDefined();
  });

  it('deve repassar os parâmetros de filtro e paginação para o repositório', () => {
    const params: MovieFilterParams = { page: 0, size: 15, winner: true, year: 1980 };

    useCase.execute(params).subscribe((response) => {
      expect(response).toEqual(mockPagedResponse);
    });

    expect(mockRepository.getMovies).toHaveBeenCalledWith(params);
  });
});
