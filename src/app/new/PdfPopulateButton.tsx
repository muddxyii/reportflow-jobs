﻿import React, {ChangeEvent} from 'react';
import {extractFacilityOwnerInfo, extractRepresentativeInfo} from "@/components/util/pdfExtractor";
import {FacilityOwnerInfo, RepresentativeInfo} from "@/components/types/reportFlowTypes";

type PdfPopulateButtonProps = {
    setFacilityOwnerInfo: (info: FacilityOwnerInfo) => void;
    setRepresentativeInfo: (info: RepresentativeInfo) => void;
};

export default function PdfPopulateButton({setFacilityOwnerInfo, setRepresentativeInfo}: PdfPopulateButtonProps) {
    const handlePdfUploadForFields = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const extractedFacilityInfo = await extractFacilityOwnerInfo(file);
            const extractedRepInfo = await extractRepresentativeInfo(file);

            setFacilityOwnerInfo(extractedFacilityInfo);
            setRepresentativeInfo(extractedRepInfo);
        } catch (err) {
            console.error('Error reading PDF form:', err);
        }
    };

    return (
        <>
            <label htmlFor="pdfUpload" className="btn btn-secondary shadow-md text-sm text-right">
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