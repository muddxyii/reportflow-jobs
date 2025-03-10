'use client'

import React, {useState} from "react";
import JsonUploadBox from "@/components/json-upload-box";

export default function JobRouter() {
    const [jsons, setJsons] = useState<File[]>([])

    return (
        <main className="min-h-screen bg-base-300 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="flex justify-between items-center">
                            <div className="flex justify-between items-center mb-6 w-full">
                                <h1 className="card-title text-2xl font-bold text-left">Job Router</h1>
                            </div>
                        </div>

                        <JsonUploadBox jsonFiles={jsons} onUpdateFiles={setJsons}/>

                        <div className="card-actions justify-end">
                            <button type="submit" className="btn btn-primary">
                                Optimize Job Route
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}