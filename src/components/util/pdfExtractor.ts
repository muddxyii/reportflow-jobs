import {FacilityOwnerInfo, RepresentativeInfo} from "@/components/types/customer";
import {DeviceInfo, InstallationInfo, LocationInfo} from "@/components/types/backflow-device";
import {Test} from "@/components/types/testing";
import {Repairs} from "@/components/types/repairs";
import {PDFFieldExtractor} from "@/components/util/pdfFieldExtractor";


//region Customer Information
export const extractFacilityOwnerInfo = async (pdf: File) => {
    const facilityOwnerInfo = FacilityOwnerInfo.empty();

    try {
        const extractor = new PDFFieldExtractor();
        const fields = await extractor.extractFields(pdf, {
            text: ['FacilityOwner', 'Address', 'Email', 'Contact', 'Phone'],
        });
        facilityOwnerInfo.owner = fields.text.FacilityOwner || '';
        facilityOwnerInfo.address = fields.text.Address || '';
        facilityOwnerInfo.email = fields.text.Email || '';
        facilityOwnerInfo.contact = fields.text.Contact || '';
        facilityOwnerInfo.phone = fields.text.Phone || '';
    } catch (error: unknown) {
        console.error(`Error processing ${pdf.name}:`, error);
    }

    return facilityOwnerInfo;
};

export const extractRepresentativeInfo = async (pdf: File) => {
    const repInfo = RepresentativeInfo.empty();

    try {
        const extractor = new PDFFieldExtractor();
        const fields = await extractor.extractFields(pdf, {
            text: ['OwnerRep', 'RepAddress', 'PersontoContact', 'Phone-0'],
        });
        repInfo.owner = fields.text.OwnerRep || '';
        repInfo.address = fields.text.RepAddress || '';
        repInfo.contact = fields.text.PersontoContact || '';
        repInfo.phone = fields.text['Phone-0'] || '';
    } catch (error: unknown) {
        console.error(`Error processing ${pdf.name}:`, error);
    }

    return repInfo;
};

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

//endregion

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
            const extractor = new PDFFieldExtractor();
            const fields = await extractor.extractFields(pdf, {
                text: ['SerialNo'],
            });

            const serialNo = fields.text.SerialNo || 'Unknown';
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
            const extractor = new PDFFieldExtractor();
            const fields = await extractor.extractFields(pdf, {
                text: ['SerialNo'],
            });

            const serialNo = fields.text.SerialNo || 'Unknown';
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
        const extractor = new PDFFieldExtractor();
        const fields = await extractor.extractFields(pdf, {
            text: ['AssemblyAddress', 'On Site Location of Assembly', 'PrimaryBusinessService'],
        });

        return {
            assemblyAddress: fields.text['AssemblyAddress'] || '',
            onSiteLocation: fields.text['On Site Location of Assembly'] || '',
            primaryService: fields.text['PrimaryBusinessService'] || '',
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
        const extractor = new PDFFieldExtractor();
        const fields = await extractor.extractFields(pdf, {
            dropdown: ['ServiceType', 'ProtectionType', 'InstallationIs'],
        });

        return {
            status: fields.dropdown['InstallationIs'] || '',
            protectionType: fields.dropdown['ProtectionType'] || '',
            serviceType: fields.dropdown['ServiceType'] || ''
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
        },
        oldComments: "",
        comments: "",
    }

    try {
        const extractor = new PDFFieldExtractor();
        const fields = await extractor.extractFields(pdf, {
            text: ['SerialNo', 'WaterMeterNo', 'Size', 'ModelNo', 'SOVComment', 'ReportComments',],
            dropdown: ['BFType', 'Manufacturer', 'SOVList',],
        });

        return {
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
        }
    } catch (error: unknown) {
        console.error(`Error processing ${pdf.name}:`, error);
        return deviceInfo;
    }
}

const extractInitialTest = async (pdf: File, emptyOnly: boolean): Promise<Test> => {
    const initialTest = Test.empty();
    if (emptyOnly) return initialTest;

    try {
        const extractor = new PDFFieldExtractor();
        const fields = await extractor.extractFields(pdf, {
            text: ['LinePressure', 'InitialCT1', 'InitialCT2',
                'InitialPSIRV', 'InitialAirInlet', 'InitialCk1PVB',
                'DateFailed'],
            checkbox: ['InitialCTBox', 'InitialCT1Leaked',
                'InitialCT2Box', 'InitialCT2Leaked',
                'InitialRVDidNotOpen',
                'InitialAirInletLeaked', 'InitialCkPVBLDidNotOpen', 'InitialCkPVBLeaked',],
            dropdown: ['BackPressure',
                'InitialTester', 'InitialTesterNo', 'InitialTestKitSerial'],
        });

        return {
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
                backPressure: stringToBoolean(fields.dropdown['BackPressure']),
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
        const extractor = new PDFFieldExtractor();
        const fields = await extractor.extractFields(pdf, {
            text: ['DateRepaired'],
            checkbox: [// ck1
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
                'PVBSpring', 'PVBGuide', 'PVBSeat', 'PVBOther'],
            dropdown: ['RepairedTester', 'RepairedTesterNo', 'RepairedTestKitSerial'],
        });

        return {
            checkValve1Repairs: {
                cleaned: fields.checkbox['Ck1Cleaned'],
                checkDisc: fields.checkbox['Ck1CheckDisc'],
                discHolder: fields.checkbox['Ck1DiscHolder'],
                spring: fields.checkbox['Ck1Spring'],
                guide: fields.checkbox['Ck1Guide'],
                seat: fields.checkbox['Ck1Seat'],
                other: fields.checkbox['Ck1Other'],
            },
            checkValve2Repairs: {
                cleaned: fields.checkbox['Ck2Cleaned'],
                checkDisc: fields.checkbox['Ck2CheckDisc'],
                discHolder: fields.checkbox['Ck2DiscHolder'],
                spring: fields.checkbox['Ck2Spring'],
                guide: fields.checkbox['Ck2Guide'],
                seat: fields.checkbox['Ck2Seat'],
                other: fields.checkbox['Ck2Other'],
            },
            reliefValveRepairs: {
                cleaned: fields.checkbox['RVCleaned'],
                rubberKit: fields.checkbox['RVRubberKit'],
                discHolder: fields.checkbox['RVDiscHolder'],
                spring: fields.checkbox['RVSpring'],
                guide: fields.checkbox['RVGuide'],
                seat: fields.checkbox['RVSeat'],
                other: fields.checkbox['RVOther'],
            },
            vacuumBreakerRepairs: {
                cleaned: fields.checkbox['PVBCleaned'],
                rubberKit: fields.checkbox['PVBRubberKit'],
                discHolder: fields.checkbox['PVBDiscHolder'],
                spring: fields.checkbox['PVBSpring'],
                guide: fields.checkbox['PVBGuide'],
                seat: fields.checkbox['PVBSeat'],
                other: fields.checkbox['PVBOther'],
            },
            testerProfile: {
                name: fields.dropdown['RepairedTester'] || '',
                certNo: fields.dropdown['RepairedTesterNo'] || '',
                gaugeKit: fields.dropdown['RepairedTestKitSerial'] || '',
                date: fields.text['DateRepaired'] || '',
            }
        };
    } catch (error: unknown) {
        console.error(`Error processing ${pdf.name}:`, error);
        return repairInfo;
    }
}

const extractFinalTest = async (pdf: File, emptyOnly: boolean): Promise<Test> => {
    const finalTest = Test.empty();
    if (emptyOnly) return finalTest;

    try {
        const extractor = new PDFFieldExtractor();
        const fields = await extractor.extractFields(pdf, {
            text: ['LinePressure',
                'FinalCT1', 'FinalCT2',
                'FinalRV',
                'FinalAirInlet', 'Check Valve',
                'DatePassed'],
            checkbox: [
                'FinalCT1Box', 'FinalCT2Box',],
            dropdown: ['BackPressure',
                'FinalTester', 'FinalTesterNo', 'FinalTestKitSerial',],
        });

        return {
            linePressure: fields.text['LinePressure'] || '',
            checkValve1: {
                value: fields.text['FinalCT1'] || '',
                closedTight: fields.checkbox['FinalCT1Box'],
            },
            checkValve2: {
                value: fields.text['FinalCT2'] || '',
                closedTight: fields.checkbox['FinalCT2Box'],
            },
            reliefValve: {
                value: fields.text['FinalRV'] || '',
                opened: true,
            },
            vacuumBreaker: {
                backPressure: stringToBoolean(fields.dropdown['BackPressure']),
                airInlet: {
                    value: fields.text['InitialAirInlet'] || '',
                    leaked: false,
                    opened: true,
                },
                check: {
                    value: fields.text['Check Valve'] || '',
                    leaked: false,
                },
            },
            testerProfile: {
                name: fields.dropdown['FinalTester'] || '',
                certNo: fields.dropdown['FinalTesterNo'] || '',
                gaugeKit: fields.dropdown['FinalTestKitSerial'] || '',
                date: fields.text['DatePassed'] || '',
            }
        };
    } catch (error: unknown) {
        console.error(`Error processing ${pdf.name}:`, error);
        return finalTest;
    }
}

function stringToBoolean(str: string): boolean {
    return str === 'YES';
}

//endregion