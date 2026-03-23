import React, { useState } from 'react';

const StarRating = ({ rating = 0, onRate, size = 'md', readonly = false }) => {
  const [hover, setHover] = useState(0);
  
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`${sizes[size]} transition-all duration-200 ${
            !readonly ? 'cursor-pointer hover:scale-125' : 'cursor-default'
          }`}
        >
          <svg
            className={`w-full h-full ${
              star <= (hover || rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-400 fill-current'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-2 text-white font-bold">{rating}/10</span>
      )}
    </div>
  );
};

export default StarRating;
