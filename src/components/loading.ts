export class Loading {
  private readonly div: HTMLElement;

  constructor() {
    const loading = document.createElement('div');
    loading.style.width = '100%';
    loading.style.height = '100vh';
    loading.style.padding = '8em';
    this.div = loading;
  }

  public attachLoading(root: HTMLElement) {
    this.addBars();
    root.appendChild(this.div);
  }

  private addBars = () => {
    for (let i = 0; i < 3; i++) {
      const bars = document.createElement('progress');
      bars.classList.add('progress', 'is-large', 'is-info');
      bars.textContent = 'Loading...';
      this.div.appendChild(bars);
    }
  };

  private effect(): Promise<void> {
    this.div.classList.add('fade-out-shrink');
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.clear();
        clearTimeout(timer);
        resolve();
      }, 210);
    });
  }

  private clear() {
    while (this.div.firstChild) {
      this.div.removeChild(this.div.firstChild);
    }
    this.div.classList.remove('fade-out-shrink');
    this.div.style.padding = '2em';
  }

  public async detachAndReplace(replacement: HTMLElement): Promise<void> {
    replacement.classList.add('fade-in-scale-up');
    await this.effect();
    this.div.appendChild(replacement);
  }
}

