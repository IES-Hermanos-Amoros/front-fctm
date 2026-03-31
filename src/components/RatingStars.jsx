import React from "react";

const RatingStars = ({ rating, maxStars = 5 }) => {
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    if (i <= rating) {
      stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
    } else if (i - 0.5 <= rating) {
      stars.push(<i key={i} className="bi bi-star-half text-warning"></i>);
    } else {
      stars.push(<i key={i} className="bi bi-star text-secondary"></i>);
    }
  }

  return <span>{stars}</span>;
};

export default RatingStars;
