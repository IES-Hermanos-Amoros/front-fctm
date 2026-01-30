import React from "react";

const ShowHeader = ({ title }) => {
  return (
    <div className="mb-4">
      <h2>{title}</h2>
      <hr />
    </div>
  );
};

export default ShowHeader;