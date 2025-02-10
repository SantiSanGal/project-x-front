import { createBrowserRouter } from 'react-router-dom';
import { Login } from '@/pages/Login';
import App from '@/App';
import { About } from '@/pages/About';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: 'login',
        element: <Login />
    },
    {
        path: 'about',
        element: <About />
    }

]);