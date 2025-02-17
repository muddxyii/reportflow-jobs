import {CustomerInformation} from "@/components/types/customer";
import {DeviceInfo, InstallationInfo, LocationInfo} from "@/components/types/backflow-device";
import {Test} from "@/components/types/testing";
import {Repairs} from "@/components/types/repairs";
import {PDFFieldExtractor} from "@/components/util/pdfFieldExtractor";
import {Backflow} from "@/components/types/job";

export const extractCustomerInfo = async (pdf: File) => {
    const customerInfo = CustomerInformation.empty();

    try {
        const extractor = new PDFFieldExtractor();
        const fields = await extractor.extractFields(pdf, {
            text: CustomerInformation.textFields(),
        });

        // Facility Owner Info
        customerInfo.facilityOwnerInfo.owner = fields.text.FacilityOwner || '';
        customerInfo.facilityOwnerInfo.address = fields.text.Address || '';
        customerInfo.facilityOwnerInfo.email = fields.text.Email || '';
        customerInfo.facilityOwnerInfo.contact = fields.text.Contact || '';
        customerInfo.facilityOwnerInfo.phone = fields.text.Phone || '';

        // Representative Info
        customerInfo.representativeInfo.owner = fields.text.OwnerRep || '';
        customerInfo.representativeInfo.address = fields.text.RepAddress || '';
        customerInfo.representativeInfo.contact = fields.text.PersontoContact || '';
        customerInfo.representativeInfo.phone = fields.text['Phone-0'] || '';
    } catch (error: unknown) {
        console.error(`Error processing ${pdf.name}:`, error);
    }

    return customerInfo;
}

export const extractWaterPurveyor = async (pdf: File) => {
    let waterPurveyor = '';

    try {
        const extractor = new PDFFieldExtractor();
        const fields = await extractor.extractFields(pdf, {
            dropdown: ['WaterPurveyor'],
        });
        waterPurveyor = fields.dropdown.WaterPurveyor || '';
    } catch (error: unknown) {
        console.error(`Error processing ${pdf.name}:`, error);
    }

    return waterPurveyor;
};

export const extractBackflowInfo = async (pdfs: File[], jobType: string) => {
    const backflowList: Record<string, {
        locationInfo: LocationInfo;
        installationInfo: InstallationInfo;
        deviceInfo: DeviceInfo;
        initialTest: Test;
        repairs: Repairs;
        finalTest: Test;
    }> = {};

    for (const pdf of pdfs) {
        try {
            const extractor = new PDFFieldExtractor();
            const fields = await extractor.extractFields(pdf, {
                text: Backflow.textFields(),
                dropdown: Backflow.dropdownFields(),
            });

            const serialNo = fields.text.SerialNo || 'Unknown';
            backflowList[serialNo] = {
                locationInfo: extractLocationInfoFromFields(fields),
                installationInfo: extractInstallationInfoFromFields(fields),
                deviceInfo: extractDeviceInfoFromFields(fields),
                initialTest: jobType === 'Repair' ? extractInitialTestFromFields(fields) : Test.empty(),
                repairs: Repairs.empty(),
                finalTest: Test.empty(),
            }
        } catch (error: unknown) {
            console.error(`Error processing ${pdf.name}:`, error);
        }
    }

    return backflowList;
};

const extractLocationInfoFromFields = (fields: {
    text: Record<string, string>;
    dropdown: Record<string, string>;
    checkbox: Record<string, boolean>;
}): LocationInfo => ({
    assemblyAddress: fields.text['AssemblyAddress'] || '',
    onSiteLocation: fields.text['On Site Location of Assembly'] || '',
    primaryService: fields.text['PrimaryBusinessService'] || ''
});

const extractInstallationInfoFromFields = (fields: {
    text: Record<string, string>;
    dropdown: Record<string, string>;
    checkbox: Record<string, boolean>;
}): InstallationInfo => ({
    status: fields.dropdown['InstallationIs'] || '',
    protectionType: fields.dropdown['ProtectionType'] || '',
    serviceType: fields.dropdown['ServiceType'] || ''
});

const extractDeviceInfoFromFields = (fields: {
    text: Record<string, string>;
    dropdown: Record<string, string>;
    checkbox: Record<string, boolean>;
}): DeviceInfo => ({
    permitNo: fields.text['PermitAccountNo'] || '',
    meterNo: fields.text['WaterMeterNo'] || '',
    serialNo: fields.text['SerialNo'] || '',
    type: fields.dropdown['BFType'] || '',
    manufacturer: fields.dropdown['Manufacturer'] || '',
    size: fields.text['Size'] || '',
    modelNo: fields.text['ModelNo'] || '',
    shutoffValves: {
        status: fields.dropdown['SOVList'] || '',
        comment: fields.text['SOVComment'] || '',
    },
    oldComments: fields.text['ReportComments'] || '',
    comments: '',
});

const extractInitialTestFromFields = (fields: {
    text: Record<string, string>;
    dropdown: Record<string, string>;
    checkbox: Record<string, boolean>;
}): Test => ({
    linePressure: fields.text['LinePressure'] || '',
    checkValve1: {
        value: fields.text['InitialCT1'] || '',
        closedTight: fields.checkbox['InitialCTBox'],
    },
    checkValve2: {
        value: fields.text['InitialCT2'] || '',
        closedTight: fields.checkbox['InitialCT2Box'],
    },
    reliefValve: {
        value: fields.text['InitialPSIRV'] || '',
        opened: !fields.checkbox['InitialRVDidNotOpen'],
    },
    vacuumBreaker: {
        backPressure: fields.dropdown['BackPressure'] === 'YES',
        airInlet: {
            value: fields.text['InitialAirInlet'] || '',
            leaked: fields.checkbox['InitialAirInletLeaked'],
            opened: fields.checkbox['InitialCkPVBLDidNotOpen'],
        },
        check: {
            value: fields.text['InitialCk1PVB'] || '',
            leaked: fields.checkbox['InitialCkPVBLeaked'],
        },
    },
    testerProfile: {
        name: fields.dropdown['InitialTester'] || '',
        certNo: fields.dropdown['InitialTesterNo'] || '',
        gaugeKit: fields.dropdown['InitialTestKitSerial'] || '',
        date: fields.text['DateFailed'] || '',
    }
});