import { Chart, registerables } from 'chart.js';
import { meanRunTimes, runToRunLines } from 'charts/runToRunLines';
import { ChartSelector } from 'components/chartSelector';
import { memoryAllocationsPerState, memoryUsage, runPerStage } from 'charts/stageRun';
import { Loading } from './loading';
import { getNestedSeries } from 'charts/suits';
import { Benchmark } from 'types';

Chart.register(...registerables);
let suits: Benchmark[] = [];

const chartKinds = {
  run2Run: 'Run to run time',
  meanRun: 'Mean run time',
  runPerStage: 'Run per stage',
  memoryPerRun: 'Memory per run',
  meanMemoryUsagePerState: 'Mean memory usage',
};

let chart: Chart;

export function performance(parent: HTMLDivElement): void {
  const loader = new Loading();
  loader.attachLoading(parent);
  getNestedSeries('mid')
    .then((s) => { suits = s; })
    .then(() => initChart(loader));
}

function initChart(loader: Loading): void {
  const container = document.createElement('div');
  loader.detachAndReplace(container)
    .then(() => addControls(container));
}

function addControls(parent: HTMLDivElement) {
  const selector = new ChartSelector();
  selector.setCharts(Object.values(chartKinds));
  const dButton = document.createElement('button');
  dButton.textContent = 'Download';
  selector.setOnSelect((chartKind) => {
    updateChart(parent, chartKind);
    dButton.onclick = () => {
      const url = chart.toBase64Image();
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.download = `${chartKind}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  });
  selector.attachTo(parent);
  parent.appendChild(dButton);
}

function updateChart(parent: HTMLElement, kind: string): void {
  let canvas = chart?.canvas;

  if(!canvas) {
    canvas = document.createElement('canvas');
    parent.appendChild(canvas);
  }

  chart?.destroy();
  switch (kind) {
    case chartKinds.run2Run:
      chart = new Chart(canvas, runToRunLines(suits));
      break;
    case chartKinds.meanRun:
      chart = new Chart(canvas, meanRunTimes(suits));
      break;
    case chartKinds.runPerStage:
      chart = new Chart(canvas, runPerStage(suits));
      break;
    case chartKinds.memoryPerRun:
      chart = new Chart(canvas, memoryUsage(suits));
      break;
    case chartKinds.meanMemoryUsagePerState:
      chart = new Chart(canvas, memoryAllocationsPerState(suits));
      break;
    default:
      throw new Error('Not implemented chart kind');
  }
}


