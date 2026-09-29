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
    const params = new HttpParams().set('projection', 'years-with-multiple-winners');
    return this.http.get<MultipleWinnersResponse>(this.baseUrl, { params });
  }

  getStudiosWithWinCount(): Observable<StudiosWinCountResponse> {
    const params = new HttpParams().set('projection', 'studios-with-win-count');
    return this.http.get<StudiosWinCountResponse>(this.baseUrl, { params });
  }

  getMaxMinWinIntervalForProducers(): Observable<ProducersWinIntervalResponse> {
    const params = new HttpParams().set('projection', 'max-min-win-interval-for-producers');
    return this.http.get<ProducersWinIntervalResponse>(this.baseUrl, { params });
  }

  getWinnersByYear(year: number): Observable<Movie[]> {
    const params = new HttpParams()
      .set('winner', 'true')
      .set('year', year.toString());
    return this.http.get<Movie[]>(this.baseUrl, { params });
  }
}
