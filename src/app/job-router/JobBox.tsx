import {JobData} from "@/components/types/job";
import React from "react";
import {EllipsisVertical, RefreshCw} from "lucide-react";
import OpenLocationCode from "open-location-code-typescript";
import MapWidget from "@/app/job-router/MapWidget";

export default function JobBox({
                                   jobList,
                                   onRemoveJob
                               }: {
    jobList: JobData[];
    onRemoveJob: (jobToRemove: JobData) => void;
}) {
    const [sortedJobs, setSortedJobs] = React.useState<JobData[]>(jobList);
    const [isOptimized, setIsOptimized] = React.useState(false);

    React.useEffect(() => {
        setSortedJobs(jobList);
        setIsOptimized(false);
    }, [jobList]);

    const getPlusCode = (lat: number, lng: number): string => {
        try {
            return OpenLocationCode.encode(lat, lng);
        } catch (err) {
            console.error("Failed to get plus code:", err);
            return "";
        }
    };

    function calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number {
        const R = 6371; // Earth's radius in km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function toRad(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    function optimizeJobOrder(jobs: JobData[], startingPoint: JobData | null = null): JobData[] {
        if (jobs.length <= 1) return jobs;

        const jobsWithCoordinates = jobs.filter(job => {
            const coords = Object.values(job.backflowList)[0]?.locationInfo?.coordinates;
            return coords &&
                coords.latitude !== 0 &&
                coords.longitude !== 0;
        });

        const jobsWithoutValidCoords = jobs.filter(job => {
            const coords = Object.values(job.backflowList)[0]?.locationInfo?.coordinates;
            return !coords ||
                (coords.latitude === 0 && coords.longitude === 0);
        });

        if (jobsWithCoordinates.length <= 1) {
            return [...jobsWithCoordinates, ...jobsWithoutValidCoords];
        }

        const unvisited = [...jobsWithCoordinates];
        const optimizedRoute: JobData[] = [];

        let currentJob: JobData;
        if (startingPoint) {
            const startingIndex = unvisited.findIndex(job => job.metadata.jobId === startingPoint.metadata.jobId);
            if (startingIndex !== -1) {
                currentJob = unvisited[startingIndex];
                unvisited.splice(startingIndex, 1);
            } else {
                currentJob = unvisited.shift()!;
            }
        } else {
            currentJob = unvisited.shift()!;
        }

        optimizedRoute.push(currentJob);

        while (unvisited.length > 0) {
            let nearestIndex = 0;
            let shortestDistance = Infinity;
            const currentCoords = Object.values(currentJob.backflowList)[0]?.locationInfo?.coordinates;

            unvisited.forEach((job, index) => {
                const jobCoords = Object.values(job.backflowList)[0]?.locationInfo?.coordinates;
                if (currentCoords && jobCoords) {
                    const distance = calculateDistance(
                        currentCoords.latitude,
                        currentCoords.longitude,
                        jobCoords.latitude,
                        jobCoords.longitude
                    );
                    if (distance < shortestDistance) {
                        shortestDistance = distance;
                        nearestIndex = index;
                    }
                }
            });

            currentJob = unvisited[nearestIndex];
            optimizedRoute.push(currentJob);
            unvisited.splice(nearestIndex, 1);
        }

        return [...optimizedRoute, ...jobsWithoutValidCoords];
    }

    const handleOptimize = () => {
        const optimizedJobs = optimizeJobOrder(jobList);
        setSortedJobs(optimizedJobs);
        setIsOptimized(true);
    };

    const handleSetStartingLocation = (job: JobData) => {
        const optimizedJobs = optimizeJobOrder(jobList, job);
        setSortedJobs(optimizedJobs);
        setIsOptimized(true);
    };

    return (
        <>
            {jobList.length > 0 && (
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-semibold">Job List</h2>
                        <button
                            onClick={handleOptimize}
                            className="btn btn-warning"
                            disabled={isOptimized}
                        >
                            <RefreshCw className="w-4 h-4 mr-2"/>
                            Optimize Route
                        </button>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-base-300">
                        <table className="table w-full">
                            <thead>
                            <tr>
                                <th>{isOptimized ? "#" : "?"}</th>
                                <th>Job Name</th>
                                <th>Type</th>
                                <th>Plus Code</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sortedJobs.map((job, index) => {
                                const firstBackflow = Object.values(job.backflowList)[0];
                                const coordinates = firstBackflow?.locationInfo?.coordinates;
                                const validCoordinates = coordinates && coordinates.latitude !== 0 && coordinates.longitude !== 0;
                                const plusCode = coordinates
                                    ? getPlusCode(coordinates.latitude, coordinates.longitude)
                                    : "";

                                return (
                                    <tr
                                        key={job?.metadata.jobId}
                                        className={`hover:bg-base-200 cursor-pointer ${!validCoordinates ? 'bg-warning/20' : ''}`}
                                    >
                                        <td>{isOptimized ? index + 1 : "?"}</td>
                                        <td>{job?.details.jobName || "N/A"}</td>
                                        <td>{job?.details.jobType || "N/A"}</td>
                                        <td>
                                            {validCoordinates ? (
                                                <a
                                                    href={`https://plus.codes/${plusCode}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    {plusCode}
                                                </a>
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                        <td>
                                            <div className="dropdown dropdown-end">
                                                <button tabIndex={0} className="btn btn-ghost btn-sm">
                                                    <EllipsisVertical size={16}/>
                                                </button>
                                                <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                                    <li>
                                                        <button onClick={() => {
                                                            handleSetStartingLocation(job);
                                                        }}>Set as starting location
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button onClick={() => onRemoveJob(job)}>Remove</button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4">
                        <MapWidget jobList={sortedJobs}/>
                    </div>

                </div>
            )}
        </>
    );
}