import React, { ChangeEvent } from 'react';
import { PDFDocument } from 'pdf-lib';
import { facilityOwnerFields, representativeFields } from './CustomerInfoForm';

type PdfPopulateButtonProps = {
    setFacilityOwnerInfo: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    setRepresentativeInfo: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

export default function PdfPopulateButton({ setFacilityOwnerInfo, setRepresentativeInfo }: PdfPopulateButtonProps) {
    const handlePdfUploadForFields = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const fileArrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(fileArrayBuffer);
            const form = pdfDoc.getForm();

            // Populate facility owner fields
            const updatedFacilityOwnerInfo: Record<string, string> = {};
            facilityOwnerFields.forEach(field => {
                const pdfField = form.getTextField(field.name);
                if (pdfField) {
                    updatedFacilityOwnerInfo[field.name] = pdfField.getText() || '';
                }
            });
            setFacilityOwnerInfo(prev => ({ ...prev, ...updatedFacilityOwnerInfo }));

            // Populate representative fields
            const updatedRepresentativeInfo: Record<string, string> = {};
            representativeFields.forEach(field => {
                const pdfField = form.getTextField(field.name);
                if (pdfField) {
                    updatedRepresentativeInfo[field.name] = pdfField.getText() || '';
                }
            });
            setRepresentativeInfo(prev => ({ ...prev, ...updatedRepresentativeInfo }));
        } catch (err) {
            console.error('Error reading PDF form:', err);
        }
    };

    return (
        <>
            <label
                htmlFor="pdfUpload"
                className="btn btn-secondary shadow-md text-sm text-right"
            >
                Populate Fields from PDF
            </label>
            <input
                id="pdfUpload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handlePdfUploadForFields}
            />
        </>
    );
}
