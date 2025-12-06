import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * StarRating Component - Interactive star rating input
 * 
 * @param {number} value - Current rating value (1-5)
 * @param {function} onChange - Callback when rating changes
 * @param {boolean} readonly - If true, stars are not clickable
 * @param {number} size - Size of stars (default 24px)
 */
const StarRating = ({ value = 0, onChange, readonly = false, size = 24 }) => {
  const [hover, setHover] = useState(0);

  const handleClick = (rating) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`bi bi-star${
            star <= (hover || value) ? '-fill' : ''
          }`}
          style={{ 
            color: star <= (hover || value) ? '#F39C12' : '#E0E0E0',
            fontSize: `${size}px`,
            cursor: readonly ? 'default' : 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        />
      ))}
    </div>
  );
};

StarRating.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  readonly: PropTypes.bool,
  size: PropTypes.number,
};

export default StarRating;
