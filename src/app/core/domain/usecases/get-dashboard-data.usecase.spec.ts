import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GetDashboardDataUseCase } from './get-dashboard-data.usecase';
import { MOVIE_REPOSITORY_TOKEN, MovieRepository } from '@domain/repositories/movie.repository';
import {
  MultipleWinnersResponse,
  ProducersWinIntervalResponse,
  StudiosWinCountResponse,
} from '@domain/models/dashboard.model';
import { describe, it, expect, beforeEach } from 'vitest';

describe('GetDashboardDataUseCase', () => {
  let useCase: GetDashboardDataUseCase;
  let mockRepository: Partial<MovieRepository>;

  const mockMultipleWinners: MultipleWinnersResponse = {
    years: [
      { year: 1986, winnerCount: 2 },
      { year: 1990, winnerCount: 2 },
    ],
  };

  const mockStudios: StudiosWinCountResponse = {
    studios: [
      { name: 'Columbia Pictures', winCount: 7 },
      { name: 'Paramount Pictures', winCount: 6 },
    ],
  };

  const mockIntervals: ProducersWinIntervalResponse = {
    min: [{ producer: 'Joel Silver', interval: 1, previousWin: 1990, followingWin: 1991 }],
    max: [{ producer: 'Matthew Vaughn', interval: 13, previousWin: 2002, followingWin: 2015 }],
  };

  beforeEach(() => {
    mockRepository = {
      getYearsWithMultipleWinners: () => of(mockMultipleWinners),
      getStudiosWithWinCount: () => of(mockStudios),
      getMaxMinWinIntervalForProducers: () => of(mockIntervals),
    };

    TestBed.configureTestingModule({
      providers: [
        GetDashboardDataUseCase,
        {
          provide: MOVIE_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    });

    useCase = TestBed.inject(GetDashboardDataUseCase);
  });

  it('deve ser instanciado corretamente', () => {
    expect(useCase).toBeDefined();
  });

  it('deve orquestrar e consolidar os dados dos 3 painéis do dashboard em paralelo', () => {
    useCase.execute().subscribe((dashboardData) => {
      expect(dashboardData).toEqual({
        multipleWinners: mockMultipleWinners.years,
        studios: mockStudios.studios,
        producerIntervals: mockIntervals,
      });
    });
  });
});
