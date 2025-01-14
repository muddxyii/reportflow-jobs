import React from 'react';
import {v4 as uuid} from 'uuid';
import {extractBackflowInfo} from "@/components/util/pdfExtractor";
import {FacilityOwnerInfo, JobData, RepresentativeInfo} from "@/components/types/reportFlowTypes";

interface GenerateJobButtonProps {
    jobType: string;
    facilityOwnerInfo: FacilityOwnerInfo;
    representativeInfo: RepresentativeInfo;
    pdfs: File[];
}

const GenerateJobButton: React.FC<GenerateJobButtonProps> = ({
                                                                 jobType,
                                                                 facilityOwnerInfo,
                                                                 representativeInfo,
                                                                 pdfs,
                                                             }) => {
    const handleGenerateJob = async () => {
        const jobData: JobData = {
            metadata: {
                jobId: uuid(),
                creationDate: new Date().toISOString(),
                jobType,
            },
            customerInformation: {
                facilityOwnerInfo,
                representativeInfo,
            },
            backflowList: pdfs?.length ? await extractBackflowInfo(pdfs) : {},
        };

        const jsonData = JSON.stringify(jobData, null, 2);
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
        <button type="button" className="btn btn-primary" onClick={handleGenerateJob}>
            Generate ReportFlow Job
        </button>
    );
};

export default GenerateJobButton;
