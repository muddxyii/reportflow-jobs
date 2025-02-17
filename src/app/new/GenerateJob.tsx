import {v4 as uuid} from 'uuid';
import {extractBackflowInfo} from "@/components/util/pdfExtractor";
import {FacilityOwnerInfo, RepresentativeInfo} from "@/components/types/customer";
import {JobData} from "@/components/types/job";
import {FORMAT_VERSION} from "@/components/types/common";

export const handleGenerateJob = async (
    jobName: string,
    jobType: string,
    waterPurveyor: string,
    facilityOwnerInfo: FacilityOwnerInfo,
    representativeInfo: RepresentativeInfo,
    pdfs: File[]
) => {
    const jobData: JobData = {
        metadata: {
            jobId: uuid(),
            formatVersion: FORMAT_VERSION,
            creationDate: new Date().toISOString(),
            lastModifiedDate: new Date().toISOString(),
        },
        details: {
            jobName,
            jobType,
            waterPurveyor,
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
        const formattedJobName = formatJobName(jobData.details.jobName);
        link.download = `${formattedJobName}.rfjson`;
        link.click();
    } finally {
        URL.revokeObjectURL(url);
    }
};

const formatJobName = (jobName: string) => {
    const formattedName = jobName.trim().split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
    const currentDate = new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    }).replace(/\//g, '-');
    return `${formattedName}_${currentDate}`;
};
