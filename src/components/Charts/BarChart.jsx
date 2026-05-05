import BaseChart from './BaseChart';

const BarChart = ({ title, labels, values, color = '#5470c6' }) => {
  // Aquí transformas tus props en la configuración de ECharts
  const option = {
    title: { text: title },
    tooltip: {},
    xAxis: { data: labels },
    yAxis: {},
    series: [{
      type: 'bar',
      data: values,
      itemStyle: { color }
    }]
  };

  return <BaseChart option={option} />;
};

export default BarChart;