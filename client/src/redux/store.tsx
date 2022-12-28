import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import bookReducer from "./bookSlice"


const rootReducer = combineReducers({
  user: userReducer,
  book: bookReducer
})

export const store = configureStore({
  reducer: rootReducer
});
