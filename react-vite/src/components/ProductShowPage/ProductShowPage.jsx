// //? --------- OG SHOW PAGE ----------

// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";

// function ProductShowPage() {
//   const { productId } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     fetch(`http://localhost:5000/api/products/${productId}`)
//       .then((res) => res.json())
//       .then(setProduct)
//       .catch((err) => console.error("Failed to load product:", err));
//   }, [productId]);

//   if (!product) return <p>Loading...</p>;

//   return (
//     <div className="product-show-page">
//       <div style={{ display: "flex" }}>
//         {/* Album photo */}
//         <div>
//           <img
//             src={product.cover_image_url}
//             alt={product.title}
//             style={{ width: "300px", height: "300px", objectFit: "cover" }}
//           />
//           <div>
//             <button>Cart</button>
//             <button>Wish</button>
//           </div>
//         </div>

//         {/* Album info */}
//         <div style={{ marginLeft: "30px" }}>
//           <h1>{product.title}</h1>
//           <h3>By: {product.seller?.username || "Artist name"}</h3>

//           <div>
//             <button>▶</button> Featured Track
//           </div>

//           <h4>Digital Album</h4>
//           <div
//             style={{
//               border: "1px solid gray",
//               padding: "10px",
//               minWidth: "300px",
//             }}
//           >
//             {product.description}
//           </div>
//         </div>
//       </div>

//       <div style={{ marginTop: "30px" }}>
//         <h3>Reviews</h3>
//         <p><em>Be the first</em></p>
//         <p>“Feature coming soon”</p>
//       </div>
//     </div>
//   );
// }

// export default ProductShowPage;


// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import "./ProductShowPage.css";

// function ProductShowPage() {
//   const { productId } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     fetch(`http://localhost:5000/api/products/${productId}`)
//       .then((res) => res.json())
//       .then(setProduct)
//       .catch((err) => console.error("Failed to load product:", err));
//   }, [productId]);

//   if (!product) return <p>Loading...</p>;

//   return (
//     <div className="product-show-page">
//       <div className="product-show-main">
//         {/* Album cover & buttons */}
//         <div className="product-image-section">
//           <img
//             src={product.cover_image_url}
//             alt={product.title}
//             className="product-image"
//           />
//           <div className="action-buttons">
//             <button className="cart-button">Add to Cart</button>
//             <button className="wishlist-button">Add to Wishlist</button>
//           </div>
//         </div>

//         {/* Album Info */}
//         <div className="product-info-section">
//           <h1>{product.title}</h1>
//           <h3>By: {product.seller?.username || "Artist name"}</h3>

//           <div className="featured-track">
//             <button className="play-button">▶</button>
//             <span> Featured Track</span>
//           </div>

//           <h4>Digital Album</h4>
//           <div className="product-description">
//             {product.description}
//           </div>
//         </div>
//       </div>

//       {/* Reviews Section */}
//       <div className="reviews-section">
//         <h3>Reviews</h3>
//         <p><em>Be the first to review this album!</em></p>
//         <p>“Review feature coming soon”</p>
//       </div>
//     </div>
//   );
// }

// export default ProductShowPage;

// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import "./ProductShowPage.css";

// function ProductShowPage() {
//   const { productId } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     fetch(`http://localhost:5000/api/products/${productId}`)
//       .then((res) => res.json())
//       .then(setProduct)
//       .catch((err) => console.error("Failed to load product:", err));
//   }, [productId]);

//   if (!product) return <p>Loading...</p>;

//   return (
//     <div className="product-show-page">
//       <div className="product-show-main">
//         <div className="product-image-section">
//           <img
//             src={product.cover_image_url}
//             alt={product.title}
//             className="product-image"
//           />
//           <div className="action-buttons">
//             <button className="cart-button">Add to Cart</button>
//             <button className="wishlist-button">Add to Wishlist</button>
//           </div>
//         </div>

//         <div className="product-info-section">
//           <h1>{product.title}</h1>
//           <h3>By: {product.seller?.username || "Artist name"}</h3>

//           <div className="featured-track">
//             <button className="play-button">▶</button>
//             <span> Featured Track</span>
//           </div>

//           <h4>Digital Album</h4>
//           <div className="product-description">{product.description}</div>
//         </div>
//       </div>

//       <div className="reviews-section">
//         <h3>Reviews</h3>
//         <p><em>Be the first to review this album!</em></p>
//         <p>“Review feature coming soon”</p>
//       </div>
//     </div>
//   );
// }

// export default ProductShowPage;


import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cart";
import { addToWishlist } from "../../redux/wishlist";
import { API_BASE_URL } from "../../config";
import "./ProductShowPage.css";

function ProductShowPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products/${productId}`)
      .then((res) => res.json())
      .then(setProduct)
      .catch((err) => console.error("Failed to load product:", err));
  }, [productId]);

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please log in to add items to cart');
      return;
    }
    
    setAddingToCart(true);
    try {
      await dispatch(addToCart(product.id, 1));
      alert('Product added to cart!');
    } catch (error) {
      alert('Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      alert('Please log in to add items to wishlist');
      return;
    }
    
    setAddingToWishlist(true);
    try {
      await dispatch(addToWishlist(product.id));
      alert('Product added to wishlist!');
    } catch (error) {
      alert('Failed to add product to wishlist');
    } finally {
      setAddingToWishlist(false);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-show-page">
      <div className="product-show-main">
        <div className="product-image-section">
          <img
            src={product.cover_image_url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='100' y='100' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='14' fill='%23666'%3ENo Image%3C/text%3E%3C/svg%3E"}
            alt={product.title}
            className="product-image"
          />
          <div className="action-buttons">
            <button 
              className="cart-button"
              onClick={handleAddToCart}
              disabled={!user || addingToCart}
              style={{
                backgroundColor: user ? '#28a745' : '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: user ? 'pointer' : 'not-allowed',
                marginRight: '10px'
              }}
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button 
              className="wishlist-button"
              onClick={handleAddToWishlist}
              disabled={!user || addingToWishlist}
              style={{
                backgroundColor: user ? '#dc3545' : '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: user ? 'pointer' : 'not-allowed'
              }}
            >
              {addingToWishlist ? 'Adding...' : 'Add to Wishlist'}
            </button>
          </div>
        </div>

        <div className="product-info-section">
          <h1>{product.title}</h1>
          <h3>By: {product.seller?.username || "Artist name"}</h3>

          <div className="featured-track">
            <button
              className="play-button"
              onClick={() => alert("Feature coming soon!")}
            >
              ▶
            </button>
            <span> Featured Track</span>
          </div>

          <h4>Digital Album</h4>
          <div className="product-description">{product.description}</div>
        </div>
      </div>

      <div className="reviews-section">
        <h3>Reviews</h3>
        <p><em>Be the first to review this album!</em></p>
        <p>“Review feature coming soon”</p>
      </div>
    </div>
  );
}

export default ProductShowPage;