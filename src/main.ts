import { performance } from './components/performance';
import './main.css';

function bootstrap(rootElm: HTMLDivElement): void {
  performance(rootElm);
}

const root = document.getElementById('app');
if (root instanceof HTMLDivElement) {
  bootstrap(root);
} else {
  window.alert('Root element not found')
}



