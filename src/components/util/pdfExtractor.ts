import {PDFDocument} from 'pdf-lib';
import {
    DeviceInfo,
    FacilityOwnerInfo,
    InstallationInfo,
    LocationInfo,
    Repairs,
    RepresentativeInfo,
    Test
} from "@/components/types/reportFlowTypes";

//region Field Extractor Helpers

const extractTextFields = async (pdf: File, fieldNames: string[]) => {
    const arrayBuffer = await pdf.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const form = pdfDoc.getForm();

    const fieldValues: Record<string, string> = {};

    fieldNames.forEach((fieldName) => {
        const field = form.getTextField(fieldName);
        //fieldValues[fieldName] = field?.getText() || `Unknown ${fieldName}`;
        fieldValues[fieldName] = field?.getText() || '';
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

//region Customer Information
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

export const extractWaterPurveyor = async (pdf: File) => {
    let waterPurveyor = '';

    try {
        const fieldNames = ['WaterPurveyor'];
        const fields = await extractDropdownFields(pdf, fieldNames);
        waterPurveyor = fields['WaterPurveyor'] || '';
    } catch (error: unknown) {
        console.error(`Error processing ${pdf.name}:`, error);
    }

    return waterPurveyor;
};

//endregion

// TODO: ADD EXTRACTOR FOR SHUT OFF VALVES!!!

export const extractAllBackflowInfo = async (pdfs: File[]) => {
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
            const textFieldNames = [
                'SerialNo'
            ];


            const fields = await extractTextFields(pdf, textFieldNames);

            const serialNo = fields['SerialNo'] || 'Unknown';
            backflowList[serialNo] = {
                locationInfo: await extractLocationInfo(pdf),
                installationInfo: await extractInstallationInfo(pdf),
                deviceInfo: await extractDeviceInfo(pdf),
                initialTest: await extractInitialTest(pdf, false),
                repairs: await extractRepairs(pdf, false),
                finalTest: await extractFinalTest(pdf, false),
            }
        } catch (error: unknown) {
            console.error(`Error processing ${pdf.name}:`, error);
        }
    }

    return backflowList;
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
            const textFieldNames = [
                'SerialNo'
            ];

            const fields = await extractTextFields(pdf, textFieldNames);

            const serialNo = fields['SerialNo'] || 'Unknown';
            backflowList[serialNo] = {
                locationInfo: await extractLocationInfo(pdf),
                installationInfo: await extractInstallationInfo(pdf),
                deviceInfo: await extractDeviceInfo(pdf),
                initialTest: await extractInitialTest(pdf, !(jobType === 'Repair')),
                repairs: await extractRepairs(pdf, true),
                finalTest: await extractFinalTest(pdf, true),
            }
        } catch (error: unknown) {
            console.error(`Error processing ${pdf.name}:`, error);
        }
    }

    return backflowList;
};

//region Specific Device Information

const extractLocationInfo = async (pdf: File): Promise<LocationInfo> => {
    const locationInfo: LocationInfo = {
        assemblyAddress: "", onSiteLocation: "", primaryService: ""
    }

    try {
        const textFieldNames = [
            'AssemblyAddress', 'On Site Location of Assembly', 'PrimaryBusinessService',
        ];

        const fields = await extractTextFields(pdf, textFieldNames);

        return {
            assemblyAddress: fields['AssemblyAddress'] || '',
            onSiteLocation: fields['On Site Location of Assembly'] || '',
            primaryService: fields['PrimaryBusinessService'] || '',
        }
    } catch (error: unknown) {
        console.error(`Error processing ${pdf.name}:`, error);
        return locationInfo;
    }
}

const extractInstallationInfo = async (pdf: File): Promise<InstallationInfo> => {
    const installationInfo: InstallationInfo = {
        status: "", protectionType: "", serviceType: ""
    }

    try {
        const dropdownFieldNames = [
            'ServiceType', 'ProtectionType', 'InstallationIs'
        ];

        const fields = await extractDropdownFields(pdf, dropdownFieldNames);

        return {
            status: fields['InstallationIs'] || '',
            protectionType: fields['ProtectionType'] || '',
            serviceType: fields['ServiceType'] || ''
        }
    } catch (error: unknown) {
        console.error(`Error processing ${pdf.name}:`, error);
        return installationInfo;
    }
}

const extractDeviceInfo = async (pdf: File): Promise<DeviceInfo> => {
    const deviceInfo: DeviceInfo = {
        permitNo: "",
        manufacturer: "",
        meterNo: "",
        modelNo: "",
        serialNo: "",
        size: "",
        type: "",
        shutoffValves: {
            status: '',
            comment: ''
        }
    }

    try {
        const textFieldNames = [
            'SerialNo', 'WaterMeterNo', 'Size', 'ModelNo', 'SOVComment',
        ];
        const dropdownFieldNames = [
            'BFType', 'Manufacturer', 'SOVList',
        ]

        const fields = {
            ...await extractTextFields(pdf, textFieldNames),
            ...await extractDropdownFields(pdf, dropdownFieldNames)
        };

        return {
            permitNo: fields['PermitAccountNo'] || '',
            meterNo: fields['WaterMeterNo'] || '',
            serialNo: fields['SerialNo'] || '',
            type: fields['BFType'] || '',
            manufacturer: fields['Manufacturer'] || '',
            size: fields['Size'] || '',
            modelNo: fields['ModelNo'] || '',
            shutoffValves: {
                status: fields['SOVList'] || '',
                comment: fields['SOVComment'] || '',
            },
        }
    } catch (error: unknown) {
        console.error(`Error processing ${pdf.name}:`, error);
        return deviceInfo;
    }
}

const extractInitialTest = async (pdf: File, emptyOnly: boolean): Promise<Test> => {
    const initialTest: Test = {
        linePressure: '',
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
            backPressure: false,
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
        testerProfile: {
            name: '',
            certNo: '',
            gaugeKit: '',
            date: ''
        }
    };
    if (emptyOnly) return initialTest;

    try {
        const textFieldNames = [
            'LinePressure', 'InitialCT1', 'InitialCT2',
            'InitialPSIRV', 'InitialAirInlet', 'InitialCk1PVB',
            'DateFailed'
        ];
        const checkboxFieldNames = [
            'InitialCTBox', 'InitialCT1Leaked',
            'InitialCT2Box', 'InitialCT2Leaked',
            'InitialRVDidNotOpen',
            'InitialAirInletLeaked', 'InitialCkPVBLDidNotOpen', 'InitialCkPVBLeaked',
        ];
        const dropdownFieldNames = [
            'BackPressure',
            'InitialTester', 'InitialTesterNo', 'InitialTestKitSerial',
        ]

        const fields = {
            ...await extractTextFields(pdf, textFieldNames),
            ...await extractCheckboxFields(pdf, checkboxFieldNames),
            ...await extractDropdownFields(pdf, dropdownFieldNames)
        };

        return {
            linePressure: fields['LinePressure'] || '',
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
            vacuumBreaker: {
                backPressure: stringToBoolean(fields['BackPressure']),
                airInlet: {
                    value: fields['InitialAirInlet'] || '',
                    leaked: stringToBoolean(fields['InitialAirInletLeaked']),
                    opened: stringToBoolean(fields['InitialCkPVBLDidNotOpen']),
                },
                check: {
                    value: fields['InitialCk1PVB'] || '',
                    leaked: stringToBoolean(fields['InitialCkPVBLeaked']),
                },
            },
            testerProfile: {
                name: fields['InitialTester'] || '',
                certNo: fields['InitialTesterNo'] || '',
                gaugeKit: fields['InitialTestKitSerial'] || '',
                date: fields['DateFailed'] || '',
            }
        };
    } catch (error: unknown) {
        console.error(`Error processing ${pdf.name}:`, error);
        return initialTest;
    }
}

const extractRepairs = async (pdf: File, emptyOnly: boolean): Promise<Repairs> => {
    const repairInfo: Repairs = {
        checkValve1Repairs: {
            cleaned: false,
            checkDisc: false,
            discHolder: false,
            spring: false,
            guide: false,
            seat: false,
            other: false
        },
        checkValve2Repairs: {
            cleaned: false,
            checkDisc: false,
            discHolder: false,
            spring: false,
            guide: false,
            seat: false,
            other: false
        },
        reliefValveRepairs: {
            cleaned: false,
            rubberKit: false,
            discHolder: false,
            spring: false,
            guide: false,
            seat: false,
            other: false
        },
        vacuumBreakerRepairs: {
            cleaned: false,
            rubberKit: false,
            discHolder: false,
            spring: false,
            guide: false,
            seat: false,
            other: false
        },
        testerProfile: {
            name: '',
            certNo: '',
            gaugeKit: '',
            date: ''
        }
    };
    if (emptyOnly) return repairInfo;

    try {
        const textFieldNames = [
            'DateRepaired'
        ];
        const checkboxFieldNames = [
            // ck1
            'Ck1Cleaned', 'Ck1CheckDisc', 'Ck1DiscHolder',
            'Ck1Spring', 'Ck1Guide', 'Ck1Seat', 'Ck1Other',
            // ck2
            'Ck2Cleaned', 'Ck2CheckDisc', 'Ck2DiscHolder',
            'Ck2Spring', 'Ck2Guide', 'Ck2Seat', 'Ck2Other',
            // rv
            'RVCleaned', 'RVRubberKit', 'RVDiscHolder',
            'RVSpring', 'RVGuide', 'RVSeat', 'RVOther',
            // vb
            'PVBCleaned', 'PVBRubberKit', 'PVBDiscHolder',
            'PVBSpring', 'PVBGuide', 'PVBSeat', 'PVBOther',
        ];
        const dropdownFieldNames = [
            'RepairedTester', 'RepairedTesterNo', 'RepairedTestKitSerial',
        ]

        const fields = {
            ...await extractTextFields(pdf, textFieldNames),
            ...await extractCheckboxFields(pdf, checkboxFieldNames),
            ...await extractDropdownFields(pdf, dropdownFieldNames)
        };

        return {
            checkValve1Repairs: {
                cleaned: stringToBoolean(fields['Ck1Cleaned']),
                checkDisc: stringToBoolean(fields['Ck1CheckDisc']),
                discHolder: stringToBoolean(fields['Ck1DiscHolder']),
                spring: stringToBoolean(fields['Ck1Spring']),
                guide: stringToBoolean(fields['Ck1Guide']),
                seat: stringToBoolean(fields['Ck1Seat']),
                other: stringToBoolean(fields['Ck1Other']),
            },
            checkValve2Repairs: {
                cleaned: stringToBoolean(fields['Ck2Cleaned']),
                checkDisc: stringToBoolean(fields['Ck2CheckDisc']),
                discHolder: stringToBoolean(fields['Ck2DiscHolder']),
                spring: stringToBoolean(fields['Ck2Spring']),
                guide: stringToBoolean(fields['Ck2Guide']),
                seat: stringToBoolean(fields['Ck2Seat']),
                other: stringToBoolean(fields['Ck2Other']),
            },
            reliefValveRepairs: {
                cleaned: stringToBoolean(fields['RVCleaned']),
                rubberKit: stringToBoolean(fields['RVRubberKit']),
                discHolder: stringToBoolean(fields['RVDiscHolder']),
                spring: stringToBoolean(fields['RVSpring']),
                guide: stringToBoolean(fields['RVGuide']),
                seat: stringToBoolean(fields['RVSeat']),
                other: stringToBoolean(fields['RVOther']),
            },
            vacuumBreakerRepairs: {
                cleaned: stringToBoolean(fields['PVBCleaned']),
                rubberKit: stringToBoolean(fields['PVBRubberKit']),
                discHolder: stringToBoolean(fields['PVBDiscHolder']),
                spring: stringToBoolean(fields['PVBSpring']),
                guide: stringToBoolean(fields['PVBGuide']),
                seat: stringToBoolean(fields['PVBSeat']),
                other: stringToBoolean(fields['PVBOther']),
            },
            testerProfile: {
                name: fields['RepairedTester'] || '',
                certNo: fields['RepairedTesterNo'] || '',
                gaugeKit: fields['RepairedTestKitSerial'] || '',
                date: fields['DateRepaired'] || '',
            }
        };
    } catch (error: unknown) {
        console.error(`Error processing ${pdf.name}:`, error);
        return repairInfo;
    }
}

const extractFinalTest = async (pdf: File, emptyOnly: boolean): Promise<Test> => {
    const finalTest: Test = {
        linePressure: '',
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
            backPressure: false,
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
        testerProfile: {
            name: '',
            certNo: '',
            gaugeKit: '',
            date: ''
        }
    };
    if (emptyOnly) return finalTest;

    try {
        const textFieldNames = [
            'LinePressure',
            'FinalCT1', 'FinalCT2',
            'FinalRV',
            'FinalAirInlet', 'Check Valve',
            'DatePassed'
        ];
        const checkboxFieldNames = [
            'FinalCT1Box', 'FinalCT2Box',
        ];
        const dropdownFieldNames = [
            'BackPressure',
            'FinalTester', 'FinalTesterNo', 'FinalTestKitSerial',
        ]

        const fields = {
            ...await extractTextFields(pdf, textFieldNames),
            ...await extractCheckboxFields(pdf, checkboxFieldNames),
            ...await extractDropdownFields(pdf, dropdownFieldNames)
        };

        return {
            linePressure: fields['LinePressure'] || '',
            checkValve1: {
                value: fields['FinalCT1'] || '',
                closedTight: stringToBoolean(fields['FinalCT1Box']),
            },
            checkValve2: {
                value: fields['FinalCT2'] || '',
                closedTight: stringToBoolean(fields['FinalCT2Box']),
            },
            reliefValve: {
                value: fields['FinalRV'] || '',
                opened: true,
            },
            vacuumBreaker: {
                backPressure: stringToBoolean(fields['BackPressure']),
                airInlet: {
                    value: fields['InitialAirInlet'] || '',
                    leaked: false,
                    opened: true,
                },
                check: {
                    value: fields['Check Valve'] || '',
                    leaked: false,
                },
            },
            testerProfile: {
                name: fields['FinalTester'] || '',
                certNo: fields['FinalTesterNo'] || '',
                gaugeKit: fields['FinalTestKitSerial'] || '',
                date: fields['DatePassed'] || '',
            }
        };
    } catch (error: unknown) {
        console.error(`Error processing ${pdf.name}:`, error);
        return finalTest;
    }
}

//endregion