import {CustomerInformation} from "@/components/types/customer";
import {AccessInfo, DeviceInfo, InstallationInfo, LocationInfo} from "@/components/types/backflow-device";
import {Test} from "@/components/types/testing";
import {Repairs} from "@/components/types/repairs";
import {PDFFieldExtractor} from "@/components/util/pdfFieldExtractor";
import {Backflow} from "@/components/types/job";

function isValidDate(dateString: string): boolean {
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!regex.test(dateString)) return false;

    const [month, day, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    return date.getMonth() === month - 1 &&
        date.getDate() === day &&
        date.getFullYear() === year;
}

function getValidDate(fields: { text: Record<string, string> }): string {
    const possibleDates = [
        fields.text.DateFailed,
        fields.text.DateRepaired,
        fields.text.DatePassed
    ];

    for (const date of possibleDates) {
        if (date && isValidDate(date)) {
            return date;
        }
    }

    return '';
}

function isWithinLastYear(dateString: string): boolean {
    const date = new Date(dateString);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return date > oneYearAgo;
}


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

export const extractBackflowInfo = async (pdfs: File | File[], jobType: string) => {
    const backflowList: Record<string, {
        accessInfo: AccessInfo;
        locationInfo: LocationInfo;
        installationInfo: InstallationInfo;
        deviceInfo: DeviceInfo;
        initialTest: Test;
        repairs: Repairs;
        finalTest: Test;
    }> = {};

    const pdfArray = Array.isArray(pdfs) ? pdfs : [pdfs];

    for (const pdf of pdfArray) {
        try {
            const extractor = new PDFFieldExtractor();
            const fields = await extractor.extractFields(pdf, {
                text: Backflow.textFields(),
                dropdown: Backflow.dropdownFields(),
                checkbox: Backflow.checkboxFields(),
            });

            const serialNo = fields.text.SerialNo || 'Unknown';
            const keepComments = (() => {
                const validDate = getValidDate(fields);
                if (!validDate) return false;

                return isWithinLastYear(validDate);
            })();


            backflowList[serialNo] = {
                accessInfo: extractAccessInfoFromFields(fields),
                locationInfo: extractLocationInfoFromFields(fields),
                installationInfo: extractInstallationInfoFromFields(fields),
                deviceInfo: extractDeviceInfoFromFields(fields, keepComments),
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

const extractAccessInfoFromFields = (fields: {
    text: Record<string, string>;
}): AccessInfo => ({
    comment: fields.text['AccessComments'] || '', // TODO: UPDATE TO PDF FIELD NAME
});

const extractLocationInfoFromFields = (fields: {
    text: Record<string, string>;
    dropdown: Record<string, string>;
    checkbox: Record<string, boolean>;
}): LocationInfo => ({
    assemblyAddress: fields.text['AssemblyAddress'] || '',
    onSiteLocation: fields.text['On Site Location of Assembly'] || '',
    primaryService: fields.text['PrimaryBusinessService'] || '',
    coordinates: {
        latitude: fields.text['Latitude'] ? parseFloat(fields.text['Latitude']) : 0,
        longitude: fields.text['Longitude'] ? parseFloat(fields.text['Longitude']) : 0,
    },
});

const extractInstallationInfoFromFields = (fields: {
    text: Record<string, string>;
    dropdown: Record<string, string>;
    checkbox: Record<string, boolean>;
}): InstallationInfo => ({
    status: fields.dropdown['InstallationIs'] === 'REPLACEMENT' ?
        'EXISTING' : (fields.dropdown['InstallationIs'] || ''),
    protectionType: fields.dropdown['ProtectionType'] || '',
    serviceType: fields.dropdown['ServiceType'] || ''
});

const extractDeviceInfoFromFields = (fields: {
                                         text: Record<string, string>;
                                         dropdown: Record<string, string>;
                                         checkbox: Record<string, boolean>;
                                     }, keepComments: boolean
): DeviceInfo => ({
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
    oldComments: keepComments ? fields.text['ReportComments'] : '',
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
        closedTight: Boolean(fields.checkbox['InitialCTBox']),
    },
    checkValve2: {
        value: fields.text['InitialCT2'] || '',
        closedTight: Boolean(fields.checkbox['InitialCT2Box']),
    },
    reliefValve: {
        value: fields.text['InitialPSIRV'] || '',
        opened: !Boolean(fields.checkbox['InitialRVDidNotOpen']),
        leaking: Boolean(false),
    },
    vacuumBreaker: {
        backPressure: Boolean(fields.dropdown['BackPressure'] === 'YES'),
        airInlet: {
            value: fields.text['InitialAirInlet'] || '',
            leaked: Boolean(fields.checkbox['InitialAirInletLeaked']),
            opened: Boolean(fields.checkbox['InitialCkPVBLDidNotOpen']),
        },
        check: {
            value: fields.text['InitialCk1PVB'] || '',
            leaked: Boolean(fields.checkbox['InitialCkPVBLeaked']),
        },
    },
    testerProfile: {
        name: fields.dropdown['InitialTester'] || '',
        certNo: fields.dropdown['InitialTesterNo'] || '',
        gaugeKit: fields.dropdown['InitialTestKitSerial'] || '',
        date: fields.text['DateFailed'] || '',
    }
});