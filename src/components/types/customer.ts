export interface FacilityOwnerInfo {
    owner: string;
    address: string;
    email: string;
    contact: string;
    phone: string;
}

export interface RepresentativeInfo {
    owner: string;
    address: string;
    contact: string;
    phone: string;
}

export interface CustomerInformation {
    facilityOwnerInfo: FacilityOwnerInfo;
    representativeInfo: RepresentativeInfo;
}