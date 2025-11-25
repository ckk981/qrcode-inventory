import React from 'react';
import logoBSE from '../assets/logo-bse-horizontal.svg';

function BrandFooter() {
    const year = new Date().getFullYear();
    return (
        <footer className="bg-brand-900 text-white mt-auto">
            <div className="max-w-md mx-auto w-full px-4 py-4 flex items-center justify-center gap-3">
                <img src={logoBSE} alt="BSE Mechanical" className="h-6" />
                <span className="text-xs opacity-90">
                    <span className="font-display font-semibold">BSE Mechanical</span> 
                    • QR Inventory • {year}
                </span>
            </div>
        </footer>
    );
}

export default BrandFooter;
