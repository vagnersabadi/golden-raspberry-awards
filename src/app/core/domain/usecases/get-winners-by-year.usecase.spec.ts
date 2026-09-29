import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GetWinnersByYearUseCase } from './get-winners-by-year.usecase';
import { MOVIE_REPOSITORY_TOKEN, MovieRepository } from '@domain/repositories/movie.repository';
import { Movie } from '@domain/models/movie.model';
import { describe, it, expect, beforeEach } from 'vitest';

describe('GetWinnersByYearUseCase', () => {
  let useCase: GetWinnersByYearUseCase;
  let mockRepository: Partial<MovieRepository>;

  const mockMovies: Movie[] = [
    {
      id: 1,
      year: 1986,
      title: 'Under the Cherry Moon',
      studios: ['Warner Bros.'],
      producers: ['Bob Cavallo'],
      winner: true,
    },
    {
      id: 2,
      year: 1986,
      title: 'Howard the Duck',
      studios: ['Universal Pictures'],
      producers: ['Gloria Katz'],
      winner: true,
    },
  ];

  beforeEach(() => {
    mockRepository = {
      getWinnersByYear: (year: number) => of(mockMovies.filter((m) => m.year === year)),
    };

    TestBed.configureTestingModule({
      providers: [
        GetWinnersByYearUseCase,
        {
          provide: MOVIE_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    });

    useCase = TestBed.inject(GetWinnersByYearUseCase);
  });

  it('deve ser instanciado corretamente', () => {
    expect(useCase).toBeDefined();
  });

  it('deve delegar a busca de filmes vencedores para o repositório passando o ano informado', () => {
    useCase.execute(1986).subscribe((movies) => {
      expect(movies).toHaveLength(2);
      expect(movies).toEqual(mockMovies);
    });
  });

  it('deve retornar lista vazia quando não houver filmes para o ano', () => {
    useCase.execute(2099).subscribe((movies) => {
      expect(movies).toEqual([]);
    });
  });
});
