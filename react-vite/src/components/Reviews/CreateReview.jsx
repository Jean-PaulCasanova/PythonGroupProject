import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReview } from '../../redux/reviewsSlice';
import './Reviews.css';

function CreateReview({ productId, onReviewCreated }) {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await dispatch(createReview({
        productId,
        reviewData: { rating, title, content }
      })).unwrap();
      
      // Reset form
      setRating(5);
      setTitle('');
      setContent('');
      
      if (onReviewCreated) {
        onReviewCreated();
      }
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-review">
      <h3>Write a Review</h3>
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

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}

export default CreateReview;