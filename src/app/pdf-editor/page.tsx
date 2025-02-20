'use client'

import PdfUploadBox from "@/components/pdf-upload-box";
import React, {useState} from "react";
import PdfClearOptions from "@/app/pdf-editor/PdfClearOptions";
import {handleGeneratePdfs} from "@/app/pdf-editor/GeneratePdfs";

export default function PdfEditor() {
    const [pdfs, setPdfs] = useState<File[]>([]);
    const [clearOptions, setClearOptions] = useState({
        keepGenericInfo: false,
        keepTestData: false,
        keepComments: false,
        keepInitialTestData: false,
        keepRepairData: false,
        keepFinalTestData: false,
    });

    const handleClearOptionsChange = (option: keyof typeof clearOptions) => {
        if (option === 'keepTestData' && !clearOptions.keepTestData) {
            // If keepTestData is being unchecked, reset all  sub options
            setClearOptions(prev => ({
                ...prev,
                keepInitialTestData: true,
                keepRepairData: false,
                keepFinalTestData: false
            }));
        }

        setClearOptions(prev => ({
            ...prev,
            [option]: !prev[option]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleGeneratePdfs(clearOptions, pdfs)
    }

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

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <PdfClearOptions
                                clearOptions={clearOptions}
                                onOptionChange={handleClearOptionsChange}
                            />

                            <PdfUploadBox pdfs={pdfs} onUpdateFiles={setPdfs}/>

                            <div className="card-actions justify-end">
                                <button type="submit" className="btn btn-primary">
                                    Download Updated PDF(s)
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}