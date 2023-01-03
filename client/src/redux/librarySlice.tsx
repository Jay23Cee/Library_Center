import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Book } from "../models/books";


export interface LibraryState {
  library:Book [];
  errors?: string;
  loading: boolean;
}

const initialState: LibraryState = {

  library:[],
  errors: undefined,
  loading: false
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    fetchBooksRequest: (state) => {
      state.loading = true;
    },
    fetchBooksSuccess: (state, action: PayloadAction<Book[]>) => {
      state.loading = false;
      state.library = action.payload;
    },
    fetchBooksError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.errors = action.payload;
    },
    addBulkBooks(state, action: PayloadAction<Book[]>) {
      state.library = [...state.library, ...action.payload];
    }
    ,
    clearBulkBooks(state) {
      state.library = [];
    }



  }
});

export const {
  fetchBooksRequest,
  fetchBooksSuccess,
  fetchBooksError,
  addBulkBooks,
  clearBulkBooks,
} = librarySlice.actions;

export default librarySlice.reducer;
