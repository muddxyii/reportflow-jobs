'use client';

import React, {ChangeEvent, useState} from 'react';
import CustomerInfoForm from './CustomerInfoForm';
import FileUploadBox from './FileUploadBox';
import JobTypeSelector from './JobTypeSelector';
import PdfPopulateButton from '@/app/new/PdfPopulateButton';
import {FacilityOwnerInfo, RepresentativeInfo} from "@/components/types/reportFlowTypes";
import {handleGenerateJob} from "@/app/new/GenerateJob";


export default function NewRFJob() {
    const [facilityOwnerInfo, setFacilityOwnerInfo] = useState<FacilityOwnerInfo>({
        owner: '',
        address: '',
        email: '',
        contact: '',
        phone: ''
    });
    const [representativeInfo, setRepresentativeInfo] = useState<RepresentativeInfo>({
        owner: '',
        address: '',
        contact: '',
        phone: ''
    });

    const [pdfs, setPdfs] = useState<File[]>([]);
    const [jobType, setJobType] = useState<string>('New Test');
    const [jobName, setJobName] = useState<string>('');

    const handleInfoChange = <T extends object>(
        setter: React.Dispatch<React.SetStateAction<T>>
    ) => (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setter((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleGenerateJob(
            jobName,
            jobType,
            facilityOwnerInfo,
            representativeInfo,
            pdfs,
        )
    }

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

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-control w-full mb-2">
                                <label className="label">
                                    <span className="text-xl font-semibold">Job Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="jobName"
                                    value={jobName}
                                    onChange={(e) => setJobName(e.target.value)}
                                    className="input input-bordered"
                                    placeholder="Enter Job Name"
                                    required
                                />
                            </div>

                            <JobTypeSelector selectedJobType={jobType} onChange={setJobType}/>

                            <CustomerInfoForm
                                facilityOwnerInfo={facilityOwnerInfo}
                                representativeInfo={representativeInfo}
                                onFacilityOwnerChange={handleInfoChange(setFacilityOwnerInfo)}
                                onRepresentativeChange={handleInfoChange(setRepresentativeInfo)}
                            />

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
