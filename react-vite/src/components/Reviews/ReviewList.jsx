import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews } from '../../redux/reviewsSlice';
import DeleteReviewButton from '../DeleteReviewButton'; 
import EditReviewModal from '../EditReviewModal'; 

const ReviewList = ({ productId }) => {
  const dispatch = useDispatch();

  const reviews = useSelector(state =>
    state.reviews.allIds.map(id => state.reviews.byId[id])
  );
  const loading = useSelector(state => state.reviews.loading);
  const error = useSelector(state => state.reviews.error);
  const currentUser = useSelector(state => state.session.user);

  useEffect(() => {
    if (productId) {
      dispatch(fetchReviews(productId));
    }
  }, [dispatch, productId]);

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>Error loading reviews: {error}</div>;
  if (!reviews.length) return <div>No reviews yet.</div>;

  return (
    <div>
      {reviews.map(review => (
        <div
          key={review.id}
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            margin: '10px 0',
            position: 'relative'
          }}
        >
          <h4>{review.title}</h4>
          <p>Rating: {review.rating} / 5</p>
          <p>{review.content}</p>
          <small>By: {review.user?.username || 'Unknown'}</small>

          {currentUser && currentUser.id === review.userId && (
            <div style={{ marginTop: '10px' }}>
              <EditReviewModal review={review} />
              <DeleteReviewButton review={review} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
