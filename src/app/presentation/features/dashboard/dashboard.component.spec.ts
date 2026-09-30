import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { GetDashboardDataUseCase } from '@domain/usecases/get-dashboard-data.usecase';
import { GetWinnersByYearUseCase } from '@domain/usecases/get-winners-by-year.usecase';
import { DashboardData } from '@domain/models/dashboard.model';
import { Movie } from '@domain/models/movie.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let mockGetDashboardDataUseCase: { execute: ReturnType<typeof vi.fn> };
  let mockGetWinnersByYearUseCase: { execute: ReturnType<typeof vi.fn> };

  const mockDashboardData: DashboardData = {
    multipleWinners: [
      { year: 1986, winnerCount: 2 },
      { year: 1990, winnerCount: 2 },
    ],
    studios: [
      { name: 'Columbia Pictures', winCount: 7 },
      { name: 'Paramount Pictures', winCount: 6 },
      { name: 'Warner Bros.', winCount: 5 },
      { name: '20th Century Fox', winCount: 4 },
    ],
    producerIntervals: {
      min: [{ producer: 'Joel Silver', interval: 1, previousWin: 1990, followingWin: 1991 }],
      max: [{ producer: 'Matthew Vaughn', interval: 13, previousWin: 2002, followingWin: 2015 }],
    },
  };

  const mockYearMovies: Movie[] = [
    {
      id: 1,
      year: 1986,
      title: 'Under the Cherry Moon',
      studios: ['Warner Bros.'],
      producers: ['Bob Cavallo'],
      winner: true,
    },
  ];

  beforeEach(async () => {
    mockGetDashboardDataUseCase = {
      execute: vi.fn().mockReturnValue(of(mockDashboardData)),
    };

    mockGetWinnersByYearUseCase = {
      execute: vi.fn().mockReturnValue(of(mockYearMovies)),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: GetDashboardDataUseCase, useValue: mockGetDashboardDataUseCase },
        { provide: GetWinnersByYearUseCase, useValue: mockGetWinnersByYearUseCase },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('deve instanciar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar e popular os dados dos painéis no ngOnInit', () => {
    component.ngOnInit();

    expect(mockGetDashboardDataUseCase.execute).toHaveBeenCalled();
    expect(component.multipleWinners()).toEqual(mockDashboardData.multipleWinners);
    expect(component.studios()).toEqual(mockDashboardData.studios);
    expect(component.producerIntervals()).toEqual(mockDashboardData.producerIntervals);
  });

  it('deve computar corretamente apenas os Top 3 estúdios com mais vitórias', () => {
    component.studios.set(mockDashboardData.studios);

    const top3 = component.top3Studios();
    expect(top3).toHaveLength(3);
    expect(top3[0].name).toBe('Columbia Pictures');
    expect(top3[1].name).toBe('Paramount Pictures');
    expect(top3[2].name).toBe('Warner Bros.');
  });

  it('deve buscar vencedores por ano ao acionar onSearch com ano válido', () => {
    component.searchYear.set('1986');
    component.onSearch();

    expect(mockGetWinnersByYearUseCase.execute).toHaveBeenCalledWith(1986);
    expect(component.yearWinners()).toEqual(mockYearMovies);
  });

  it('não deve disparar busca se o ano for inválido ou vazio', () => {
    component.searchYear.set('');
    component.onSearch();

    expect(mockGetWinnersByYearUseCase.execute).not.toHaveBeenCalled();
  });

  it('deve buscar vencedores por ano quando searchYear for do tipo number', () => {
    component.searchYear.set(1986);
    component.onSearch();

    expect(mockGetWinnersByYearUseCase.execute).toHaveBeenCalledWith(1986);
    expect(component.yearWinners()).toEqual(mockYearMovies);
  });
});
