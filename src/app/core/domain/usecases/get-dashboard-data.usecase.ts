import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { MOVIE_REPOSITORY_TOKEN } from '@domain/repositories/movie.repository';
import { DashboardData } from '@domain/models/dashboard.model';

/**
 * Caso de uso responsável por consolidar os dados dos 3 painéis iniciais do Dashboard.
 * Utiliza forkJoin para eliminar waterfalls e carregar tudo em paralelo.
 */
@Injectable({
  providedIn: 'root',
})
export class GetDashboardDataUseCase {
  private readonly repository = inject(MOVIE_REPOSITORY_TOKEN);

  execute(): Observable<DashboardData> {
    return forkJoin({
      winners: this.repository.getYearsWithMultipleWinners(),
      studios: this.repository.getStudiosWithWinCount(),
      intervals: this.repository.getMaxMinWinIntervalForProducers(),
    }).pipe(
      map((result) => ({
        multipleWinners: result.winners.years,
        studios: result.studios.studios,
        producerIntervals: result.intervals,
      }))
    );
  }
}
