export interface LocationInfo {
    assemblyAddress: string;
    onSiteLocation: string;
    primaryService: string;
}

export const LocationInfo = {
    empty(): LocationInfo {
        return {assemblyAddress: '', onSiteLocation: '', primaryService: ''};
    },
    textFields(): string[] {
        return ['AssemblyAddress', 'On Site Location of Assembly', 'PrimaryBusinessService'];
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
        return ['SerialNo', 'WaterMeterNo', 'Size', 'ModelNo', 'SOVComment', 'ReportComments'];
    },
    dropdownFields(): string[] {
        return ['BFType', 'Manufacturer', 'SOVList'];
    }
}