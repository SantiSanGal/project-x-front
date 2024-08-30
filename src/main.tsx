import { RouterProvider } from 'react-router'
import ReactDOM from 'react-dom/client'
import { router } from './routes/index.tsx'
import { store } from './store/store.ts'
import { Provider } from 'react-redux'
import React from 'react'
import './index.css'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
