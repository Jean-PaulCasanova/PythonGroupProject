import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteReview } from '../../redux/reviewsSlice';
import './Reviews.css';

function DeleteReview({ review, onReviewDeleted, onCancel }) {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      await dispatch(deleteReview(review.id)).unwrap();
      
      if (onReviewDeleted) {
        onReviewDeleted();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="delete-review-modal">
      <div className="modal-content">
        <h3>Delete Review</h3>
        <p>Are you sure you want to delete this review?</p>
        <div className="review-preview">
          <h4>{review.title}</h4>
          <div className="rating">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
          <p>{review.content}</p>
        </div>
        
        {error && (
          <div className="error-message">{error}</div>
        )}
        
        <div className="modal-actions">
          <button 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="delete-button"
          >
            {isDeleting ? 'Deleting...' : 'Delete Review'}
          </button>
          <button onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteReview;