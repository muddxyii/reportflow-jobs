'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react';
import CustomerInfoForm, { facilityOwnerFields, representativeFields } from './CustomerInfoForm';
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
            const { name, value } = e.target;
            setter(prev => ({ ...prev, [name]: value }));
        };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log({ facilityOwnerInfo, representativeInfo, pdfs, jobType });
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

                        <form onSubmit={handleSubmit} className="space-y-6">
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

                            <FileUploadBox pdfs={pdfs} onUpdateFiles={setPdfs} />

                            <JobTypeSelector selectedJobType={jobType} onChange={setJobType} />

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
