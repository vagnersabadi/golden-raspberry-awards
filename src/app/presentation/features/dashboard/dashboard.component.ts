import { Component, OnInit, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GetDashboardDataUseCase } from '@domain/usecases/get-dashboard-data.usecase';
import { GetWinnersByYearUseCase } from '@domain/usecases/get-winners-by-year.usecase';
import {
  MultipleWinnersYear,
  ProducerWinInterval,
  StudioWinCount,
} from '@domain/models/dashboard.model';
import { Movie } from '@domain/models/movie.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly getDashboardDataUseCase = inject(GetDashboardDataUseCase);
  private readonly getWinnersByYearUseCase = inject(GetWinnersByYearUseCase);

  readonly multipleWinners = signal<MultipleWinnersYear[]>([]);
  readonly studios = signal<StudioWinCount[]>([]);
  readonly producerIntervals = signal<{ min: ProducerWinInterval[]; max: ProducerWinInterval[] }>({
    min: [],
    max: [],
  });

  // Top 3 ordenado e memoizado através de computed() (Regra 4 - Rendering Performance)
  readonly top3Studios = computed(() =>
    [...this.studios()]
      .sort((a, b) => b.winCount - a.winCount)
      .slice(0, 3)
  );

  readonly searchYear = signal<string>('');
  readonly yearWinners = signal<Movie[]>([]);

  // Colunas para as tabelas do Angular Material
  readonly multipleWinnersColumns: string[] = ['year', 'winnerCount'];
  readonly studiosColumns: string[] = ['name', 'winCount'];
  readonly producersColumns: string[] = ['producer', 'interval', 'previousWin', 'followingWin'];
  readonly yearWinnersColumns: string[] = ['id', 'year', 'title'];

  ngOnInit(): void {
    this.getDashboardDataUseCase.execute().subscribe({
      next: (data) => {
        this.multipleWinners.set(data.multipleWinners);
        this.studios.set(data.studios);
        this.producerIntervals.set(data.producerIntervals);
      },
    });
  }

  onSearch(): void {
    const yearNumber = parseInt(this.searchYear().trim(), 10);
    if (isNaN(yearNumber)) return;

    this.getWinnersByYearUseCase.execute(yearNumber).subscribe({
      next: (movies) => this.yearWinners.set(movies),
    });
  }
}
