         import {createSlice} from '@reduxjs/toolkit'

         const initialState = {
            currentUser: null,
            loading: false,
            error: false,
         }

         const userSlice = createSlice({
            name: "user",
            initialState,
            reducers: {
                loginStart: (state) => {
                    state.loading = true;
                },
                loginSuccess: (state, action) => {
                    state.currentUser = action.payload;
                    state.loading = false
                },
                loginFailure: (state) => {
                    state.error = true;
                    state.loading = false
                },
                logOut:(state) =>{
                    state.loading=true;
                    state.currentUser = null
                }
            }
         })

         export const {loginFailure,loginStart,loginSuccess, logOut}  = userSlice.actions
         export default userSlice.reducer