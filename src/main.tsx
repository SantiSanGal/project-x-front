import { SocketProvider } from './store/socket/SocketContext.tsx'
import { RouterProvider } from 'react-router'
import { router } from './routes/index.tsx'
import { store } from './store/store.ts'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import React from 'react'
import './index.css'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SocketProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </SocketProvider>
  </React.StrictMode>,
)
