'use client';

import React, {ChangeEvent, useState} from 'react';
import CustomerInfoForm from './CustomerInfoForm';
import JobTypeSelector from './JobTypeSelector';
import PdfPopulateButton from '@/app/new/PdfPopulateButton';
import {handleGenerateJob} from "@/app/new/GenerateJob";
import {FacilityOwnerInfo, RepresentativeInfo} from "@/components/types/customer";
import PdfUploadBox from "@/components/pdf-upload-box";
import {BackflowList} from "@/components/types/job";
import BackflowBox from "@/app/new/BackflowBox";
import {extractBackflowInfo} from "@/components/util/pdfExtractor";


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
    const [backflowList, setBackflowList] = useState<BackflowList>({})
    const [jobName, setJobName] = useState<string>('');
    const [jobType, setJobType] = useState<string>('New Test');
    const [waterPurveyor, setWaterPurveyor] = useState<string>('');

    const handleInfoChange = <T extends object>(
        setter: React.Dispatch<React.SetStateAction<T>>
    ) => (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        const processedValue = value.toUpperCase().replace(/\s+/g, ' ').trimEnd();
        setter((prev) => ({...prev, [name]: processedValue}));
    };

    const handlePdfConvert = async (pdf: File) => {
        console.log('Converting PDF: ', pdf.name);
        const newBackflowList = await extractBackflowInfo(pdf, jobType);
        setBackflowList(prev => ({...prev, ...newBackflowList}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newBackflowList = await extractBackflowInfo(pdfs, jobType);
        const mergedBackflowList = {...backflowList, ...newBackflowList};


        await handleGenerateJob(
            jobName,
            jobType,
            waterPurveyor,
            facilityOwnerInfo,
            representativeInfo,
            mergedBackflowList,
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
                                    setWaterPurveyor={setWaterPurveyor}
                                />
                            </div>
                        </div>

                        <form id="jobForm" onSubmit={handleSubmit} className="space-y-4">
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

                            <div className="form-control w-full mb-2">
                                <label className="label">
                                    <span className="text-xl font-semibold">Water Purveyor</span>
                                </label>
                                <input
                                    type="text"
                                    name="waterPurveyor"
                                    value={waterPurveyor}
                                    onChange={(e) => setWaterPurveyor(e.target.value.toUpperCase().replace(/\s+/g, ' ').trimEnd())}
                                    className="input input-bordered"
                                    placeholder="Enter Water Purveyor"
                                    required
                                />
                            </div>

                            <CustomerInfoForm
                                facilityOwnerInfo={facilityOwnerInfo}
                                representativeInfo={representativeInfo}
                                onFacilityOwnerChange={handleInfoChange(setFacilityOwnerInfo)}
                                onRepresentativeChange={handleInfoChange(setRepresentativeInfo)}
                            />

                        </form>

                        <PdfUploadBox pdfs={pdfs} onUpdateFiles={setPdfs} onConvert={handlePdfConvert}/>

                        <BackflowBox
                            backflowList={backflowList}
                            onUpdateBackflows={setBackflowList}/>

                        <div className="text-sm text-base-content opacity-80 mb-2">
                            {`${pdfs.length} PDFs | ${Object.keys(backflowList).length} Backflows`}
                        </div>

                        <div className="card-actions justify-end">
                            <button type="submit" form="jobForm" className="btn btn-primary">
                                Generate ReportFlow Job
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
