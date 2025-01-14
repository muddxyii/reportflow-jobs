export interface Metadata {
    jobId: string;
    creationDate: string;
    jobType: string;
}

//region Customer Information

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

//region Backflow Info

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

//region Backflow Test Points? (valves, etc)

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
    backPressure: boolean;
    airInlet: AirInlet;
    check: Check;
}

//endregion

export interface TesterProfile {
    name: string;
    certNo: string;
    gaugeKit: string;
    date: string;
}

export interface Test {
    linePressure: string;
    checkValve1: CheckValve;
    checkValve2: CheckValve;
    reliefValve: ReliefValve;
    vacuumBreaker: VacuumBreaker;
    testerProfile: TesterProfile;
}

export interface CheckValveRepairs {
    cleaned: boolean;
    checkDisc: boolean;
    discHolder: boolean;
    spring: boolean;
    guide: boolean;
    seat: boolean;
    other: boolean;
}

export interface ReliefValveRepairs {
    cleaned: boolean;
    rubberKit: boolean;
    discHolder: boolean;
    spring: boolean;
    guide: boolean;
    seat: boolean;
    other: boolean;
}

export interface VacuumBreakerRepairs {
    cleaned: boolean;
    rubberKit: boolean;
    discHolder: boolean;
    spring: boolean;
    guide: boolean;
    seat: boolean;
    other: boolean;
}

export interface Repairs {
    checkValve1Repairs: CheckValveRepairs;
    checkValve2Repairs: CheckValveRepairs;
    reliefValveRepairs: ReliefValveRepairs;
    vacuumBreakerRepairs: VacuumBreakerRepairs;
    testerProfile: TesterProfile;
}

export interface Backflow {
    locationInfo: LocationInfo;
    installationInfo: InstallationInfo;
    deviceInfo: DeviceInfo;
    initialTest: Test;
    repairs: Repairs;
    finalTest: Test;
}

export interface BackflowList {
    [key: string]: Backflow;
}

export interface JobData {
    metadata: Metadata;
    customerInformation: CustomerInformation;
    backflowList: BackflowList;
}
