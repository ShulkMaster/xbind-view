import { Benchmark } from './types';
import linearSuite from 'suites/linear';

import { Chart, registerables, ChartConfiguration, ChartDataset, ChartOptions } from 'chart.js';
import { runToRunLines } from './charts/runToRunLines.ts';

Chart.register(...registerables);
const test = linearSuite;
const stages = [
  'start',
  'parsed',
  'simplified',
  'registered',
  'replaced',
  'checked',
  'filled',
  'compiled',
  'written',
];

export function Performance(ctx: HTMLCanvasElement): void {
  new Chart(ctx, runToRunLines(test));
}

function decriptName(name: string): string {
  const parts = name.split('-');
  const nodesCode = parts[2].split('n')[1];
  const levelsCode = parts[3].split('l')[1];
  const nodes = Number(nodesCode);
  const level = Number(levelsCode) + 1;

  if(nodes <= 1) {
    return `${nodes * level + 1} Elements`
  }

  const numerator = 1 - Math.pow(nodes, level);
  const denominator = 1 - nodes;
  const elements = (nodes * numerator) / denominator;

  return `${elements} Elements`;
}

function mapRunToRunTime(benchmark: Benchmark[]): ChartConfiguration<'line'> {
  const runs = benchmark.map(b => b.runs);
  const runtimes = runs.map(r => r.map(run => {
    const { end, start} = run;
    const diff = BigInt(end) - BigInt(start);
    return Number(diff / BigInt(1_000_000)) / 1000;
  }));

  const data = runtimes.map((r, i) => {
    const x: ChartDataset<'line'> = {
      label: decriptName(benchmark[i].file),
      data: r,
      borderWidth: 1,
    };
    return x;
  });

  const options: ChartOptions<'line'> = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Opcional: Formatear las etiquetas de los ticks, por ejemplo, añadir "s" para segundos
          callback: function (value: number | string) {
            return value + ' s';
          },
        },
      },
    },
  };

  return {
    type: 'line',
    data: {
      labels: runs[0].map((_, i) => `Run ${i + 1}`),
      datasets: data,
    },
    options,
  };
}
