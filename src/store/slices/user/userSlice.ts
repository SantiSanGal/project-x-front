import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        accessToken: localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : '',
        isLogged: localStorage.getItem('accessToken') ? true : false
    },
    reducers: {
        login: (state, action) => {
            state.accessToken = action.payload
            state.isLogged = true
        },
        logout: (state) => {
            state.accessToken = ''
            state.isLogged = false
        }
    },
})

export const { login, logout } = userSlice.actions