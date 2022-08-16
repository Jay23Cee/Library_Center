         import {createSlice} from '@reduxjs/toolkit'

         const initialState = {
            currentUser: null,
            login:false,
            loading: false,
            error: false,
         }

         const userSlice = createSlice({
            name: "user",
            initialState,
            reducers: {
                loginStart: (state) => {
                    state.loading = true;
                    state.login = false;
                },
                loginSuccess: (state, action) => {
                    state.currentUser = action.payload;
                    state.loading = false
                    state.login = true
                },
                loginFailure: (state) => {
                    state.error = true;
                    state.loading = false
                    state.login = false
                },
                logOut:(state) =>{
                    state.loading=true;
                    state.currentUser = null
                    state.login=false
                }
            }
         })

         export const {loginFailure,loginStart,loginSuccess, logOut}  = userSlice.actions
         export default userSlice.reducer