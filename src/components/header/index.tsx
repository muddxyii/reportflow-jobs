import React from "react";
import Link from "next/link";
import {Phone} from "lucide-react";

const Header = () => {
    return (
        <header className="navbar bg-base-100" itemScope itemType="http://schema.org/Organization">
            <div className="flex-1">
                <Link href="/" itemProp="name" className="btn btn-ghost text-xl">ReportFlow Jobs</Link>
            </div>
            <div className="flex-none">
                <a href="tel:+16023502385"
                   className="flex items-center gap-2 text-primary hover:text-primary/80"
                   itemProp="telephone"
                   aria-label="Call us at (602) 350-2385">
                    <Phone size={20}/>
                    <span className="font-semibold">(602) 350-2385</span>
                </a>
                <a href="mailto:Nikolas@anybackflow.com" className="btn btn-primary ml-4" aria-label="Email us now">
                    Email Now
                </a>
            </div>
        </header>
    )
}

export default Header