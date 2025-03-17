import React from 'react';
import {MapContainer, Marker, Polyline, Popup, TileLayer} from 'react-leaflet';
import L, {LatLngBoundsExpression, LatLngExpression, LatLngTuple} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {BackflowList, JobData} from "@/components/types/job";
import OpenLocationCode from "open-location-code-typescript";

interface MapWidgetProps {
    jobList: JobData[];
}

const MapWidget: React.FC<MapWidgetProps> = ({jobList}) => {
    const getPlusCode = (lat: number, lng: number): string => {
        try {
            return OpenLocationCode.encode(lat, lng);
        } catch (err) {
            console.error("Failed to get plus code:", err);
            return "";
        }
    };

    const createNumberedIcon = (number: number) => {
        return L.divIcon({
            className: 'custom-pin',
            html: `<div class="pin-number">${number}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
        });
    };


    const validJobs = jobList.filter(job => {
        const coords = Object.values(job.backflowList)[0]?.locationInfo?.coordinates;
        return coords &&
            coords.latitude !== 0 &&
            coords.longitude !== 0 &&
            !isNaN(coords.latitude) &&
            !isNaN(coords.longitude);
    });

    if (validJobs.length === 0) {
        return <div className="w-full h-[500px] flex items-center justify-center bg-gray-100">
            No valid locations to display
        </div>;
    }

    // Get coordinates of the first valid job
    const firstJobCoords = Object.values(validJobs[0].backflowList)[0]?.locationInfo?.coordinates;
    const initialCenter = [firstJobCoords.latitude, firstJobCoords.longitude] as LatLngTuple;

    // Calculate bounds to fit all markers
    const bounds = validJobs.map(job => {
        const coords = Object.values(job.backflowList)[0]?.locationInfo?.coordinates;
        return [coords.latitude, coords.longitude] as const;
    }) as LatLngBoundsExpression;

    const routePoints = validJobs.map(job => {
        const coords = Object.values(job.backflowList)[0]?.locationInfo?.coordinates;
        return [coords.latitude, coords.longitude] as LatLngExpression;
    });

    function calculateDistance(latitude: number, longitude: number, latitude2: number, longitude2: number) {
        const toRadians = (degrees: number) => degrees * (Math.PI / 180);
        const earthRadius = 3958.8; // Earth radius in miles

        const dLat = toRadians(latitude2 - latitude);
        const dLon = toRadians(longitude2 - longitude);

        const lat1Rad = toRadians(latitude);
        const lat2Rad = toRadians(latitude2);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadius * c;
    }

    return (
        <div className="w-full h-[500px] relative">
            <MapContainer
                center={initialCenter}
                zoom={10}
                style={{height: '100%', width: '100%'}}
                bounds={bounds ?? undefined}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {validJobs.map((job, index) => {
                    const coords = Object.values(job.backflowList)[0]?.locationInfo?.coordinates;
                    return (
                        <Marker
                            key={job.metadata.jobId}
                            position={[coords.latitude, coords.longitude]}
                            icon={createNumberedIcon(index + 1)}
                        >
                            <Popup offset={[0, -20]}>
                                <div className="min-w-[200px]">
                                    <h3 className="font-bold">Job #{index + 1}</h3>
                                    <p>{job.details.jobName + " - " + job.details.jobType}</p>
                                    <p>{"Total Backflows: " + BackflowList.count(job.backflowList)}</p>
                                    <p>{getPlusCode(coords.latitude, coords.longitude)}</p>
                                    {index < validJobs.length - 1 && (
                                        <p className="text-sm text-gray-600 mt-2 border-t pt-2">
                                            Distance to next: {
                                            calculateDistance(
                                                coords.latitude,
                                                coords.longitude,
                                                Object.values(validJobs[index + 1].backflowList)[0]?.locationInfo?.coordinates.latitude,
                                                Object.values(validJobs[index + 1].backflowList)[0]?.locationInfo?.coordinates.longitude
                                            ).toFixed(1)
                                        } miles
                                        </p>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}


                <Polyline
                    positions={routePoints}
                    pathOptions={{
                        color: '#1a73e8',
                        weight: 4,
                        dashArray: '5, 10',
                        opacity: 0.8
                    }}
                />

            </MapContainer>
        </div>
    );
};

export default MapWidget;