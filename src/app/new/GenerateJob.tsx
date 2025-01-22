import {v4 as uuid} from 'uuid';
import {extractBackflowInfo} from "@/components/util/pdfExtractor";
import {FacilityOwnerInfo, FORMAT_VERSION, JobData, RepresentativeInfo} from "@/components/types/reportFlowTypes";

export const handleGenerateJob = async (
    jobName: string,
    jobType: string,
    facilityOwnerInfo: FacilityOwnerInfo,
    representativeInfo: RepresentativeInfo,
    pdfs: File[]
) => {
    const jobData: JobData = {
        metadata: {
            jobId: uuid(),
            formatVersion: FORMAT_VERSION,
            creationDate: new Date().toISOString(),
            jobName,
            jobType,
        },
        customerInformation: {
            facilityOwnerInfo,
            representativeInfo,
        },
        backflowList: pdfs?.length ? await extractBackflowInfo(pdfs, jobType) : {},
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
