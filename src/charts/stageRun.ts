import { ChartConfiguration, ChartDataset } from 'chart.js';
import { Benchmark, Run } from 'types';
import { decryptName, utils } from '../utils.ts';
import { meanRunTimes } from './runToRunLines.ts';

const stages = [
  'start',
  'parsed',
  'simplified',
  'registered',
  'replaced',
  'checked',
  'filled',
  'plugin load',
  'compiled & written',
];

function getForStage(suits: Benchmark[], stage: number): number[] {
  const avg: number[] = Array(suits.length).fill(120);
  const millis = BigInt(1_000_000);
  for (let suit = 0; suit < suits.length; suit++) {
    const runs = suits[suit].runs;
    let accu = 0;
    for (const run of runs) {
      const s = run.memory[stage - 1]?.delta ?? run.start;
      const start = BigInt(s) / millis;
      const end = BigInt(run.memory[stage].delta) / millis;
      accu += Number(end - start) / 1000;
    }
    avg[suit] = accu / runs.length;
  }

  return avg;
}

export function runPerStage(suits: Benchmark[]): ChartConfiguration<'bar'> {
  const datasets: ChartDataset<'bar'>[] = [];
  const m = meanRunTimes(suits);

  for (let i = 0; i < stages.length; i++) {
    const data = getForStage(suits, i);
    const dataset: ChartDataset<'bar'> = {
      label: stages[i],
      data: data,
      borderWidth: 1,
    };
    datasets.push(dataset);
  }
  const x = m.data.datasets[0];
  x.order = 1;
  datasets.push(m.data.datasets[0] as any);

  return {
    type: 'bar',
    data: {
      labels: suits.map((s) => decryptName(s.file)),
      datasets,
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Run per stage',
        },
      },
      scales: {
        x: {stacked: true},
        y: {
          stacked: true,
          ticks: {
            callback: function (value: number | string) {
              return value + ' ms';
            },
          },
        },
      },
    },
  };
}
