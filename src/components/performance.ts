import linearSuite from 'suites/linear.ts';

import { Chart, registerables } from 'chart.js';
import { meanRunTimes, runToRunLines } from 'charts/runToRunLines';
import { ChartSelector } from 'components/chartSelector';
import { runPerStage } from '../charts/stageRun.ts';

Chart.register(...registerables);
const test = linearSuite;

const chartKinds = {
  run2Run: 'Run to run time',
  meanRun: 'Mean run time',
  runPerStage: 'Run per stage',
  memoryPerStage: 'Memory per stage',
  meanMemoryUsage: 'Mean memory usage',
};

let chart: Chart;

export function performance(parent: HTMLDivElement): void {
  const ctx = document.createElement('canvas');
  ctx.classList.add();
  parent.appendChild(ctx);
  chart = new Chart(ctx, runToRunLines(test));
  addControls(parent);
}

function addControls(parent: HTMLDivElement) {
  const selector = new ChartSelector();
  selector.setCharts(Object.values(chartKinds));
  selector.attachTo(parent);
  selector.setOnSelect((chartKind) => {
    const canvas = chart.canvas;
    chart.destroy();
    switch (chartKind) {
      case chartKinds.run2Run:
        chart = new Chart(canvas, runToRunLines(test));
        break;
      case chartKinds.meanRun:
        chart = new Chart(canvas, meanRunTimes(test));
        break;
      case chartKinds.runPerStage:
        chart = new Chart(canvas, runPerStage(test));
        break;
      default:
        throw new Error('Not implemented chart kind');
    }
  });
}
