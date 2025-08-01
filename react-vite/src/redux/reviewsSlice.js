import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api/reviews';

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (productId) => {
    return await api.fetchReviewsByProduct(productId);
  }
);

export const createNewReview = createAsyncThunk(
  'reviews/createNewReview',
  async ({ productId, reviewData }) => {
    return await api.createReview(productId, reviewData);
  }
);

export const updateExistingReview = createAsyncThunk(
  'reviews/updateExistingReview',
  async ({ reviewId, reviewData }) => {
    return await api.updateReview(reviewId, reviewData);
  }
);

export const deleteExistingReview = createAsyncThunk(
  'reviews/deleteExistingReview',
  async (reviewId) => {
    await api.deleteReview(reviewId);
    return reviewId;
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    byId: {},
    allIds: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.byId = {};
        state.allIds = [];
        action.payload.forEach((review) => {
          state.byId[review.id] = review;
          state.allIds.push(review.id);
        });
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createNewReview.fulfilled, (state, action) => {
        const review = action.payload;
        state.byId[review.id] = review;
        state.allIds.push(review.id);
      })
      .addCase(updateExistingReview.fulfilled, (state, action) => {
        const review = action.payload;
        if (state.byId[review.id]) {
          state.byId[review.id] = review;
        }
      })
      .addCase(deleteExistingReview.fulfilled, (state, action) => {
        const reviewId = action.payload;
        delete state.byId[reviewId];
        state.allIds = state.allIds.filter(id => id !== reviewId);
      });
  },
});

export default reviewsSlice.reducer;
