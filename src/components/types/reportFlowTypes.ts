export interface Metadata {
    jobId: string;
    creationDate: string;
    jobType: string;
}

//region CustomerInformation

export interface JobDetails {
    permitNo: string;
    waterPurveyor: string;
}

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

//endregion

//region BackflowInfo

export interface LocationInfo {
    assemblyAddress: string;
    onSiteLocation: string;
    primaryService: string;
}

export interface InstallationInfo {
    installationStatus: string;
    protectionType: string;
    serviceType: string;
}

export interface DeviceInfo {
    meterNo: string;
    serialNo: string;
    type: string;
    manufacturer: string;
    size: string;
    modelNo: string;
}

//endregion


export interface CheckValve {
    value: string;
    closedTight: boolean;
}

export interface ReliefValve {
    value: string;
    opened: boolean;
}

export interface AirInlet {
    value: string;
    leaked: boolean;
    opened: boolean;
}

export interface Check {
    value: string;
    leaked: boolean;
}

export interface VacuumBreaker {
    airInlet: AirInlet;
    check: Check;
}

export interface InitialTest {
    checkValve1: CheckValve;
    checkValve2: CheckValve;
    reliefValve: ReliefValve;
    vacuumBreaker: VacuumBreaker;
}

export interface FinalTest {
    checkValve1: CheckValve;
    checkValve2: CheckValve;
    reliefValve: ReliefValve;
    vacuumBreaker: VacuumBreaker;
}

export interface Backflow {
    locationInfo: LocationInfo;
    installationInfo: InstallationInfo;
    deviceInfo: DeviceInfo;
    initialTest: InitialTest;
    finalTest: FinalTest;
}

export interface BackflowList {
    [key: string]: Backflow;
}

export interface JobData {
    metadata: Metadata;
    customerInformation: CustomerInformation;
    backflowList: BackflowList;
}
