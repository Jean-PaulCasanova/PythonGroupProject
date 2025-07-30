import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cart";

function ProductShowPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then(setProduct);
  }, [id]);

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

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-show-page">
      <div style={{ display: "flex" }}>
        {/* Album photo */}
        <div>
          <img
            src={product.cover_image_url}
            alt={product.title}
            style={{ width: "300px", height: "300px", objectFit: "cover" }}
          />
          <div>
            <button 
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
            <button>Wish</button>
          </div>
        </div>

        {/* Album info */}
        <div style={{ marginLeft: "30px" }}>
          <h1>{product.title}</h1>
          <h3>By: {product.seller?.username || "Artist name"}</h3>

          <div>
            <button>▶</button> Featured Track
          </div>

          <h4>Digital Album</h4>
          <div
            style={{
              border: "1px solid gray",
              padding: "10px",
              minWidth: "300px",
            }}
          >
            {product.description}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>Reviews</h3>
        <p><em>Be the first</em></p>
        <p>“Feature coming soon”</p>
      </div>
    </div>
  );
}

export default ProductShowPage;