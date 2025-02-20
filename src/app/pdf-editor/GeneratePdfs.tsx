import {ClearOptions} from "@/app/pdf-editor/PdfClearOptions";
import {PDFProcessor, PDFProcessorOptions} from "@/components/util/pdfProcessor";

export const handleGeneratePdfs = async (
    clearOptions: ClearOptions,
    pdfs: File[]
) => {
    if (pdfs.length === 1) {
        await generateSinglePdf(clearOptions, pdfs[0])
    } else {
        await generateMultiplePdfs(clearOptions, pdfs)
    }
}

const generateSinglePdf = async (clearOptions: ClearOptions, pdf: File) => {
    try {
        const modifiedPdfBlob = await PDFProcessor.clearPDF(pdf, getProcessorOptions(clearOptions))

        const url = URL.createObjectURL(modifiedPdfBlob.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${modifiedPdfBlob.serialNo}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
    } catch (e) {
        console.error(e);
        throw e;
    }
}

const generateMultiplePdfs = async (clearOptions: ClearOptions, pdfs: File[]) => {
    try {
        const zipBlob = await PDFProcessor.clearMultiplePDFs(pdfs, getProcessorOptions(clearOptions))

        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'processed_pdfs.zip'
        link.click();
        URL.revokeObjectURL(url);
    } catch (e) {
        console.error(e);
        throw e;
    }
}

const getProcessorOptions = (clearOptions: ClearOptions): PDFProcessorOptions => {
    return {
        KeepInfo: clearOptions.keepGenericInfo,
        KeepComments: clearOptions.keepComments,
        KeepInitialTestData: clearOptions.keepTestData ? clearOptions.keepInitialTestData : false,
        KeepRepairData: clearOptions.keepTestData ? clearOptions.keepRepairData : false,
        KeepFinalTestData: clearOptions.keepTestData ? clearOptions.keepFinalTestData : false,
    }
}