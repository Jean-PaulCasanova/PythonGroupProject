import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '../../redux/wishlist';
import './Wishlist.css';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  if (!user) return <p>You must be logged in to view your wishlist.</p>;
  if (!wishlist) return <p>Loading wishlist...</p>;

  return (
    <div className="wishlist-page">
      <h1>Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>No items in your wishlist yet!</p>
      ) : (
        <ul className="wishlist-grid">
          {wishlist.map((item) => (
            <li key={item.id} className="wishlist-item">
              <img src={item.coverImageUrl} alt={item.title} />
              <h3>{item.title}</h3>
              <p>${item.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}