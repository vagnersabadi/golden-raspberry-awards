import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieRepository } from '@domain/repositories/movie.repository';
import { Movie, MovieFilterParams } from '@domain/models/movie.model';
import { PagedResponse } from '@domain/models/pagination.model';
import {
  MultipleWinnersResponse,
  ProducersWinIntervalResponse,
  StudiosWinCountResponse,
} from '@domain/models/dashboard.model';

import { environment } from '@env/environment';

/**
 * Implementação concreta (Adapter) do MovieRepository consumindo a API REST oficial.
 */
@Injectable({
  providedIn: 'root',
})
export class MovieHttpRepository implements MovieRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;


  getMovies(params: MovieFilterParams): Observable<PagedResponse<Movie>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('size', params.size.toString());

    if (params.winner !== undefined) {
      httpParams = httpParams.set('winner', params.winner.toString());
    }

    if (params.year !== undefined && !isNaN(params.year)) {
      httpParams = httpParams.set('year', params.year.toString());
    }

    return this.http.get<PagedResponse<Movie>>(this.baseUrl, { params: httpParams });
  }

  getYearsWithMultipleWinners(): Observable<MultipleWinnersResponse> {
    return this.http.get<MultipleWinnersResponse>(`${this.baseUrl}/yearsWithMultipleWinners`);
  }

  getStudiosWithWinCount(): Observable<StudiosWinCountResponse> {
    return this.http.get<StudiosWinCountResponse>(`${this.baseUrl}/studiosWithWinCount`);
  }

  getMaxMinWinIntervalForProducers(): Observable<ProducersWinIntervalResponse> {
    return this.http.get<ProducersWinIntervalResponse>(`${this.baseUrl}/maxMinWinIntervalForProducers`);
  }

  getWinnersByYear(year: number): Observable<Movie[]> {
    const params = new HttpParams().set('year', year.toString());
    return this.http.get<Movie[]>(`${this.baseUrl}/winnersByYear`, { params });
  }
}
