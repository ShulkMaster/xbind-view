export type MemoryUsage = {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
  arrayBuffers: number;
};

export type MemorySnap = {
  allocated: MemoryUsage;
  delta: string;
};

export type Run = {
  start: string;
  end: string;
  memory: MemorySnap[];
}

export type Benchmark = {
  file: string;
  runs: Run[];
};

export type GNode = { id: string | number, label: string };
export type GId = string | number;

export type TestParams = {
  components: number;
  properties: number;
  tags: number;
  levels: number;
  attributes: number;
};
