import { useState } from 'react';
import PropTypes from 'prop-types';
import StarRating from './StarRating';

/**
 * RatingModal Component - Modal for submitting ratings
 * 
 * @param {object} order - Order object to rate
 * @param {function} onSubmit - Callback when rating is submitted
 * @param {function} onClose - Callback to close modal
 */
const RatingModal = ({ order, onSubmit, onClose }) => {
  const [mealRating, setMealRating] = useState(0);
  const [cookRating, setCookRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mealRating === 0 || cookRating === 0) {
      setError('Please provide both meal and cook ratings');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        order_id: order.id,
        meal_rating: mealRating,
        cook_rating: cookRating,
        comment: comment.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050
    }}>
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        maxWidth: '500px',
        width: '90%',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
          color: 'white',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h5 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '700' }}>
            <i className="bi bi-star-fill me-2"></i>
            Rate Your Order
          </h5>
          <button
            onClick={onClose}
            disabled={submitting}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1
            }}>
            ×
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {error && (
            <div style={{
              background: '#FFE5E5',
              border: '2px solid #FF6B35',
              color: '#B30000',
              borderRadius: '0.75rem',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          {/* Meal Rating */}
          <div style={{ marginBottom: '2rem' }}>
            <h6 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#212529',
              marginBottom: '0.5rem'
            }}>
              {order.meal_details?.name}
            </h6>
            <p style={{ color: '#757575', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '300' }}>
              How was the meal?
            </p>
            <StarRating value={mealRating} onChange={setMealRating} size={32} />
          </div>

          {/* Cook Rating */}
          <div style={{ marginBottom: '2rem' }}>
            <h6 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#212529',
              marginBottom: '0.5rem'
            }}>
              Cook: {order.meal_details?.cook_name}
            </h6>
            <p style={{ color: '#757575', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '300' }}>
              How was your experience with the cook?
            </p>
            <StarRating value={cookRating} onChange={setCookRating} size={32} />
          </div>

          {/* Comments */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#212529',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}>
              Comments (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              maxLength="500"
              rows="3"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #E0E0E0',
                borderRadius: '0.5rem',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease',
                resize: 'vertical'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FF6B35';
                e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E0E0E0';
                e.target.style.boxShadow = 'none';
              }}
            />
            <div style={{
              textAlign: 'right',
              fontSize: '0.8rem',
              color: '#BDBDBD',
              marginTop: '0.25rem'
            }}>
              {comment.length}/500
            </div>
          </div>

          {/* Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{
                background: 'white',
                color: '#757575',
                border: '2px solid #E0E0E0',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.6 : 1,
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (!submitting) {
                  e.target.style.background = '#F8F9FA';
                  e.target.style.borderColor = '#BDBDBD';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#E0E0E0';
              }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: submitting ? '#BDBDBD' : 'linear-gradient(135deg, #FF6B35, #E55A24)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (!submitting) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(255,107,53,0.3)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}>
              {submitting ? (
                <>
                  <i className="bi bi-hourglass-split me-1" style={{ animation: 'spin 1s linear infinite' }}></i>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-1"></i>
                  Submit Rating
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

RatingModal.propTypes = {
  order: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RatingModal;
