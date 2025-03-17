'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import {JobData} from "@/components/types/job";

interface MapWidgetProps {
    jobList: JobData[];
}

const MapComponent = dynamic<MapWidgetProps>(
    () => import('./MapComponentNoSSR'),
    {ssr: false}
);

const MapWidget: React.FC<MapWidgetProps> = ({jobList}) => {
    return <MapComponent jobList={jobList}/>;
};

export default MapWidget;