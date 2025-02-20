import React from 'react';

interface ClearOptions {
    keepGenericInfo: boolean;
    keepTestData: boolean;
    keepComments: boolean;
}

interface PdfClearOptionsProps {
    clearOptions: ClearOptions;
    onOptionChange: (option: keyof ClearOptions) => void;
}

export default function PdfClearOptions({clearOptions, onOptionChange}: PdfClearOptionsProps) {
    return (
        <>
            <label className="label">
                <span className="text-xl font-semibold">PDF Clear Actions</span>
            </label>

            <div className="flex flex-row gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={clearOptions.keepGenericInfo}
                        onChange={() => onOptionChange('keepGenericInfo')}
                    />
                    <span className="label-text">Keep Generic Info</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={clearOptions.keepTestData}
                        onChange={() => onOptionChange('keepTestData')}
                    />
                    <span className="label-text">Keep Test Data</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={clearOptions.keepComments}
                        onChange={() => onOptionChange('keepComments')}
                    />
                    <span className="label-text">Keep Comments</span>
                </label>
            </div>
        </>
    );
}