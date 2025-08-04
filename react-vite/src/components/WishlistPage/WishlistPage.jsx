import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { fetchWishlist, removeFromWishlist } from '../../redux/wishlist';
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

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  if (!user) return <p>You must be logged in to view your wishlist.</p>;
  if (!wishlist) return <p>Loading wishlist...</p>;

  return (
    <div className="wishlist-page">
      <h1>Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <>
          <p>No items in your wishlist yet!</p>
          <Link to="/products">
            <button className="continue-browsing-btn">Continue Browsing</button>
          </Link>
        </>
      ) : (
        <>
          <ul className="wishlist-grid">
            {wishlist.map((item) => (
              <li key={item.id} className="wishlist-item">
                <img src={item.cover_image_url} alt={item.title} />
                <h3>{item.title}</h3>
                <p>${parseFloat(item.price).toFixed(2)}</p>
                <button
                  className="remove-wishlist-button"
                  onClick={() => handleRemove(item.productId)}
                >
                  ❌ Remove
                </button>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "2rem" }}>
            <Link to="/products">
              <button className="continue-browsing-btn">Continue Browsing</button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}