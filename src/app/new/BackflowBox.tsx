import {BackflowList} from "@/components/types/job";
import {Trash2} from "lucide-react";

export default function BackflowBox({
                                        backflowList,
                                        onUpdateBackflows
                                    }: {
    backflowList: BackflowList;
    onUpdateBackflows: (updatedBackflows: BackflowList) => void;
}) {

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
                    <p className="text-center text-gray-500">No backflows available</p>
                ) : (
                    <ul className="space-y-2">
                        {Object.entries(backflowList).map(([id, backflow]) => (
                            <li key={id} className="flex justify-between items-center">
                                <span>{backflow.deviceInfo.serialNo}</span>
                                <button
                                    type="button"
                                    className="btn btn-error btn-sm"
                                    onClick={() => handleBackflowRemove(id)}
                                >
                                    <Trash2 className="h-4 w-4"/>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
