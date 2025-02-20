import {PDFCheckBox, PDFDocument, PDFDropdown, PDFField, PDFOptionList, PDFRadioGroup, PDFTextField} from 'pdf-lib';

interface PDFProcessorOptions {
    KeepInfo?: boolean;
    KeepComments?: boolean;
    KeepInitialTestData?: boolean;
    KeepRepairData?: boolean;
    KeepFinalTestData?: boolean;
}

type FieldName = string;

class PDFFieldManager {
    static getInfoFieldNames(): FieldName[] {
        return [
            'WaterPurveyor',
            // Facility Owner
            'FacilityOwner', 'Address', 'Email', 'Contact', 'Phone',
            // Representative Owner
            'OwnerRep', 'RepAddress', 'PersontoContact', 'Phone-0',
            // Location Info
            'AssemblyAddress', 'On Site Location of Assembly', 'PrimaryBusinessService',
            // Installation Info
            'InstallationIs', 'ProtectionType', 'ServiceType',
            // Device Info 1
            'SerialNo', 'WaterMeterNo', 'Size', 'ModelNo', 'SOVComment',
            // Device Info 2
            'BFType', 'Manufacturer', 'SOVList'
        ];
    }

    static getInitialFieldNames(): FieldName[] {
        return [
            'DateFailed', 'InitialTester', 'InitialTesterNo', 'InitialTestKitSerial',
            'LinePressure', 'InitialCT1', 'InitialCT2', 'InitialPSIRV', 'InitialAirInlet', 'InitialCk1PVB',
            'InitialCTBox', 'InitialCT1Leaked', 'InitialCT2Box', 'InitialCT2Leaked',
            'InitialRVDidNotOpen', 'InitialAirInletLeaked', 'InitialCkPVBLDidNotOpen', 'InitialCkPVBLeaked'
        ];
    }

    static getRepairsFieldNames(): FieldName[] {
        return [
            'RepairedTester', 'RepairedTesterNo', 'DateRepaired', 'RepairedTestKitSerial',
            // Check Valve
            'Ck1Cleaned', 'Ck1CheckDisc', 'Ck1DiscHolder', 'Ck1Spring', 'Ck1Guide', 'Ck1Seat', 'Ck1Other',
            'Ck2Cleaned', 'Ck2CheckDisc', 'Ck2DiscHolder', 'Ck2Spring', 'Ck2Guide', 'Ck2Seat', 'Ck2Other',
            // Relief Valve
            'RVCleaned', 'RVRubberKit', 'RVDiscHolder', 'RVSpring', 'RVGuide', 'RVSeat', 'RVOther',
            // Vacuum Breaker
            'PVBCleaned', 'PVBRubberKit', 'PVBDiscHolder', 'PVBSpring', 'PVBGuide', 'PVBSeat', 'PVBOther'
        ];
    }

    static getFinalFieldNames(): FieldName[] {
        return [
            'DatePassed', 'FinalTester', 'FinalTesterNo', 'FinalTestKitSerial',
            'LinePressure', 'FinalCT1', 'FinalCT2', 'FinalRV', 'FinalAirInlet', 'Check Valve',
            'FinalCT1Box', 'FinalCT2Box', 'BackPressure'
        ];
    }
}

class PDFProcessor {
    static async clearPDF(pdfFile: File, options: PDFProcessorOptions = {}): Promise<{ blob: Blob; serialNo: string }> {
        // Convert File to ArrayBuffer
        const pdfBuffer = await pdfFile.arrayBuffer();

        // Load the PDF document
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const form = pdfDoc.getForm();

        const serialNoField = form.getTextField('SerialNo').getText();
        const fields = form.getFields();

        fields.forEach((field: PDFField) => {
            if (this.shouldKeepField(field.getName(), options)) {
                return;
            }

            this.clearField(field);
        });

        // Save the modified PDF as Uint8Array
        const modifiedPdfBytes = await pdfDoc.save();

        // Convert to Blob and return
        return {
            blob: new Blob([modifiedPdfBytes], {type: 'application/pdf'}),
            serialNo: serialNoField ? serialNoField : 'UnknownSerialNo'
        }
    }

    private static shouldKeepField(fieldName: string, options: PDFProcessorOptions): boolean {
        return <boolean>(
            (options.KeepInfo && PDFFieldManager.getInfoFieldNames().includes(fieldName)) ||
            (options.KeepComments && fieldName === 'ReportComments') ||
            (options.KeepInitialTestData && PDFFieldManager.getInitialFieldNames().includes(fieldName)) ||
            (options.KeepRepairData && PDFFieldManager.getRepairsFieldNames().includes(fieldName)) ||
            (options.KeepFinalTestData && PDFFieldManager.getFinalFieldNames().includes(fieldName))
        );
    }

    private static clearField(field: PDFField): void {
        switch (field.constructor.name) {
            case 'PDFTextField':
                (field as PDFTextField).setText('');
                break;
            case 'PDFCheckBox':
                (field as PDFCheckBox).uncheck();
                break;
            case 'PDFRadioGroup':
                (field as PDFRadioGroup).clear();
                break;
            case 'PDFDropdown':
            case 'PDFOptionList':
                (field as PDFDropdown | PDFOptionList).clear();
                break;
        }
    }
}

export {PDFProcessor, PDFFieldManager, type PDFProcessorOptions};