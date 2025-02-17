export interface LocationInfo {
    assemblyAddress: string;
    onSiteLocation: string;
    primaryService: string;
}

export interface InstallationInfo {
    status: string;
    protectionType: string;
    serviceType: string;
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