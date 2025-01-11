import React, {useState} from "react";

export default function CollapsibleSection({ title, children }: { title: string; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSection = () => setIsOpen(prev => !prev);

    return (
        <div className="rounded-md border border-base-300 bg-base-100">
            <button
                type="button"
                className="w-full text-left text-lg font-bold py-2 px-4 bg-base-200 rounded-t-md"
                onClick={toggleSection}
            >
                {title} {isOpen ? '▼' : '▶'}
            </button>
            {isOpen && <div className="p-4">{children}</div>}
        </div>
    );
}
