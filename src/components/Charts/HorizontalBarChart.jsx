import BaseChart from './BaseChart';

const HorizontalBarChart = ({ title, data }) => {
  // Ordenamos los datos de mayor a menor para que la barra más larga esté arriba
  const sortedData = [...data].sort((a, b) => a.value - b.value);

  const option = {
    title: { text: title },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', boundaryGap: [0, 0.01] },
    yAxis: {
      type: 'category',
      data: sortedData.map(item => item.name)
    },
    series: [
      {
        type: 'bar',
        data: sortedData.map(item => item.value),
        itemStyle: {
          color: '#ff771d', // Color naranja para destacar
          borderRadius: [0, 5, 5, 0] // Bordes redondeados al final
        },
        label: { show: true, position: 'right' } // Muestra el valor al lado de la barra
      }
    ]
  };

  return <BaseChart option={option} />;
};

export default HorizontalBarChart;