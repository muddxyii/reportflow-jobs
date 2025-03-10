'use client'

import {Car, FileCog, FilePlus2} from "lucide-react";
import React from "react";

export default function Home() {
    return (
        <main className="min-h-screen bg-base-300 flex flex-col items-center justify-center space-y-6">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="card-title text-2xl font-bold mb-6">ReportFlow Tools</h1>
                    <div className="space-y-4">
                        <button
                            className="btn btn-primary w-full"
                            onClick={() => window.location.href = '/new'}
                        >
                            <FilePlus2 className="w-4 h-4 mr-2"/>
                            Create New RF Job
                        </button>
                        <button
                            className="btn btn-secondary w-full"
                            onClick={() => window.location.href = '/edit'}
                        >
                            <FileCog className="w-4 h-4 mr-2"/>
                            Edit Existing RF Job
                        </button>
                        <button
                            className="btn btn-warning w-full"
                            onClick={() => window.location.href = '/job-router'}
                        >
                            <Car className="w-4 h-4 mr-2"/>
                            Route RF Jobs
                        </button>
                    </div>
                </div>
            </div>
            {/* <div className="card w-96 bg-base-100 shadow-xl">
    <div className="card-body">
        <h1 className="card-title text-2xl font-bold mb-6">PDF Tools</h1>
        <div className="space-y-4">
            <button
                className="btn btn-primary w-full"
                onClick={() => window.location.href = '/pdf-editor'}
            >
                Edit PDF
            </button>
        </div>
    </div>
</div> */}
        </main>
    );
}