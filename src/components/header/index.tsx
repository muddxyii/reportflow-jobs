import React from "react";
import Link from "next/link";
import { Phone } from "lucide-react";

const Header = () => {
    return (
        <header
            className="navbar bg-base-100 flex flex-wrap items-center justify-between px-4"
            itemScope
            itemType="http://schema.org/Organization"
        >
            <div className="flex-1">
                <Link href="/" itemProp="name" className="btn btn-ghost normal-case text-xl">
                    ReportFlow Jobs
                </Link>
            </div>
            <div className="flex-none flex flex-wrap items-center gap-2 justify-end">
                <a
                    href="tel:+16023502385"
                    className="btn btn-primary flex items-center gap-2"
                    itemProp="telephone"
                    aria-label="Call us at (602) 350-2385"
                >
                    <Phone size={20} />
                </a>
                <a
                    href="mailto:Nikolas@anybackflow.com"
                    className="btn btn-primary"
                    aria-label="Email us now"
                >
                    Email Now
                </a>
            </div>
        </header>
    );
};

export default Header;
