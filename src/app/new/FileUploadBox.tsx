import { Upload, Trash2 } from "lucide-react";
import React, { useState } from "react";

export default function FileUploadBox({
                                         pdfs,
                                         onUpdateFiles,
                                     }: {
    pdfs: File[];
    onUpdateFiles: (updatedFiles: File[]) => void;
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [duplicateFileError, setDuplicateFileError] = useState<string | null>(null);
    const [isFading, setIsFading] = useState(false);

    const handleFileUpload = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files);
        const duplicateFile = newFiles.find(file => pdfs.some(f => f.name === file.name));
        if (duplicateFile) {
            setDuplicateFileError(`File "${duplicateFile.name}" has already been uploaded.`);
            setIsFading(false);
            setTimeout(() => {
                setIsFading(true);
                setTimeout(() => setDuplicateFileError(null), 500); // Matches fade duration
            }, 3000);
            return;
        }
        onUpdateFiles([...pdfs, ...newFiles]);
        setDuplicateFileError(null);
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

    const handleFileRemove = (fileIndex: number) => {
        const updatedFiles = pdfs.filter((_, index) => index !== fileIndex);
        onUpdateFiles(updatedFiles);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Backflow Devices</h2>
            <div
                className={`border-2 rounded-lg p-8 text-center space-y-4 ${
                    isDragging ? "border-blue-500" : "border-dashed"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                    <label className="btn btn-primary">
                        Upload PDFs
                        <input
                            type="file"
                            className="hidden"
                            multiple
                            accept=".pdf"
                            onChange={(e) => handleFileUpload(e.target.files)}
                        />
                    </label>
                </div>
                {duplicateFileError && (
                    <p
                        className={`text-red-500 text-sm py-2 transition-opacity duration-500 ${
                            isFading ? 'opacity-0' : 'opacity-100'
                        }`}
                    >
                        {duplicateFileError}
                    </p>
                )}
                {pdfs.length > 0 && (
                    <div className="text-left">
                        <h3 className="font-semibold mb-2">Uploaded Files:</h3>
                        <ul className="list-disc list-inside space-y-2">
                            {pdfs.map((file, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center"
                                >
                                    <span>{file.name}</span>
                                    <button
                                        type="button"
                                        className="btn btn-error btn-sm"
                                        onClick={() => handleFileRemove(index)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
