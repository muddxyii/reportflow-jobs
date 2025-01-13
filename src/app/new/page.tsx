'use client'

import React, {ChangeEvent, FormEvent, useState} from 'react';
import {v4 as uuid} from 'uuid';
import CustomerInfoForm, {facilityOwnerFields, representativeFields} from './CustomerInfoForm';
import FileUploadBox from './FileUploadBox';
import CollapsibleSection from '@/components/collapsible-section';
import JobTypeSelector from './JobTypeSelector';
import PdfPopulateButton from './PdfPopulateButton';

export default function NewRFJob() {
    const [facilityOwnerInfo, setFacilityOwnerInfo] = useState<Record<string, string>>({});
    const [representativeInfo, setRepresentativeInfo] = useState<Record<string, string>>({});
    const [pdfs, setPdfs] = useState<File[]>([]);
    const [jobType, setJobType] = useState<string>('New Test');

    const handleInfoChange = (setter: React.Dispatch<React.SetStateAction<Record<string, string>>>) =>
        (e: ChangeEvent<HTMLInputElement>) => {
            const {name, value} = e.target;
            setter(prev => ({...prev, [name]: value}));
        };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Construct the job data object
        const jobData = {
            metadata: {
                jobId: uuid(),
                creationDate: new Date().toISOString(),
                jobType
            },
            customerInformation: {
                facilityOwnerInfo,
                representativeInfo
            },
            pdfs: pdfs.map(file => file.name)
        };

        // Convert the data to JSON
        const jsonData = JSON.stringify(jobData, null, 2);

        // Create a blob and download the JSON file
        const blob = new Blob([jsonData], {type: 'application/json'});
        const url = URL.createObjectURL(blob);

        try {
            const link = document.createElement('a');
            link.href = url;
            link.download = `${jobData.metadata.jobId}.rfjson`;
            link.click();
        } finally {
            URL.revokeObjectURL(url);
        }
    };

    return (
        <main className="min-h-screen bg-base-300 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="flex justify-between items-center">
                            <div className="flex justify-between items-center mb-6 w-full">
                                <h1 className="card-title text-2xl font-bold text-left">Create New RF Job</h1>
                                <PdfPopulateButton
                                    setFacilityOwnerInfo={setFacilityOwnerInfo}
                                    setRepresentativeInfo={setRepresentativeInfo}
                                />
                            </div>
                        </div>

                        <JobTypeSelector selectedJobType={jobType} onChange={setJobType}/>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <CollapsibleSection title="Facility Owner Details">
                                <CustomerInfoForm
                                    fields={facilityOwnerFields}
                                    customerInfo={facilityOwnerInfo}
                                    onChange={handleInfoChange(setFacilityOwnerInfo)}
                                />
                            </CollapsibleSection>

                            <CollapsibleSection title="Representative Owner Details">
                                <CustomerInfoForm
                                    fields={representativeFields}
                                    customerInfo={representativeInfo}
                                    onChange={handleInfoChange(setRepresentativeInfo)}
                                />
                            </CollapsibleSection>

                            <FileUploadBox pdfs={pdfs} onUpdateFiles={setPdfs}/>

                            <div className="card-actions justify-end">
                                <button type="submit" className="btn btn-primary">
                                    Generate ReportFlow Job
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
