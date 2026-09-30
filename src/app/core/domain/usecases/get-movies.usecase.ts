import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MOVIE_REPOSITORY_TOKEN } from '@domain/repositories/movie.repository';
import { Movie, MovieFilterParams } from '@domain/models/movie.model';
import { PagedResponse } from '@domain/models/pagination.model';

/**
 * Caso de uso responsável por obter a lista paginada e filtrada de filmes.
 */
@Injectable({
  providedIn: 'root',
})
export class GetMoviesUseCase {
  private readonly repository = inject(MOVIE_REPOSITORY_TOKEN);

  execute(params: MovieFilterParams): Observable<PagedResponse<Movie>> {
    return this.repository.getMovies(params);
  }
}
