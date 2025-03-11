import {JobData} from "@/components/types/job";
import React from "react";
import {EllipsisVertical} from "lucide-react";
import OpenLocationCode from "open-location-code-typescript";

export default function JobBox({
                                   jobList,
                                   onRemoveJob
                               }: {
    jobList: JobData[];
    onRemoveJob: (jobToRemove: JobData) => void;
}) {

    const [sortedJobs, setSortedJobs] = React.useState<JobData[]>(jobList);

    React.useEffect(() => {
        const optimizedJobs = optimizeJobOrder(jobList);
        setSortedJobs(optimizedJobs);
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

    function optimizeJobOrder(jobs: JobData[]): JobData[] {
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
        let currentJob = unvisited.shift()!;
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

    return (
        <>
            {jobList.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Job List</h2>
                    <div className="overflow-x-auto rounded-lg border border-base-300">
                        <table className="table w-full">
                            <thead>
                            <tr className="bg-base-200">
                                <th className="font-semibold">Order #</th>
                                <th className="font-semibold">Job Name</th>
                                <th className="font-semibold">Type</th>
                                <th className="font-semibold">Plus Code</th>
                                <th className="font-semibold">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sortedJobs.map((job, index) => {
                                const coords = Object.values(job.backflowList)[0]?.locationInfo?.coordinates;
                                const hasValidCoordinates = coords &&
                                    coords.latitude !== 0 &&
                                    coords.longitude !== 0;

                                return (
                                    <tr
                                        key={index}
                                        className={`hover:bg-base-200 cursor-pointer ${!hasValidCoordinates ? 'bg-warning/20' : ''}`}
                                    >
                                        <td>{hasValidCoordinates ? index + 1 : "?"}</td>
                                        <td>{job.details.jobName}</td>
                                        <td>{job.details.jobType}</td>
                                        <td>{hasValidCoordinates ?
                                            getPlusCode(coords.latitude, coords.longitude) :
                                            "N/A"}</td>
                                        <td>
                                            <button
                                                // TODO: Make this a more menu with options of removing, setting as start
                                                onClick={() => onRemoveJob(job)}
                                                className="btn btn-ghost btn-sm">
                                                <EllipsisVertical size={18}/>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}