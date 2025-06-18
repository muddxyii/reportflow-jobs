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

        // Helper function to process text fields
        const processText = (text: string) => text.toUpperCase().replace(/\s+/g, ' ').trim();

        // Facility Owner Info
        customerInfo.facilityOwnerInfo.owner = processText(fields.text.FacilityOwner || '');
        customerInfo.facilityOwnerInfo.address = processText(fields.text.Address || '');
        customerInfo.facilityOwnerInfo.email = processText(fields.text.Email || '');
        customerInfo.facilityOwnerInfo.contact = processText(fields.text.Contact || '');
        customerInfo.facilityOwnerInfo.phone = processText(fields.text.Phone || '');

        // Representative Info
        customerInfo.representativeInfo.owner = processText(fields.text.OwnerRep || '');
        customerInfo.representativeInfo.address = processText(fields.text.RepAddress || '');
        customerInfo.representativeInfo.contact = processText(fields.text.PersontoContact || '');
        customerInfo.representativeInfo.phone = processText(fields.text['Phone-0'] || '');
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
        waterPurveyor = (fields.dropdown.WaterPurveyor || '').toUpperCase().replace(/\s+/g, ' ').trim();
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

            // Helper function to process text fields
            const processText = (text: string) => text.toUpperCase().replace(/\s+/g, ' ').trim();

            const serialNo = processText(fields.text.SerialNo || 'Unknown');
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
}): AccessInfo => {
    const processText = (text: string) => text.toUpperCase().replace(/\s+/g, ' ').trim();

    return {
        comment: processText(fields.text['IntComment'] || ''),
    };
};

const extractLocationInfoFromFields = (fields: {
    text: Record<string, string>;
    dropdown: Record<string, string>;
    checkbox: Record<string, boolean>;
}): LocationInfo => {
    const processText = (text: string) => text.toUpperCase().replace(/\s+/g, ' ').trim();

    return {
        assemblyAddress: processText(fields.text['AssemblyAddress'] || ''),
        onSiteLocation: processText(fields.text['On Site Location of Assembly'] || ''),
        primaryService: processText(fields.text['PrimaryBusinessService'] || ''),
        coordinates: {
            latitude: fields.text['Latitude'] ? parseFloat(fields.text['Latitude']) : 0,
            longitude: fields.text['Longitude'] ? parseFloat(fields.text['Longitude']) : 0,
        },
    };
};

const extractInstallationInfoFromFields = (fields: {
    text: Record<string, string>;
    dropdown: Record<string, string>;
    checkbox: Record<string, boolean>;
}): InstallationInfo => {
    const processText = (text: string) => text.toUpperCase().replace(/\s+/g, ' ').trim();

    return {
        status: fields.dropdown['InstallationIs'] === 'REPLACEMENT' ?
            'EXISTING' : processText(fields.dropdown['InstallationIs'] || ''),
        protectionType: processText(fields.dropdown['ProtectionType'] || ''),
        serviceType: processText(fields.dropdown['ServiceType'] || '')
    };
};

const extractDeviceInfoFromFields = (fields: {
                                         text: Record<string, string>;
                                         dropdown: Record<string, string>;
                                         checkbox: Record<string, boolean>;
                                     }, keepComments: boolean
): DeviceInfo => {
    const processText = (text: string) => text.toUpperCase().replace(/\s+/g, ' ').trim();

    return {
        permitNo: processText(fields.text['PermitAccountNo'] || ''),
        meterNo: processText(fields.text['WaterMeterNo'] || ''),
        serialNo: processText(fields.text['SerialNo'] || ''),
        type: processText(fields.dropdown['BFType'] || ''),
        manufacturer: processText(fields.dropdown['Manufacturer'] || ''),
        size: processText(fields.text['Size'] || ''),
        modelNo: processText(fields.text['ModelNo'] || ''),
        shutoffValves: {
            status: processText(fields.dropdown['SOVList'] || ''),
            comment: processText(fields.text['SOVComment'] || ''),
        },
        oldComments: keepComments ? processText(fields.text['ReportComments'] || '') : '',
        comments: '',
    };
};

const extractInitialTestFromFields = (fields: {
    text: Record<string, string>;
    dropdown: Record<string, string>;
    checkbox: Record<string, boolean>;
}): Test => {
    const processText = (text: string) => text.toUpperCase().replace(/\s+/g, ' ').trim();

    return {
        linePressure: processText(fields.text['LinePressure'] || ''),
        checkValve1: {
            value: processText(fields.text['InitialCT1'] || ''),
            closedTight: Boolean(fields.checkbox['InitialCTBox']),
        },
        checkValve2: {
            value: processText(fields.text['InitialCT2'] || ''),
            closedTight: Boolean(fields.checkbox['InitialCT2Box']),
        },
        reliefValve: {
            value: processText(fields.text['InitialPSIRV'] || ''),
            opened: !Boolean(fields.checkbox['InitialRVDidNotOpen']),
            leaking: Boolean(false),
        },
        vacuumBreaker: {
            backPressure: Boolean(fields.dropdown['BackPressure'] === 'YES'),
            airInlet: {
                value: processText(fields.text['InitialAirInlet'] || ''),
                leaked: Boolean(fields.checkbox['InitialAirInletLeaked']),
                opened: Boolean(fields.checkbox['InitialCkPVBLDidNotOpen']),
            },
            check: {
                value: processText(fields.text['InitialCk1PVB'] || ''),
                leaked: Boolean(fields.checkbox['InitialCkPVBLeaked']),
            },
        },
        testerProfile: {
            name: processText(fields.dropdown['InitialTester'] || ''),
            certNo: processText(fields.dropdown['InitialTesterNo'] || ''),
            gaugeKit: processText(fields.dropdown['InitialTestKitSerial'] || ''),
            date: fields.text['DateFailed'] || '',
        }
    };
};