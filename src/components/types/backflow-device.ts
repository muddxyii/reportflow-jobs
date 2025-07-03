interface Coordinates {
    latitude: number;
    longitude: number;
}

export const Coordinates = {
    empty(): Coordinates {
        return {latitude: 0, longitude: 0};
    }
}


export interface LocationInfo {
    assemblyAddress: string;
    onSiteLocation: string;
    primaryService: string;
    coordinates: Coordinates;
}

export const LocationInfo = {
    empty(): LocationInfo {
        return {assemblyAddress: '', onSiteLocation: '', primaryService: '', coordinates: Coordinates.empty()};
    },
    textFields(): string[] {
        return ['AssemblyAddress', 'On Site Location of Assembly', 'PrimaryBusinessService', 'Latitude', 'Longitude'];
    }
}

export interface InstallationInfo {
    status: string;
    protectionType: string;
    serviceType: string;
}

export const InstallationInfo = {
    empty(): InstallationInfo {
        return {status: '', protectionType: '', serviceType: ''};
    },
    dropdownFields(): string[] {
        return ['InstallationIs', 'ProtectionType', 'ServiceType'];
    }
}

export interface AccessInfo {
    comment: string;
}

export const AccessInfo = {
    empty: (): AccessInfo => ({
        comment: ""
    }),
    textFields: (): string[] => {
        return ["IntComment"];
    },
};

export interface DeviceInfo {
    permitNo: string;
    meterNo: string;
    serialNo: string;
    type: string;
    manufacturer: string;
    size: string;
    modelNo: string;
    shutoffValves: {
        status: string;
        comment: string;
    }
    oldComments: string;
    comments: string;
}

export const DeviceInfo = {
    empty(): DeviceInfo {
        return {
            permitNo: '',
            meterNo: '',
            serialNo: '',
            type: '',
            manufacturer: '',
            size: '',
            modelNo: '',
            shutoffValves: {status: '', comment: ''},
            oldComments: '',
            comments: ''
        };
    },
    textFields(): string[] {
        return ['SerialNo', 'WaterMeterNo', 'PermitAccountNo', 'Size', 'ModelNo', 'SOVComment', 'ReportComments'];
    },
    dropdownFields(): string[] {
        return ['BFType', 'Manufacturer', 'SOVList'];
    }
}