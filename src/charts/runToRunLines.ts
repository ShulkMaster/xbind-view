import { ChartConfiguration } from 'chart.js';
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
