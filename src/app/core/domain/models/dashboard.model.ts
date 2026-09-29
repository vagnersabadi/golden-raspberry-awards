export interface MultipleWinnersYear {
  year: number;
  winnerCount: number;
}

export interface MultipleWinnersResponse {
  years: MultipleWinnersYear[];
}

export interface StudioWinCount {
  name: string;
  winCount: number;
}

export interface StudiosWinCountResponse {
  studios: StudioWinCount[];
}

export interface ProducerWinInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface ProducersWinIntervalResponse {
  min: ProducerWinInterval[];
  max: ProducerWinInterval[];
}

export interface DashboardData {
  multipleWinners: MultipleWinnersYear[];
  studios: StudioWinCount[];
  producerIntervals: ProducersWinIntervalResponse;
}
