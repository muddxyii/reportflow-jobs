import {Backflow, BackflowList} from "@/components/types/job";
import {Pencil, Trash2} from "lucide-react";
import {useState} from "react";

export default function BackflowBox({
                                        backflowList,
                                        onUpdateBackflows
                                    }: {
    backflowList: BackflowList;
    onUpdateBackflows: (updatedBackflows: BackflowList) => void;
}) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string>("");
    const [editingBackflow, setEditingBackflow] = useState<Backflow>(Backflow.empty);
    const [error, setError] = useState<string>("");

    const handleBackflowEdit = (id: string) => {
        setEditingId(id);
        setEditingBackflow(backflowList[id]);
        setIsEditModalOpen(true);
        setError("");
    };

    const handleUpdate = () => {
        if (!editingBackflow.deviceInfo.serialNo.trim()) {
            setError("Serial number cannot be empty");
            return;
        }

        const updatedBackflows = {...backflowList};
        updatedBackflows[editingId] = editingBackflow;
        onUpdateBackflows(updatedBackflows);
        setIsEditModalOpen(false);
        setError("");
    };

    const handleCancel = () => {
        setIsEditModalOpen(false);
        setEditingBackflow(Backflow.empty);
        setEditingId("");
        setError("");
    };

    const handleBackflowRemove = (id: string) => {
        const updatedBackflows = {...backflowList};
        delete updatedBackflows[id];
        onUpdateBackflows(updatedBackflows);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Backflows</h2>
            <div className="border-2 rounded-lg p-4">
                {Object.keys(backflowList).length === 0 ? (
                    <p className="text-center text-gray-500">No backflows available.<br/>Convert some PDFs to get
                        started.</p>
                ) : (
                    <ul className="space-y-2">
                        {Object.entries(backflowList).map(([id, backflow]) => (
                            <li key={id} className="flex justify-between items-center">
                                <span>{backflow.deviceInfo.serialNo}</span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-warning btn-sm"
                                        onClick={() => handleBackflowEdit(id)}
                                    >
                                        <Pencil className="h-4 w-4"/>
                                    </button>
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
            {isEditModalOpen && editingBackflow && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Edit Backflow</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Serial Number
                                </label>
                                <input
                                    type="text"
                                    value={editingBackflow.deviceInfo.serialNo}
                                    onChange={(e) => {
                                        setError("");
                                        setEditingBackflow({
                                            ...editingBackflow,
                                            deviceInfo: {
                                                ...editingBackflow.deviceInfo,
                                                serialNo: e.target.value
                                            }
                                        });
                                    }}
                                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
                                ${error ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {error && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {error}
                                    </p>
                                )}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleUpdate}
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
