import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews } from '../../redux/reviewsSlice';

const ReviewList = ({ productId }) => {
  const dispatch = useDispatch();
  const reviews = useSelector(state => state.reviews.allIds.map(id => state.reviews.byId[id]));
  const loading = useSelector(state => state.reviews.loading);
  const error = useSelector(state => state.reviews.error);

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
        <div key={review.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h4>{review.title}</h4>
          <p>Rating: {review.rating} / 5</p>
          <p>{review.content}</p>
          <small>By: {review.user?.username || 'Unknown'}</small>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
