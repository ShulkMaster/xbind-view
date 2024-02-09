import { ChartConfiguration, ChartDataset } from 'chart.js';
import { Benchmark } from 'types.ts';
import { bench } from 'bench';
import { utils } from 'utils';
import { seconds } from './options';

const runLabels = Array.from(
  {length: 30},
  (_, i) => `Run ${i + 1}`,
);

export function runToRunLines(suite: Benchmark[]): ChartConfiguration<'line'> {
  const data = suite.map((b) => {
    const config = utils.getNLNames(b.file);
    return {
      label: `${utils.decryptName(b.file)}(${config})`,
      data: b.runs.map(bench.getRuntime),
      borderWidth: 1,
    };
  });

  return {
    type: 'line',
    data: {
      labels: runLabels,
      datasets: data,
    },
    options: seconds(),
  };
}

function order3(x: number): number {
  const a = 1.144e-09;
  const b = 1.975e-06;
  const c = 0.0006908;
  const d = 0.006838;

  return a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;
}

function order2(x: number): number {
  const a = 3.57e-06;
  const b = 8.188e-05;
  const c = 0.06049;

  return a * Math.pow(x, 2) + b * x + c;
}

function order1(x: number): number {
  const a = 0.003433;
  const b = -0.4916;

  return a * x + b;
}

function linearSetInterpotlation(data: number[], order: number): number[] {
  switch (order) {
    case 1:
      return data.map(order1);
    case 2:
      return data.map(order2);
    case 3:
      return data.map(order3);
    default:
      return data;
  }
}

///@ts-ignore
function linearSet(x: number[], order: number): ChartDataset<'line'> {
  return {
    label: `${order} Order Polinomial`,
    type: 'line',
    data: linearSetInterpotlation(x, order),
    borderWidth: 1,
  };
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
  };
}
