// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { canvasSlice } from './slices/canvas';
import { userSlice } from './slices/user';

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        canvas: canvasSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
