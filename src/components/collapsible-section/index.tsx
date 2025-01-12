import React, {useState} from "react";
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function CollapsibleSection({ title, children }: { title: string; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="rounded-md border border-base-300 bg-base-100">
            <button
                type="button"
                className="flex w-full items-center justify-between text-lg font-bold py-2 px-4 bg-base-200 rounded-t-md"
                onClick={() => setIsOpen(prev => !prev)}
            >
                <span>{title}</span>
                {isOpen ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
            </button>
            {isOpen && <div className="p-4">{children}</div>}
        </div>
    );
}
