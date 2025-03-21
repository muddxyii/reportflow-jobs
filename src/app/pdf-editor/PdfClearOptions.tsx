import React from 'react';

export interface ClearOptions {
    keepGenericInfo: boolean;
    keepTestData: boolean;
    keepComments: boolean;
    keepInitialTestData: boolean;
    keepRepairData: boolean;
    keepFinalTestData: boolean;
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

            <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-row gap-4">
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

                {clearOptions.keepTestData && (
                    <div className="flex flex-row gap-4 ml-8">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-secondary"
                                checked={clearOptions.keepInitialTestData}
                                onChange={() => onOptionChange('keepInitialTestData')}
                            />
                            <span className="label-text">Keep Initial Test Data</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-secondary"
                                checked={clearOptions.keepRepairData}
                                onChange={() => onOptionChange('keepRepairData')}
                            />
                            <span className="label-text">Keep Repair Data</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-secondary"
                                checked={clearOptions.keepFinalTestData}
                                onChange={() => onOptionChange('keepFinalTestData')}
                            />
                            <span className="label-text">Keep Final Test Data</span>
                        </label>
                    </div>
                )}
            </div>
        </>
    );
}