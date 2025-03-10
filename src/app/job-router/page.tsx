'use client'

import React, {useState} from "react";
import JsonUploadBox from "@/components/json-upload-box";
import {JobData} from "@/components/types/job";
import JobBox from "@/app/job-router/JobBox";

export default function JobRouter() {
    const [jsons, setJsons] = useState<File[]>([])
    const [jobs, setJobs] = useState<JobData[]>([])
    const [error, setError] = useState<string | null>(null)

    const handleConvertToJob = async (file: File) => {
        try {
            const text = await file.text();
            const jobData = JSON.parse(text) as JobData;
            setJobs(prevJobs => [...prevJobs, jobData]);
        } catch (error) {
            console.error(`Error processing JSON file: ${file.name}`, error);
            setError(`Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    const handleRemoveJob = (jobToRemove: JobData) => {
        setJobs(currentJobs => currentJobs.filter(job => job !== jobToRemove));
    };

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

                        <JsonUploadBox jsonFiles={jsons} onUpdateFiles={setJsons} onConvert={handleConvertToJob}/>

                        {error && (
                            <div className="alert alert-error mt-4">
                                <span>{error}</span>
                            </div>
                        )}

                        <JobBox jobList={jobs} onRemoveJob={handleRemoveJob}/>

                    </div>
                </div>
            </div>
        </main>
    );
}