import React from 'react';

interface SpinnerProps {
    className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ className = "" }) => {
    return (
        <div
            className={`w-6 h-6 border-4 border-solid border-gray-300 border-t-lime-600 rounded-full animate-spin ${className}`}
        />
    );
};
