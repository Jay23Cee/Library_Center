import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Book } from "../models/books";


export interface BookState {
  data: Book[];
  errors?: string;
  loading: boolean;
}

const initialState: BookState = {
  data: [{
    ID: '',
    Title: '',
    Author: '',
    Publisher: '',
    Year: '',
    Img: '',
    Img_url: '',
    Img_title: '',
    Summary: ''
  }],
  errors: undefined,
  loading: false
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    fetchBooksRequest: (state) => {
      state.loading = true;
    },
    fetchBooksSuccess: (state, action: PayloadAction<Book[]>) => {
      state.loading = false;
      state.data = action.payload;
    },
    fetchBooksError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.errors = action.payload;
    },
    addBook: (state, action: PayloadAction<Book>) => {
      state.data = [action.payload];
    },
    removeBook : (state, action: PayloadAction<Book>) => {
      state.data = state.data.filter(book => book.ID !== action.payload.ID);
    },
    clearBooks: (state) => {
      // Clear the data array
      state.data = [{
        ID: '',
        Title: '',
        Author: '',
        Publisher: '',
        Year: '',
        Img: '',
        Img_url: '',
        Img_title: '',
        Summary: ''
      }];
    }


  }
});

export const {
  fetchBooksRequest,
  fetchBooksSuccess,
  fetchBooksError,
  addBook,
  removeBook,
  clearBooks
} = bookSlice.actions;

export default bookSlice.reducer;
