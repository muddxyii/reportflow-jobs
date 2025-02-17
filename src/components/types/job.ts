import {LocationInfo, InstallationInfo, DeviceInfo} from "@/components/types/backflow-device";
import {Test} from "@/components/types/testing";
import {Repairs} from "@/components/types/repairs";
import {JobDetails, Metadata} from "@/components/types/common";
import {CustomerInformation} from "@/components/types/customer";

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
    details: JobDetails;
    customerInformation: CustomerInformation;
    backflowList: BackflowList;
}