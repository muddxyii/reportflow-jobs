'use client'

import React, {useState} from "react";
import JsonUploadBox from "@/components/json-upload-box";
import {JobData} from "@/components/types/job";

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

                        {jobs.length > 0 && (
                            <div className="mt-4">
                                <h2 className="text-xl font-semibold mb-2">Job List</h2>
                                <div className="overflow-x-auto">
                                    <table className="table w-full">
                                        <thead>
                                        <tr>
                                            <th>Job Name</th>
                                            <th>Type</th>
                                            <th>Coordinates</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {jobs.map((job, index) => (
                                            <tr key={index} className="hover:bg-base-200">
                                                <td>{job.details.jobName}</td>
                                                <td>{job.details.jobType}</td>
                                                <td>
                                                    {job.backflowList[0]?.locationInfo?.coordinates.longitude ||
                                                        'No coordinates'}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </main>
    );
}