import { ChartConfiguration, ChartDataset } from 'chart.js';
import { Benchmark, MemoryUsage, Run } from 'types';
import { decryptName } from 'utils';

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

const toTick = (unit: string, stacked: boolean) => ({
  ticks: {
    callback: (value: number | string) => `${value} ${unit}`,
  },
  stacked,
});

function makeOptions(text: string, unit: string) {
  return {
    plugins: {
      title: {
        display: true,
        text,
      },
    },
    scales: {
      x: {stacked: true},
      y: toTick(unit, true),
    },
  };
}

function getForStage(suits: Benchmark[], stage: number): number[] {
  const avg: number[] = Array(suits.length).fill(0);
  const millis = BigInt(1_000_000);
  for (let suit = 0; suit < suits.length; suit++) {
    const runs = suits[suit].runs;
    let accu = 0;
    for (const run of runs) {
      const s = run.memory[stage - 1]?.delta ?? run.start;
      const start = BigInt(s) / millis;
      const end = BigInt(run.memory[stage].delta) / millis;
      accu += Number(end - start);
    }
    avg[suit] = accu / runs.length;
  }

  return avg;
}

export function runPerStage(suits: Benchmark[]): ChartConfiguration<'bar'> {
  const datasets: ChartDataset<'bar'>[] = [];

  for (let i = 0; i < stages.length; i++) {
    const data = getForStage(suits, i);
    const dataset: ChartDataset<'bar'> = {
      label: stages[i],
      data: data,
      borderWidth: 1,
    };
    datasets.push(dataset);
  }

  return {
    type: 'bar',
    data: {
      labels: suits.map((s) => decryptName(s.file)),
      datasets,
    },
    options: makeOptions('Run Time per Stage', 'ms'),
  };
}

///@ts-ignore
function findMinMaxMemory(run: Run): [MemoryUsage, MemoryUsage] {
  let min = run.memory[0].allocated;
  let max = run.memory[0].allocated;
  for (const snap of run.memory) {
    if (snap.allocated.heapUsed < min.heapTotal) {
      min = snap.allocated;
    }
    if (snap.allocated.heapTotal > max.heapTotal) {
      max = snap.allocated;
    }
  }
  return [min, max];
}

function memoryMax(suits: Benchmark[]) {
  const used: number[] = Array(suits.length).fill(0);
  const total: number[] = Array(suits.length).fill(0);
  const kilo = 1024 * 1024;
  for (let suit = 0; suit < suits.length; suit++) {
    const runs = suits[suit].runs;
    const accum = [0, 0];
    for (const run of runs) {
      for (const {allocated} of run.memory) {
        accum[0] += allocated.heapUsed / kilo;
        accum[1] += (allocated.heapTotal - allocated.heapUsed) / kilo;
      }
    }
    used[suit] = accum[0] / runs.length;
    total[suit] = accum[1] / runs.length;
  }
  return {
    used,
    total,
  };
}

export function memoryUsage(suits: Benchmark[]): ChartConfiguration<'bar'> {
  const allocations = memoryMax(suits);
  const heapUsed: ChartDataset<'bar'> = {
    label: 'Heap Used',
    data: allocations.used,
    borderWidth: 1,
  };

  const heapTotal: ChartDataset<'bar'> = {
    label: 'Heap Allocated',
    data: allocations.total,
    borderWidth: 1,
  };

  return {
    type: 'bar',
    data: {
      labels: suits.map((s) => decryptName(s.file)),
      datasets: [heapUsed, heapTotal],
    },
    options: makeOptions('Average Memory per run', 'Mb'),
  };
}

function getMemoryDelta(suit: Benchmark): ChartDataset<'line'> {
  const deltas: number[] = Array(stages.length).fill(0);
  const kilo = 1024;

  for (let stgIndex = 0; stgIndex < stages.length; stgIndex++) {
    let accum = 0;
    for (const run of suit.runs) {
      const heapUsed = run.memory[stgIndex].allocated.heapUsed;
      accum += heapUsed / kilo;
    }
    deltas[stgIndex] = accum / (stages.length * kilo);
  }

  return {
    type: 'line',
    label: decryptName(suit.file),
    data: deltas,
    borderWidth: 1,
  };
}

export function memoryAllocationsPerState(suits: Benchmark[]): ChartConfiguration<'line'> {
  const datasets = suits.map(s => getMemoryDelta(s));

  return {
    type: 'line',
    data: {
      labels: stages,
      datasets,
    },
    options: {
      scales: {y: toTick('Mb', false)},
    },
  };
}
