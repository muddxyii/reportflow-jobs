'use client';

import React from "react";
import CompanyInfo from "@/components/footer/CompanyInfo";
import GithubIcon from "@/components/footer/GithubIcon";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const displayYear = currentYear === 2025 ? "2025" : `2025-${currentYear}`;

    return (
        <footer className="footer p-10 bg-base-200 text-base-content" itemScope itemType="http://schema.org/Organization">
            <div className="max-w-7xl mx-auto w-full">
                <div className="flex flex-wrap items-center justify-center gap-8 w-full">
                    <CompanyInfo/>
                    <button
                        onClick={() => window.open('https://github.com/muddxyii/reportflow-jobs', '_blank')}
                        className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                        aria-label="Website Github Page"
                    >
                        <GithubIcon/>
                    </button>
                    <p className="text-sm">
                        <span itemProp="copyrightYear">{displayYear}</span> © AnyBackflow.com Inc. - All Rights
                        Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
export default Footer