import { Benchmark, Orders } from 'types';
import { utils } from 'utils';

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

const orderTable: Record<Orders, string[]> = {
  low: [
    'c1-p0-n1-l1-a0.hbt.json',
    'c1-p0-n1-l2-a0.hbt.json',
    'c1-p0-n1-l3-a0.hbt.json',
    'c1-p0-n1-l4-a0.hbt.json',
    'c1-p0-n1-l5-a0.hbt.json',
    'c1-p0-n2-l2-a0.hbt.json',
    'c1-p0-n2-l3-a0.hbt.json',
    'c1-p0-n3-l1-a0.hbt.json',
    'c1-p0-n3-l2-a0.hbt.json',
    'c1-p0-n4-l1-a0.hbt.json',
    'c1-p0-n4-l2-a0.hbt.json',
    'c1-p0-n5-l1-a0.hbt.json',
    'c1-p0-n5-l2-a0.hbt.json',
  ],
  mid: [
    'c1-p0-n2-l4-a0.hbt.json',
    'c1-p0-n2-l5-a0.hbt.json',
    'c1-p0-n3-l3-a0.hbt.json',
    'c1-p0-n3-l4-a0.hbt.json',
    'c1-p0-n4-l3-a0.hbt.json',
    'c1-p0-n4-l4-a0.hbt.json',
    'c1-p0-n5-l3-a0.hbt.json',
  ],
  high: [
    'c1-p0-n3-l5-a0.hbt.json',
    'c1-p0-n4-l5-a0.hbt.json',
    'c1-p0-n5-l4-a0.hbt.json',
    'c1-p0-n5-l5-a0.hbt.json',
  ],
};

export async function getNestedSeries(order: Orders): Promise<Benchmark[]> {
  const files = orderTable[order];
  const requests: Promise<Benchmark | undefined>[] = files.map((file) => getBench(`depth/${file}`));
  const results = await Promise.all(requests);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return results
    .filter((r): r is Benchmark => r !== undefined)
    .sort((a, b) => utils.calcElements(a.file) - utils.calcElements(b.file));
}

export async function getLinearSeries(): Promise<Benchmark[]> {
  const requests: Promise<Benchmark | undefined>[] = [];

  for(let i = 50; i <= 850; i+=50) {
    const file = (`linear/c1-p0-n${i}-l0-a0.hbt.json`);
    requests.push(getBench(file));
  }
  requests.push(getBench('linear/c1-p0-n864-l0-a0.hbt.json'));

  const results = await Promise.all(requests);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return results
    .filter((r): r is Benchmark => r !== undefined)
    .sort((a, b) => utils.calcElements(a.file) - utils.calcElements(b.file));
}
