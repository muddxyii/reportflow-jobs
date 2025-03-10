import {JobData} from "@/components/types/job";
import React from "react";
import {Trash2} from "lucide-react";
import OpenLocationCode from "open-location-code-typescript";

export default function JobBox({
                                   jobList,
                                   onRemoveJob
                               }: {
    jobList: JobData[];
    onRemoveJob: (jobToRemove: JobData) => void;
}) {

    const getPlusCode = (lat: number, lng: number): string => {
        try {
            return OpenLocationCode.encode(lat, lng);
        } catch (err) {
            console.error("Failed to get plus code:", err);
            return "";
        }
    };

    return (
        <>
            {jobList.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Job List</h2>
                    <div className="overflow-x-auto rounded-lg border border-base-300">
                        <table className="table w-full">
                            <thead>
                            <tr className="bg-base-200">
                                <th className="font-semibold">Job Name</th>
                                <th className="font-semibold">Type</th>
                                <th className="font-semibold">Plus Code</th>
                                <th className="font-semibold">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {jobList.map((job, index) => (
                                <tr
                                    key={index}
                                    className={`hover:bg-base-200 border-t border-base-300 ${
                                        !(Object.values(job.backflowList)[0]?.locationInfo?.coordinates?.longitude)
                                            ? 'bg-yellow-100'
                                            : ''
                                    }`}
                                >
                                    <td className="font-medium">{job.details.jobName}</td>
                                    <td>{job.details.jobType}</td>
                                    <td>
                                        {job.backflowList &&
                                        Object.values(job.backflowList)[0]?.locationInfo?.coordinates?.latitude != 0.0 &&
                                        Object.values(job.backflowList)[0]?.locationInfo?.coordinates?.longitude != 0.0
                                            ? getPlusCode(
                                                Object.values(job.backflowList)[0].locationInfo.coordinates.latitude,
                                                Object.values(job.backflowList)[0].locationInfo.coordinates.longitude
                                            )
                                            : "No coordinates"
                                        }
                                    </td>
                                    <td className="flex gap-2">
                                        <button
                                            className="btn btn-square btn-sm btn-error"
                                            title="Remove job"
                                            onClick={() => onRemoveJob(job)}
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}