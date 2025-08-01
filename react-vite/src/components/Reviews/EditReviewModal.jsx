import { useState, useEffect } from 'react';
import { IoMdStar } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { updateExistingReview, fetchReviews } from './reviewsSlice';
import { useModal } from '../../context/Modal';

function EditReviewModal({ reviewId, productId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const review = useSelector(state => state.reviews.byId[reviewId]);

  const [rating, setRating] = useState(review?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(review?.comment || '');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment);
    }
  }, [review]);

  const fillStars = () => {
    return [0, 1, 2, 3, 4].map((index) => (
      <IoMdStar
        key={index}
        className={index < (hoverRating || rating) ? 'filled-star' : 'empty-star'}
        onClick={() => setRating(index + 1)}
        onMouseEnter={() => setHoverRating(index + 1)}
        onMouseLeave={() => setHoverRating(0)}
      />
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await dispatch(updateExistingReview({
        reviewId,
        reviewData: { rating, comment }
      })).unwrap();
      await dispatch(fetchReviews(productId));
      closeModal();
    } catch (err) {
      setError(err.message || "Failed to update review.");
    }
  };

  return (
    <div className='review-modal-container'>
      <h1 className='header-title'>Edit Your Review</h1>
      {error && <p className='review-error'>{error}</p>}

      <textarea
        value={comment}
        className='text'
        placeholder="Update your review..."
        onChange={(e) => setComment(e.target.value)}
      />

      <div className='stars-div'>
        {fillStars()}
      </div>
      <p className='stars-label'>Stars</p>

      <button
        className='submit-review-button'
        type="submit"
        onClick={handleSubmit}
        disabled={comment.length < 10 || rating === 0}
      >
        Update Review
      </button>
    </div>
  );
}

export default EditReviewModal;