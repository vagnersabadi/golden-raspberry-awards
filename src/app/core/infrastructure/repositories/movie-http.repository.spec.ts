import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MovieHttpRepository } from './movie-http.repository';
import { environment } from '@env/environment';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('MovieHttpRepository', () => {
  let repository: MovieHttpRepository;
  let httpTesting: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MovieHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    repository = TestBed.inject(MovieHttpRepository);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('deve ser instanciado corretamente', () => {
    expect(repository).toBeDefined();
  });

  describe('getMovies', () => {
    it('deve enviar parâmetros de paginação obrigatórios (page e size)', () => {
      repository.getMovies({ page: 1, size: 20 }).subscribe();

      const req = httpTesting.expectOne(`${apiUrl}?page=1&size=20`);
      expect(req.request.method).toBe('GET');
      req.flush({ content: [], totalElements: 0, totalPages: 0, number: 1, size: 20 });
    });

    it('deve incluir filtros opcionais de winner e year quando fornecidos', () => {
      repository.getMovies({ page: 0, size: 10, winner: true, year: 1986 }).subscribe();

      const req = httpTesting.expectOne(`${apiUrl}?page=0&size=10&winner=true&year=1986`);
      expect(req.request.method).toBe('GET');
      req.flush({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 10 });
    });

    it('não deve enviar o parâmetro year se o valor for NaN', () => {
      repository.getMovies({ page: 0, size: 15, year: NaN }).subscribe();

      const req = httpTesting.expectOne(`${apiUrl}?page=0&size=15`);
      expect(req.request.method).toBe('GET');
      req.flush({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 15 });
    });
  });

  describe('getYearsWithMultipleWinners', () => {
    it('deve chamar a URL com a projection years-with-multiple-winners', () => {
      const mockResponse = {
        years: [
          { year: 1986, winnerCount: 2 },
          { year: 1990, winnerCount: 2 },
        ],
      };

      repository.getYearsWithMultipleWinners().subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpTesting.expectOne(`${apiUrl}?projection=years-with-multiple-winners`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getStudiosWithWinCount', () => {
    it('deve chamar a URL com a projection studios-with-win-count', () => {
      const mockResponse = {
        studios: [
          { name: 'Columbia Pictures', winCount: 7 },
          { name: 'Paramount Pictures', winCount: 6 },
        ],
      };

      repository.getStudiosWithWinCount().subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpTesting.expectOne(`${apiUrl}?projection=studios-with-win-count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getMaxMinWinIntervalForProducers', () => {
    it('deve chamar a URL com a projection max-min-win-interval-for-producers', () => {
      const mockResponse = {
        min: [{ producer: 'Joel Silver', interval: 1, previousWin: 1990, followingWin: 1991 }],
        max: [{ producer: 'Matthew Vaughn', interval: 13, previousWin: 2002, followingWin: 2015 }],
      };

      repository.getMaxMinWinIntervalForProducers().subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpTesting.expectOne(`${apiUrl}?projection=max-min-win-interval-for-producers`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getWinnersByYear', () => {
    it('deve buscar os vencedores filtrando por winner=true e pelo ano informado', () => {
      const mockMovies = [
        {
          id: 1,
          year: 1986,
          title: 'Under the Cherry Moon',
          studios: ['Warner Bros.'],
          producers: ['Bob Cavallo'],
          winner: true,
        },
      ];

      repository.getWinnersByYear(1986).subscribe((data) => {
        expect(data).toEqual(mockMovies);
      });

      const req = httpTesting.expectOne(`${apiUrl}?winner=true&year=1986`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMovies);
    });
  });
});
