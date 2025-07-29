import './CreateReviewModal.css';
import { IoMdStar } from "react-icons/io";
import { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { createNewReview, fetchReviews } from "../../redux/reviewsSlice";
import { useModal } from "../../context/Modal";

function CreateReviewModal({ productId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    setRating(0);
    setHoverRating(0);
    setContent('');
    setError(null);
  }, [productId]);

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

    if (content.length < 10 || rating === 0) {
      setError('Review must be at least 10 characters and include a rating.');
      return;
    }

    try {
      await dispatch(createNewReview({
        productId,
        reviewData: { content, rating },
      })).unwrap();

      await dispatch(fetchReviews(productId));
      closeModal();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className='review-modal-container'>
      <h1 className='header-title'>How was this release?</h1>
      {error && <p className='review-error'>{error}</p>}

      <textarea
        value={content}
        className='text'
        placeholder="Leave your review here..."
        onChange={(e) => setContent(e.target.value)}
      />

      <div className='stars-div'>
        {fillStars()}
      </div>
      <p className='stars-label'>Stars</p>

      <button
        className='submit-review-button'
        type="submit"
        onClick={handleSubmit}
        disabled={content.length < 10 || rating === 0}
      >
        Submit Your Review
      </button>
    </div>
  );
}

export default CreateReviewModal;
