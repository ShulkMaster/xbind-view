import { ChartConfiguration, ChartDataset } from 'chart.js';
import { Benchmark } from 'types.ts';
import { bench } from 'bench';
import { utils } from 'utils';
import { seconds } from './options';

export function runToRunLines(suite: Benchmark[]): ChartConfiguration<'line'> {
  const data = suite.map((b) => {
    return {
      label: utils.decryptName(b.file),
      data: b.runs.map(bench.getRuntime),
      borderWidth: 1,
    };
  });

  return {
    type: 'line',
    data: {
      labels: suite[0].runs.map((_, i) => `Run ${i + 1}`),
      datasets: data,
    },
    options: seconds(),
  }
}

export function meanRunTimes(suite: Benchmark[]): ChartConfiguration<'line'> {
  const dataset: ChartDataset<'line'> = {
    label: 'Mean Run Time',
    type: 'line',
    data: [],
    borderWidth: 1,
  };

  const averages: number[] = [];
  const labels: string[] = [];

  for (const b of suite) {
    const mean = bench.getAverageRunTime(b.runs);
    averages.push(mean);
    labels.push(utils.decryptName(b.file));
  }

  dataset.data = averages;

  return {
    type: 'line',
    data: {
      labels,
      datasets: [dataset],
    },
    options: seconds(),
  }
}
