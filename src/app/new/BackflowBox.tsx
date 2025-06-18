import {Backflow, BackflowList} from "@/components/types/job";
import {ClipboardCopy, ClipboardPaste, Pencil, Trash2} from "lucide-react";
import React, {useState} from "react";
import {MapPreview} from "@/components/map-preview";
import OpenLocationCode from "open-location-code-typescript";

export default function BackflowBox({
                                        backflowList,
                                        onUpdateBackflows
                                    }: {
    backflowList: BackflowList;
    onUpdateBackflows: (updatedBackflows: BackflowList) => void;
}) {
    const [showToast, setShowToast] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string>("");
    const [editingBackflow, setEditingBackflow] = useState<Backflow>(Backflow.empty);
    const [error, setError] = useState<string>("");
    const [coordinates, setCoordinates] = useState({
        latitude: '',
        longitude: ''
    });
    const [coordinateErrors, setCoordinateErrors] = useState({
        latitude: '',
        longitude: ''
    });
    const [accessComment, setAccessComment] = useState('');

    const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        // Clear previous errors
        setCoordinateErrors(prev => ({
            ...prev,
            [name]: ''
        }));

        // Only allow numbers, decimal point, and minus sign
        if (!/^-?\d*\.?\d*$/.test(value) && value !== '') {
            setCoordinateErrors(prev => ({
                ...prev,
                [name]: 'Please enter a valid number'
            }));
            return;
        }

        setCoordinates(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBackflowEdit = (id: string) => {
        setEditingId(id);
        setEditingBackflow(backflowList[id]);
        setIsEditModalOpen(true);
        setError("");
        setCoordinateErrors({latitude: '', longitude: ''});

        const lat = backflowList[id].locationInfo.coordinates.latitude;
        const lng = backflowList[id].locationInfo.coordinates.longitude;
        setCoordinates({
            latitude: lat == 0 ? '' : lat.toString(),
            longitude: lng == 0 ? '' : lng.toString(),
        });
        setAccessComment(backflowList[id].accessInfo?.comment || '');
    };

    const handlePasteCoordinates = async () => {
        setError("");
        try {
            const clipText = await navigator.clipboard.readText();
            const coords = parseCoordinates(clipText);

            if (coords) {
                setCoordinates(coords);
                setCoordinateErrors({latitude: '', longitude: ''});
            } else {
                setError("Invalid Coordinates format: " + clipText);
            }
        } catch (err) {
            setError("Failed to read clipboard: " + err);
        }
    };

    const parseCoordinates = (input: string): { latitude: string; longitude: string } | null => {
        const trimmed = input.trim();
        const parts = trimmed.split(',');

        if (parts.length !== 2) {
            return null;
        }

        const latStr = parts[0].trim();
        const lngStr = parts[1].trim();

        const lat = parseLatitude(latStr);
        const lng = parseLongitude(lngStr);

        if (lat == 0 || lng == 0) {
            return null;
        }

        return {
            latitude: lat.toString(),
            longitude: lng.toString()
        };
    };

    const validateCoordinates = (): boolean => {
        let isValid = true;
        const errors = {
            latitude: '',
            longitude: ''
        };

        // Only validate if one coordinate is provided but not the other
        if (coordinates.latitude && !coordinates.longitude) {
            errors.longitude = 'Longitude is required when latitude is provided';
            isValid = false;
        }

        if (coordinates.longitude && !coordinates.latitude) {
            errors.latitude = 'Latitude is required when longitude is provided';
            isValid = false;
        }

        setCoordinateErrors(errors);
        return isValid;
    };

    const parseLatitude = (value: string): number => {
        if (!value) return 0;
        const parsed = parseFloat(value);
        if (isNaN(parsed)) {
            setCoordinateErrors(prev => ({
                ...prev,
                latitude: 'Invalid latitude value'
            }));
            return 0;
        }
        const constrained = Math.max(-90, Math.min(90, parsed));
        if (constrained !== parsed) {
            setCoordinateErrors(prev => ({
                ...prev,
                latitude: 'Latitude must be between -90 and 90 degrees'
            }));
        }
        return constrained;
    };

    const parseLongitude = (value: string): number => {
        if (!value) return 0;
        const parsed = parseFloat(value);
        if (isNaN(parsed)) {
            setCoordinateErrors(prev => ({
                ...prev,
                longitude: 'Invalid longitude value'
            }));
            return 0;
        }
        const constrained = Math.max(-180, Math.min(180, parsed));
        if (constrained !== parsed) {
            setCoordinateErrors(prev => ({
                ...prev,
                longitude: 'Longitude must be between -180 and 180 degrees'
            }));
        }
        return constrained;
    };

    const handleUpdate = () => {
        if (!validateCoordinates()) {
            setError("Please correct the coordinate errors before saving");
            return;
        }

        const parsedLat = parseLatitude(coordinates.latitude);
        const parsedLng = parseLongitude(coordinates.longitude);

        if (coordinateErrors.latitude || coordinateErrors.longitude) {
            setError("Please correct the coordinate errors before saving");
            return;
        }

        editingBackflow.locationInfo.coordinates.latitude = parsedLat;
        editingBackflow.locationInfo.coordinates.longitude = parsedLng;
        if (!editingBackflow.accessInfo) {
            editingBackflow.accessInfo = { comment: '' };
        }
        editingBackflow.accessInfo.comment = accessComment;

        const updatedBackflows = {...backflowList};
        updatedBackflows[editingId] = editingBackflow;
        onUpdateBackflows(updatedBackflows);
        setIsEditModalOpen(false);
        setError("");
        setCoordinateErrors({latitude: '', longitude: ''});
        setAccessComment('');
    };

    const handleCancel = () => {
        setIsEditModalOpen(false);
        setEditingBackflow(Backflow.empty);
        setEditingId("");
        setError("");
        setCoordinateErrors({latitude: '', longitude: ''});
        setAccessComment('');
    };

    const handleBackflowRemove = (id: string) => {
        const updatedBackflows = {...backflowList};
        delete updatedBackflows[id];
        onUpdateBackflows(updatedBackflows);
    };

    const handleCopyCoordinates = async (id: string) => {
        try {
            const lat = backflowList[id].locationInfo.coordinates.latitude;
            const lng = backflowList[id].locationInfo.coordinates.longitude;

            const plusCode = OpenLocationCode.encode(lat, lng);
            await navigator.clipboard.writeText(plusCode);

            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        } catch (err) {
            console.error("Failed to copy plus code:", err);
        }
    };


    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Backflows</h2>
            <div className="border-2 rounded-lg p-4">
                {Object.keys(backflowList).length === 0 ? (
                    <p className="text-center text-gray-500">
                        No backflows available.<br/>Convert some PDFs to get started.
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {Object.entries(backflowList).map(([id, backflow]) => (
                            <li key={id} className="flex justify-between items-center">
                                <span>{backflow.deviceInfo.serialNo == '' ? 'Unknown Serial No.' : backflow.deviceInfo.serialNo}</span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-warning btn-sm"
                                        onClick={() => handleBackflowEdit(id)}
                                    >
                                        <Pencil className="h-4 w-4"/>
                                    </button>
                                    {backflow.locationInfo.coordinates.latitude != 0 && backflow.locationInfo.coordinates.longitude != 0 && (
                                        <button
                                            type="button"
                                            className="btn btn-info btn-sm"
                                            onClick={() => handleCopyCoordinates(id)}
                                        >
                                            <ClipboardCopy className="h-4 w-4"/>
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="btn btn-error btn-sm"
                                        onClick={() => handleBackflowRemove(id)}
                                    >
                                        <Trash2 className="h-4 w-4"/>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Edit Backflow Information</h3>
                            <button
                                onClick={handlePasteCoordinates}
                                className="btn btn-sm btn-ghost gap-2"
                                title="Paste Coordinates"
                            >
                                <ClipboardPaste className="h-4 w-4"/>
                                Paste Coordinates
                            </button>
                        </div>

                        {coordinates.latitude && coordinates.longitude && !coordinateErrors.latitude && !coordinateErrors.longitude && (
                            <div className="mt-4">
                                <MapPreview latitude={coordinates.latitude} longitude={coordinates.longitude}/>
                            </div>
                        )}

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Latitude</span>
                            </label>
                            <input
                                type="text"
                                name="latitude"
                                value={coordinates.latitude}
                                onChange={handleCoordinateChange}
                                className={`input input-bordered w-full ${
                                    coordinateErrors.latitude ? 'input-error' : ''
                                }`}
                                placeholder="Enter latitude (-90 to 90) - Optional"
                            />
                            {coordinateErrors.latitude && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{coordinateErrors.latitude}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Longitude</span>
                            </label>
                            <input
                                type="text"
                                name="longitude"
                                value={coordinates.longitude}
                                onChange={handleCoordinateChange}
                                className={`input input-bordered w-full ${
                                    coordinateErrors.longitude ? 'input-error' : ''
                                }`}
                                placeholder="Enter longitude (-180 to 180) - Optional"
                            />
                            {coordinateErrors.longitude && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{coordinateErrors.longitude}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control w-full mt-4">
                            <h4 className="text-lg font-semibold mb-2">Access Information</h4>
                            <label className="label">
                                <span className="label-text">Access Comment</span>
                            </label>
                            <textarea
                                value={accessComment}
                                onChange={(e) => setAccessComment(e.target.value.toUpperCase())}
                                className="textarea textarea-bordered w-full"
                                placeholder="Enter access information or special instructions..."
                                rows={3}
                            />
                        </div>

                        {error && (
                            <div className="alert alert-error mt-4">
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="modal-action">
                            <button className="btn btn-primary" onClick={handleUpdate}>
                                Save Changes
                            </button>
                            <button className="btn" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showToast && (
                <div className="toast toast-end">
                    <div className="alert alert-success">
                        <span>Plus code copied to clipboard!</span>
                    </div>
                </div>
            )}
        </div>
    );
}