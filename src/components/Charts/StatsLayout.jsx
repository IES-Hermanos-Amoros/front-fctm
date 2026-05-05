import React from 'react';

const StatsLayout = ({ children }) => {
  return (
    <div className="row">
      {React.Children.map(children, (child) => (
        <div className="col-lg-6 col-md-12 mb-4">
          {/* El contenedor mantiene la altura consistente para que no "salten" */}
          <div className="h-100"> 
            {child}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsLayout;