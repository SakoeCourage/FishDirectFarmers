'use client';

import React from 'react';
import { ProgressProvider } from '@bprogress/next/app';

const Nprogressprovider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <ProgressProvider
                height="4px"
                color="#86efac"
                options={{ showSpinner: false }}
                shallowRouting
            >
            {children}
            </ProgressProvider>
        </>
    );
};

export default Nprogressprovider;
