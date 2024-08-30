import { Header } from "../../components/shared/Header/Header";
import React from "react";

export const CustomRoute: React.FC<{ element: React.ReactNode }> = ({ element, ...rest }) => {
    return (
        <>
            <Header />
            {React.cloneElement(element as React.ReactElement<any>, rest)}
        </>
    );
};