import { ChartOptions } from 'chart.js';

export function seconds(): ChartOptions<'line'> {
  return {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Opcional: Formatear las etiquetas de los ticks, por ejemplo, añadir "s" para segundos
          callback: function (value: number | string) {
            return value + ' s';
          },
        },
      },
    },
  };
}
