import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MOVIE_REPOSITORY_TOKEN } from '@domain/repositories/movie.repository';
import { Movie } from '@domain/models/movie.model';

/**
 * Caso de uso responsável por buscar os filmes vencedores de um ano selecionado.
 */
@Injectable({
  providedIn: 'root',
})
export class GetWinnersByYearUseCase {
  private readonly repository = inject(MOVIE_REPOSITORY_TOKEN);

  execute(year: number): Observable<Movie[]> {
    return this.repository.getWinnersByYear(year);
  }
}
