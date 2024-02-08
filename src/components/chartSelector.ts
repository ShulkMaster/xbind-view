export class ChartSelector {
  private charts: string[] = [];
  private readonly root: HTMLSelectElement;

  constructor() {
    this.root = document.createElement('select');
    this.render();
  }

  private render(): void {
    for (let i = 0; i < this.charts.length; i++){
      const chart = this.charts[i];
      let options = this.root.children[i] as HTMLOptionElement;
      if (!options) {
        options = document.createElement('option');
        this.root.appendChild(options);
      }
      options.value = chart;
      options.textContent = chart;
    }

    for (let i = this.charts.length; i < this.root.children.length; i++) {
      this.root.removeChild(this.root.children[i]);
    }
  }

  public attachTo(parent: HTMLElement): void {
    parent.appendChild(this.root);
  }

  public detach(): void {
    this.root.remove();
  }

  public setOnSelect(callback: (chart: string) => void): void {
    callback(this.root.value);
    this.root.onchange = () => {
      callback(this.root.value);
    };
  }

  public setCharts(charts: string[]): void {
    this.charts = charts;
    this.render();
  }
}
