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
    },
    textFields(): string[] {
        return ['FacilityOwner', 'Address', 'Email', 'Contact', 'Phone'];
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
    },
    textFields(): string[] {
        return ['OwnerRep', 'RepAddress', 'PersontoContact', 'Phone-0'];
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
    },
    textFields(): string[] {
        return FacilityOwnerInfo.textFields().concat(RepresentativeInfo.textFields());
    }
};