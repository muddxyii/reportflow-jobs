import {PDFDocument} from 'pdf-lib';
import {FacilityOwnerInfo, RepresentativeInfo} from "@/components/types/reportFlowTypes";

export const extractFields = async (pdf: File, fieldNames: string[]) => {
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

export const extractBackflowInfo = async (pdfs: File[]) => {
    const backflowList: Record<string, { SerialNo: string; MeterNo: string }> = {};

    for (const pdf of pdfs) {
        try {
            const fields = await extractFields(pdf, ['SerialNo', 'WaterMeterNo']);
            const serialNo = fields['SerialNo'] || 'Unknown';
            backflowList[serialNo] = {
                SerialNo: serialNo,
                MeterNo: fields['WaterMeterNo'] || 'Unknown',
            };
        } catch (error: unknown) {
            console.error(`Error processing ${pdf.name}:`, error);
        }
    }

    return backflowList;
};

export const extractFacilityOwnerInfo = async (pdf: File) => {
    const facilityOwnerInfo: FacilityOwnerInfo = {
        FacilityOwner: '',
        Address: '',
        Email: '',
        Contact: '',
        Phone: ''
    };

    try {
        const fieldNames = ['FacilityOwner', 'Address', 'Email', 'Contact', 'Phone'];
        const fields = await extractFields(pdf, fieldNames);
        facilityOwnerInfo.FacilityOwner = fields['FacilityOwner'] || '';
        facilityOwnerInfo.Address = fields['Address'] || '';
        facilityOwnerInfo.Email = fields['Email'] || '';
        facilityOwnerInfo.Contact = fields['Contact'] || '';
        facilityOwnerInfo.Phone = fields['Phone'] || '';
    } catch (error: unknown) {
        console.error(`Error processing ${pdf.name}:`, error);
    }

    return facilityOwnerInfo;
};

export const extractRepresentativeInfo = async (pdf: File) => {
    const representativeInfo: RepresentativeInfo = {
        OwnerRep: '',
        RepAddress: '',
        PersontoContact: '',
        "Phone-0": '',
    }

    try {
        const fieldNames = ['OwnerRep', 'RepAddress', 'PersontoContact', 'Phone-0'];
        const fields = await extractFields(pdf, fieldNames);
        representativeInfo.OwnerRep = fields['OwnerRep'] || '';
        representativeInfo.RepAddress = fields['RepAddress'] || '';
        representativeInfo.PersontoContact = fields['PersontoContact'] || '';
        representativeInfo["Phone-0"] = fields['Phone-0'] || '';
    } catch (error: unknown) {
        console.error(`Error processing ${pdf.name}:`, error);
    }

    return representativeInfo;
};
