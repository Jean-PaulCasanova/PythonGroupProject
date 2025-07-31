import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateReview } from '../../redux/reviewsSlice';
import './Reviews.css';

function EditReview({ review, onReviewUpdated, onCancel }) {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(review?.rating || 5);
  const [title, setTitle] = useState(review?.title || '');
  const [content, setContent] = useState(review?.content || '');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setTitle(review.title);
      setContent(review.content);
    }
  }, [review]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await dispatch(updateReview({
        reviewId: review.id,
        reviewData: { rating, title, content }
      })).unwrap();
      
      if (onReviewUpdated) {
        onReviewUpdated();
      }
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-review">
      <h3>Edit Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="rating">Rating:</label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            required
          >
            <option value={5}>5 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={2}>2 Stars</option>
            <option value={1}>1 Star</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Review:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={500}
            rows={4}
            required
          />
        </div>

        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Review'}
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditReview;