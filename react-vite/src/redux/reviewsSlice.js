import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api/reviews';

// Async thunks
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (productId) => {
    try {
      return await api.fetchReviewsByProduct(productId);
    } catch (error) {
      throw new Error('Failed to fetch reviews');
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async ({ productId, reviewData }) => {
    try {
      return await api.createReview(productId, reviewData);
    } catch (error) {
      throw new Error('Failed to create review');
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, reviewData }) => {
    try {
      return await api.updateReview(reviewId, reviewData);
    } catch (error) {
      throw new Error('Failed to update review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId) => {
    try {
      await api.deleteReview(reviewId);
      return reviewId;
    } catch (error) {
      throw new Error('Failed to delete review');
    }
  }
);

export const fetchMyReviews = createAsyncThunk(
  'reviews/fetchMyReviews',
  async () => {
    try {
      return await api.fetchMyReviews();
    } catch (error) {
      throw new Error('Failed to fetch my reviews');
    }
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
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(review => review.id === action.payload.id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(review => review.id !== action.payload);
      })
      .addCase(fetchMyReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.myReviews = action.payload;
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearReviews, clearError } = reviewsSlice.actions;
export default reviewsSlice.reducer;
