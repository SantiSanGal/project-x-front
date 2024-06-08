import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        accessToken: '',
        isLogged: false
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