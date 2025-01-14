import {PDFDocument} from 'pdf-lib';
import {
    DeviceInfo,
    FacilityOwnerInfo,
    InitialTest,
    InstallationInfo,
    LocationInfo,
    RepresentativeInfo
} from "@/components/types/reportFlowTypes";

//region Field Extractor Helpers

const extractTextFields = async (pdf: File, fieldNames: string[]) => {
    const arrayBuffer = await pdf.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const form = pdfDoc.getForm();

    const fieldValues: Record<string, string> = {};

    fieldNames.forEach((fieldName) => {
        const field = form.getTextField(fieldName);
        fieldValues[fieldName] = field?.getText() || `Unknown ${fieldName}`;
    });

    return fieldValues;
};

const extractDropdownFields = async (pdf: File, fieldNames: string[]) => {
    const arrayBuffer = await pdf.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const form = pdfDoc.getForm();

    const fieldValues: Record<string, string> = {};

    fieldNames.forEach((fieldName) => {
        const field = form.getDropdown(fieldName);
        fieldValues[fieldName] = field?.getSelected()?.[0] || `Unknown ${fieldName}`;
    });

    return fieldValues;
};

const stringToBoolean = (str: string): boolean => str.toLowerCase() === 'true';

const extractCheckboxFields = async (pdf: File, fieldNames: string[]) => {
    const arrayBuffer = await pdf.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const form = pdfDoc.getForm();

    const fieldValues: Record<string, string> = {};

    fieldNames.forEach((fieldName) => {
        const field = form.getCheckBox(fieldName);
        fieldValues[fieldName] = field?.isChecked() ? "true" : "false";
    });

    return fieldValues;
};

//endregion

export const extractFacilityOwnerInfo = async (pdf: File) => {
    const facilityOwnerInfo: FacilityOwnerInfo = {
        owner: '',
        address: '',
        email: '',
        contact: '',
        phone: ''
    };

    try {
        const fieldNames = ['FacilityOwner', 'Address', 'Email', 'Contact', 'Phone'];
        const fields = await extractTextFields(pdf, fieldNames);
        facilityOwnerInfo.owner = fields['FacilityOwner'] || '';
        facilityOwnerInfo.address = fields['Address'] || '';
        facilityOwnerInfo.email = fields['Email'] || '';
        facilityOwnerInfo.contact = fields['Contact'] || '';
        facilityOwnerInfo.phone = fields['Phone'] || '';
    } catch (error: unknown) {
        console.error(`Error processing ${pdf.name}:`, error);
    }

    return facilityOwnerInfo;
};

export const extractRepresentativeInfo = async (pdf: File) => {
    const representativeInfo: RepresentativeInfo = {
        owner: '',
        address: '',
        contact: '',
        phone: '',
    }

    try {
        const fieldNames = ['OwnerRep', 'RepAddress', 'PersontoContact', 'Phone-0'];
        const fields = await extractTextFields(pdf, fieldNames);
        representativeInfo.owner = fields['OwnerRep'] || '';
        representativeInfo.address = fields['RepAddress'] || '';
        representativeInfo.contact = fields['PersontoContact'] || '';
        representativeInfo.phone = fields['Phone-0'] || '';
    } catch (error: unknown) {
        console.error(`Error processing ${pdf.name}:`, error);
    }

    return representativeInfo;
};

export const extractBackflowInfo = async (pdfs: File[]) => {
    const backflowList: Record<string, {
        locationInfo: LocationInfo;
        installationInfo: InstallationInfo;
        deviceInfo: DeviceInfo;
    }> = {};

    for (const pdf of pdfs) {
        try {
            const textFieldNames = [
                'SerialNo', 'WaterMeterNo', 'Size', 'ModelNo',
                'AssemblyAddress', 'On Site Location of Assembly', 'PrimaryBusinessService'
            ];
            const dropdownFieldNames = [
                'BFType', 'Manufacturer', 'ServiceType', 'ProtectionType',
                'InstallationIs',
            ]

            const fields = {
                ...await extractTextFields(pdf, textFieldNames),
                ...await extractDropdownFields(pdf, dropdownFieldNames)
            };

            const serialNo = fields['SerialNo'] || 'Unknown';
            backflowList[serialNo] = {
                locationInfo: {
                    assemblyAddress: fields['AssemblyAddress'] || '',
                    onSiteLocation: fields['On Site Location of Assembly'] || '',
                    primaryService: fields['PrimaryBusinessService'] || '',
                },
                installationInfo: {
                    installationStatus: fields['InstallationIs'] || '',
                    protectionType: fields['ProtectionType'] || '',
                    serviceType: fields['ServiceType'] || ''
                },
                deviceInfo: {
                    meterNo: fields['WaterMeterNo'] || '',
                    serialNo: fields['SerialNo'] || '',
                    type: fields['BFType'] || '',
                    manufacturer: fields['Manufacturer'] || '',
                    size: fields['Size'] || '',
                    modelNo: fields['ModelNo'] || '',
                }
            };
        } catch (error: unknown) {
            console.error(`Error processing ${pdf.name}:`, error);
        }
    }

    return backflowList;
};

export const extractInitialTest = async (pdf: File) => {
    let initialTest: InitialTest = {
        checkValve1: {
            value: '',
            closedTight: false
        },
        checkValve2: {
            value: '',
            closedTight: false
        },
        reliefValve: {
            value: '',
            opened: false
        },
        vacuumBreaker: {
            airInlet: {
                value: '',
                leaked: false,
                opened: false
            },
            check: {
                value: '',
                leaked: false
            },
        },
    };

    try {
        const textFieldNames = [
            'InitialCT1', 'InitialCT2', 'InitialPSIRV',
            'InitialAirInlet', 'InitialCk1PVB'
        ];
        const checkboxFieldNames = [
            'InitialCTBox', 'InitialCT1Leaked',
            'InitialCT2Box', 'InitialCT2Leaked',
            'InitialRVDidNotOpen',
            'InitialAirInletLeaked', 'InitialCkPVBLDidNotOpen', 'InitialCkPVBLeaked'
        ]

        const fields = {
            ...await extractTextFields(pdf, textFieldNames),
            ...await extractCheckboxFields(pdf, checkboxFieldNames)
        };

        initialTest = {
            checkValve1: {
                value: fields['InitialCT1'] || '',
                closedTight: stringToBoolean(fields['InitialCTBox']),
            },
            checkValve2: {
                value: fields['InitialCT2'] || '',
                closedTight: stringToBoolean(fields['InitialCT2Box']),
            },
            reliefValve: {
                value: fields['InitialPSIRV'] || '',
                opened: !stringToBoolean(fields['InitialRVDidNotOpen']),
            },
            // TODO: IMPLEMENT VACUUM BREAKER INIT TEST EXTRACTION
            vacuumBreaker: {
                airInlet: {
                    value: '',
                    leaked: false,
                    opened: false
                },
                check: {
                    value: '',
                    leaked: false
                },
            },
        };
    } catch (error: unknown) {
        console.error(`Error processing ${pdf.name}:`, error);
    }

    return initialTest;
}
