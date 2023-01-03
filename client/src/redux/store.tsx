import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import bookReducer from "./bookSlice"
import libraryReducer from "./librarySlice"


const rootReducer = combineReducers({
  user: userReducer,
  book: bookReducer,
  library: libraryReducer
})

export const store = configureStore({
  reducer: rootReducer
});
