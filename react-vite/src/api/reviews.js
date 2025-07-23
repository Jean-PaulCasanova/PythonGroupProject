export const fetchReviewsByProduct = async (productId) => {
    const res = await fetch(`/api/products/${productId}/reviews`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  };
  
  export const createReview = async (productId, reviewData) => {
    const res = await fetch(`/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) throw new Error('Failed to create review');
    return res.json();
  };
  
  export const updateReview = async (reviewId, reviewData) => {
    const res = await fetch(`/api/reviews/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) throw new Error('Failed to update review');
    return res.json();
  };
  
  export const deleteReview = async (reviewId) => {
    const res = await fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete review');
    return res.json();
  };
  