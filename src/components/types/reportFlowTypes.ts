export interface Metadata {
    jobId: string;
    creationDate: string;
    jobType: string;
}

export interface FacilityOwnerInfo {
    FacilityOwner: string;
    Address: string;
    Email: string;
    Contact: string;
    Phone: string;
}

export interface RepresentativeInfo {
    OwnerRep: string;
    RepAddress: string;
    PersontoContact: string;
    "Phone-0": string;
}

export interface CustomerInformation {
    facilityOwnerInfo: FacilityOwnerInfo;
    representativeInfo: RepresentativeInfo;
}

export interface BackflowItem {
    SerialNo: string;
    MeterNo: string;
}

export interface BackflowList {
    [key: string]: BackflowItem;
}

export interface JobData {
    metadata: Metadata;
    customerInformation: CustomerInformation;
    backflowList: BackflowList;
}
