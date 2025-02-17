export const FORMAT_VERSION = "1.0.0";

export interface Metadata {
    jobId: string;
    formatVersion: string;
    creationDate: string;
    lastModifiedDate: string;
}

export interface JobDetails {
    jobName: string;
    jobType: string;
    waterPurveyor: string;
}