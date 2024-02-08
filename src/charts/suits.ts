import { Benchmark } from 'types';

interface Cache {
  [filename: string]: Benchmark;
}

const cache: Cache = {};

export async function getBench(filePath: string): Promise<Benchmark | undefined> {
  if (cache[filePath]) {
    console.log('Returning from cache:', filePath);
    return cache[filePath];
  }

  try {
    const result = await fetch(filePath);
    const json = await result.json();
    cache[filePath] = json;
    return json as Benchmark;
  } catch (error) {
    console.error('Error fetching:', filePath);
    return undefined;
  }
}

export async function getNestedSeries(): Promise<Benchmark[]> {
  const requests: Promise<Benchmark | undefined>[] = [];

  for (let nodes = 1; nodes <= 2; nodes++) {
    for (let levels = 1; levels <= 6; levels++) {
      const file = `depth/c1-p0-n${nodes}-l${levels}-a0.hbt.json`;
      requests.push(getBench(file));
    }
  }

  const results = await Promise.all(requests);
  return results.filter((r): r is Benchmark => r !== undefined);
}
