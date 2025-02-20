'use client'

import PdfUploadBox from "@/components/pdf-upload-box";
import React, {useState} from "react";
import PdfClearOptions from "@/app/pdf-editor/PdfClearOptions";

export default function PdfEditor() {
    const [pdfs, setPdfs] = useState<File[]>([]);
    const [clearOptions, setClearOptions] = useState({
        keepGenericInfo: false,
        keepTestData: false,
        keepComments: false
    });

    const handleCheckboxChange = (option: keyof typeof clearOptions) => {
        setClearOptions(prev => ({
            ...prev,
            [option]: !prev[option]
        }));
    };

    return (
        <main className="min-h-screen bg-base-300 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="flex justify-between items-center">
                            <div className="flex justify-between items-center mb-6 w-full">
                                <h1 className="card-title text-2xl font-bold text-left">PDF Editor</h1>
                            </div>
                        </div>

                        <PdfClearOptions
                            clearOptions={clearOptions}
                            onOptionChange={handleCheckboxChange}
                        />

                        <PdfUploadBox pdfs={pdfs} onUpdateFiles={setPdfs}/>

                        <div className="card-actions justify-end">
                            <button type="submit" className="btn btn-primary">
                                Download Updated PDF(s)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}