//El "wrapper" con la lógica de ECharts
import ReactECharts from 'echarts-for-react';

const BaseChart = ({ option, style, ...props }) => (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <ReactECharts
            option={option}
            style={{ height: '400px', width: '100%', ...style }}
            notMerge={true} // Limpia datos anteriores al actualizar
            lazyUpdate={true}
            {...props}
        />
    </div>
  </div>
);

export default BaseChart;