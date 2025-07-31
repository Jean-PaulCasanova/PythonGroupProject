import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (productId) => {
    const response = await fetch(`/api/products/${productId}/reviews`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch reviews');
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async ({ productId, reviewData }) => {
    const response = await fetch(`/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    if (response.ok) {
      return await response.json();
    }
    const errorData = await response.json();
    throw new Error(errorData.errors || 'Failed to create review');
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, reviewData }) => {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    if (response.ok) {
      return await response.json();
    }
    const errorData = await response.json();
    throw new Error(errorData.errors || 'Failed to update review');
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId) => {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      return reviewId;
    }
    throw new Error('Failed to delete review');
  }
);

export const fetchMyReviews = createAsyncThunk(
  'reviews/fetchMyReviews',
  async () => {
    const response = await fetch('/api/my-reviews');
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch my reviews');
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    myReviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update review
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(review => review.id === action.payload.id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
        const myIndex = state.myReviews.findIndex(review => review.id === action.payload.id);
        if (myIndex !== -1) {
          state.myReviews[myIndex] = action.payload;
        }
      })
      // Delete review
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(review => review.id !== action.payload);
        state.myReviews = state.myReviews.filter(review => review.id !== action.payload);
      })
      // Fetch my reviews
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.myReviews = action.payload;
      });
  },
});

export const { clearReviews, clearError } = reviewsSlice.actions;
export default reviewsSlice.reducer;