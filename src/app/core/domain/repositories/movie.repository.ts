import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie, MovieFilterParams } from '@domain/models/movie.model';
import { PagedResponse } from '@domain/models/pagination.model';
import {
  MultipleWinnersResponse,
  ProducersWinIntervalResponse,
  StudiosWinCountResponse,
} from '@domain/models/dashboard.model';

/**
 * Token de injeção para vincular a interface MovieRepository à sua implementação concreta.
 */
export const MOVIE_REPOSITORY_TOKEN = new InjectionToken<MovieRepository>('MOVIE_REPOSITORY_TOKEN');

/**
 * Contrato de repositório (Port) para operações de dados de filmes e dashboard.
 */
export interface MovieRepository {
  /** Busca a listagem paginada e filtrada de filmes. */
  getMovies(params: MovieFilterParams): Observable<PagedResponse<Movie>>;

  /** Obtém os anos com mais de um vencedor da premiação. */
  getYearsWithMultipleWinners(): Observable<MultipleWinnersResponse>;

  /** Obtém os estúdios ordenados pela quantidade de vitórias. */
  getStudiosWithWinCount(): Observable<StudiosWinCountResponse>;

  /** Obtém os produtores com maior e menor intervalo entre vitórias. */
  getMaxMinWinIntervalForProducers(): Observable<ProducersWinIntervalResponse>;

  /** Busca os filmes vencedores de um ano específico. */
  getWinnersByYear(year: number): Observable<Movie[]>;
}

