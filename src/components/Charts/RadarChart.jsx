import BaseChart from './BaseChart';

const RadarChart = ({ title, data }) => {
  // 1. Preparamos los indicadores (las puntas del radar)
  // Buscamos el valor máximo para que la escala sea proporcional
  const maxValue = Math.max(...data.map(item => item.value), 100);

  const option = {
    title: { text: title, left: 'center', textStyle: { fontSize: 16 } },
    tooltip: { trigger: 'item' },
    radar: {
      indicator: data.map(item => ({
        name: item.name,
        max: maxValue + 10 // Damos un poco de margen visual
      })),
      shape: 'circle',
      splitNumber: 5,
      axisName: { color: '#666' },
      splitLine: { lineStyle: { color: ['#eee'] } },
      splitArea: { show: false },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: data.map(item => item.value),
            name: 'Nivel Adquirido',
            areaStyle: { opacity: 0.3, color: '#3498db' },
            lineStyle: { width: 2, color: '#3498db' },
            itemStyle: { color: '#3498db' }
          }
        ]
      }
    ]
  };

  return <BaseChart option={option} />;
};

export default RadarChart;