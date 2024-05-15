import { createBrowserRouter } from 'react-router-dom';
import { PageMain } from '../pages/PageMain';
import { PageLogin } from '../pages/sv-auth/PageLogin';
import { PageAbout } from '../pages/PageAbout';
import { PagePurchases } from '../pages/PagePurchases';
import { PageAccount } from '../pages/PageAccount';
import { Header } from '../components/shared/Header';
import React from 'react';
import { PageRegister } from '../pages/sv-auth/PageRegister';

const CustomRoute: React.FC<{ element: React.ReactNode }> = ({ element, ...rest }) => {
    return (
        <>
            <Header />
            {React.cloneElement(element as React.ReactElement<any>, rest)}
        </>
    );
};

export const router = createBrowserRouter([
    {
        path: '/',
        element: <CustomRoute element={<PageMain />} />,
    },
    {
        path: '/login',
        element: <PageLogin />,
    },
    {
        path: '/register',
        element: <PageRegister />,
    },
    {
        path: '/purchases',
        element: <CustomRoute element={<PagePurchases />} />,
    },
    {
        path: '/about',
        element: <CustomRoute element={<PageAbout />} />,
    },
    {
        path: '/account',
        element: <CustomRoute element={<PageAccount />} />,
    },
]);