import { Run } from './types';

function getRuntime(run: Run): number {
  const { end, start} = run;
  const diff = BigInt(end) - BigInt(start);
  return Number(diff / BigInt(1_000_000)) / 1000;
}

function getAverageRunTime(runs: Run[]): number {
  const total = runs.reduce((acc, run) => acc + getRuntime(run), 0);
  return total / runs.length;
}

export const bench = {
  getRuntime,
  getAverageRunTime,
}
