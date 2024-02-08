import linearSuite from 'suites/linear.ts';

import { Chart, registerables } from 'chart.js';
import { meanRunTimes, runToRunLines } from 'charts/runToRunLines';
import { ChartSelector } from 'components/chartSelector';
import { memoryAllocationsPerState, memoryUsage, runPerStage } from 'charts/stageRun';

Chart.register(...registerables);
const test = linearSuite;

const chartKinds = {
  run2Run: 'Run to run time',
  meanRun: 'Mean run time',
  runPerStage: 'Run per stage',
  memoryPerRun: 'Memory per run',
  meanMemoryUsagePerState: 'Mean memory usage',
};

let chart: Chart;
let dButton: HTMLButtonElement;

export function performance(parent: HTMLDivElement): void {
  const ctx = document.createElement('canvas');
  ctx.classList.add();
  parent.appendChild(ctx);
  chart = new Chart(ctx, memoryAllocationsPerState(test));
  addControls(parent);
  dButton = document.createElement('button');
  dButton.textContent = 'Download';
  dButton.onclick = () => {
    const url = chart.toBase64Image();
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = `${chartKinds.run2Run}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  parent.appendChild(dButton);
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
      case chartKinds.memoryPerRun:
        chart = new Chart(canvas, memoryUsage(test));
        break;
      case chartKinds.meanMemoryUsagePerState:
        chart = new Chart(canvas, memoryAllocationsPerState(test));
        break;
      default:
        throw new Error('Not implemented chart kind');
    }
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
}
