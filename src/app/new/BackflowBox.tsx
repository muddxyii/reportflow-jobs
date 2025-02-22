import {BackflowList} from "@/components/types/job";
import {Pencil, Trash2} from "lucide-react";

export default function BackflowBox({
                                        backflowList,
                                        onUpdateBackflows
                                    }: {
    backflowList: BackflowList;
    onUpdateBackflows: (updatedBackflows: BackflowList) => void;
}) {

    const handleBackflowEdit = (id: string) => {
        // TODO: Impl backflow editing logic
    }

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
        </div>
    );
}
