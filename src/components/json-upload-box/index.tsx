import {RefreshCcw, Trash2, Upload} from "lucide-react";
import React, {useState} from "react";

export default function JsonUploadBox({
                                          jsonFiles,
                                          onUpdateFiles,
                                          onConvert,
                                      }: {
    jsonFiles: File[];
    onUpdateFiles: (updatedFiles: File[]) => void;
    onConvert?: (file: File) => void;
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [duplicateFileError, setDuplicateFileError] = useState<string | null>(null);
    const [isFading, setIsFading] = useState(false);

    const handleFileUpload = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files).filter(file => file.name.endsWith('.rfjson'));

        if (newFiles.length === 0) {
            setDuplicateFileError("Only .rfjson files are allowed.");
            setIsFading(false);
            setTimeout(() => {
                setIsFading(true);
                setTimeout(() => setDuplicateFileError(null), 500);
            }, 3000);
            return;
        }

        const duplicateFile = newFiles.find(file => jsonFiles.some(f => f.name === file.name));
        if (duplicateFile) {
            setDuplicateFileError(`File "${duplicateFile.name}" has already been uploaded.`);
            setIsFading(false);
            setTimeout(() => {
                setIsFading(true);
                setTimeout(() => setDuplicateFileError(null), 500);
            }, 3000);
            return;
        }
        onUpdateFiles([...jsonFiles, ...newFiles]);
        setDuplicateFileError(null);

        if (onConvert) {
            newFiles.forEach(file => {
                onConvert(file);
            });
            onUpdateFiles([]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileUpload(e.dataTransfer.files);
    };

    const handleConvertAll = () => {
        jsonFiles.forEach((file) => {
            onConvert?.(file);
        });
        handleRemoveAll();
    };

    const handleConvert = (fileIndex: number) => {
        const fileToConvert = jsonFiles[fileIndex];
        onConvert?.(fileToConvert);
        handleFileRemove(fileIndex);
    };

    const handleRemoveAll = () => {
        onUpdateFiles([]);
    }

    const handleFileRemove = (fileIndex: number) => {
        const updatedFiles = jsonFiles.filter((_, index) => index !== fileIndex);
        onUpdateFiles(updatedFiles);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">RFJson Files</h2>
                {onConvert && jsonFiles.length > 0 && (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="btn btn-warning btn-sm"
                            onClick={handleConvertAll}
                        >
                            <RefreshCcw className="w-4 h-4 mr-2"/>
                            Convert All
                        </button>
                        <button
                            type="button"
                            className="btn btn-error btn-sm"
                            onClick={handleRemoveAll}
                        >
                            <Trash2 className="w-4 h-4 mr-2"/>
                            Delete All
                        </button>
                    </div>
                )}
            </div>

            <div
                className={`border-2 rounded-lg p-8 text-center space-y-4 ${
                    isDragging ? "border-blue-500" : "border-dashed"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <Upload className="mx-auto h-12 w-12 text-gray-400"/>
                <div>
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-blue-500 hover:text-blue-700"
                    >
                        Click to upload
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".rfjson"
                        multiple
                        onChange={(e) => handleFileUpload(e.target.files)}
                    />
                    <p className="text-gray-500">or drag and drop .rfjson files here</p>
                </div>
                {duplicateFileError && (
                    <div
                        className={`text-red-500 transition-opacity duration-500 ${
                            isFading ? "opacity-0" : "opacity-100"
                        }`}
                    >
                        {duplicateFileError}
                    </div>
                )}
            </div>

            {jsonFiles.length > 0 && (
                <div className="space-y-2">
                    {jsonFiles.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                            <span className="truncate flex-1">{file.name}</span>
                            <div className="flex gap-2">
                                {onConvert && (
                                    <button
                                        type="button"
                                        className="btn btn-warning btn-xs"
                                        onClick={() => handleConvert(index)}
                                    >
                                        <RefreshCcw className="w-3 h-3"/>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-error btn-xs"
                                    onClick={() => handleFileRemove(index)}
                                >
                                    <Trash2 className="w-3 h-3"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}