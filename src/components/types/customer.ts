export interface FacilityOwnerInfo {
    owner: string;
    address: string;
    email: string;
    contact: string;
    phone: string;
}

export const FacilityOwnerInfo = {
    empty(): FacilityOwnerInfo {
        return {owner: "", address: "", email: "", contact: "", phone: ""};
    }
};

export interface RepresentativeInfo {
    owner: string;
    address: string;
    contact: string;
    phone: string;
}

export const RepresentativeInfo = {
    empty(): RepresentativeInfo {
        return {owner: "", address: "", contact: "", phone: ""};
    }
};

export interface CustomerInformation {
    facilityOwnerInfo: FacilityOwnerInfo;
    representativeInfo: RepresentativeInfo;
}

export const CustomerInformation = {
    empty(): CustomerInformation {
        return {
            facilityOwnerInfo: FacilityOwnerInfo.empty(),
            representativeInfo: RepresentativeInfo.empty()
        };
    }
};