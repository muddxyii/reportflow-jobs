import {AccessInfo, DeviceInfo, InstallationInfo, LocationInfo} from "@/components/types/backflow-device";
import {Test} from "@/components/types/testing";
import {Repairs} from "@/components/types/repairs";
import {JobDetails, Metadata} from "@/components/types/common";
import {CustomerInformation} from "@/components/types/customer";

export interface Backflow {
    deviceInfo: DeviceInfo;
    accessInfo: AccessInfo;
    locationInfo: LocationInfo;
    installationInfo: InstallationInfo;
    initialTest: Test;
    repairs: Repairs;
    finalTest: Test;
}

export const Backflow = {
    empty: (): Backflow => ({
        deviceInfo: DeviceInfo.empty(),
        accessInfo: AccessInfo.empty(),
        locationInfo: LocationInfo.empty(),
        installationInfo: InstallationInfo.empty(),
        initialTest: Test.empty(),
        repairs: Repairs.empty(),
        finalTest: Test.empty(),
    }),
    textFields: (): string[] => {
        return LocationInfo.textFields()
            .concat(AccessInfo.textFields())
            .concat(DeviceInfo.textFields())
            .concat(Test.initialTextFields());
    },
    dropdownFields: (): string[] => {
        return InstallationInfo.dropdownFields()
            .concat(DeviceInfo.dropdownFields())
            .concat(Test.initialDropdownFields());
    },
    checkboxFields: (): string[] => {
        return Test.initialCheckboxFields();
    },
}

export interface BackflowList {
    [key: string]: Backflow;
}

export const BackflowList = {
    count: (list: BackflowList) => Object.keys(list).filter(key => key !== "count").length,
};

export interface JobData {
    metadata: Metadata;
    details: JobDetails;
    customerInformation: CustomerInformation;
    backflowList: BackflowList;
}