import {ChangeEvent} from "react";

export const facilityOwnerFields = [
    { name: "FacilityOwner", placeholder: "Facility/Owner" },
    { name: "Address", placeholder: "Address" },
    { name: "Email", placeholder: "Email" },
    { name: "Contact", placeholder: "Contact", sideBySide: true },
    { name: "Phone", placeholder: "Phone", sideBySide: true }
];

export const representativeFields = [
    { name: "OwnerRep", placeholder: "Owner Representative" },
    { name: "RepAddress", placeholder: "Rep Address" },
    { name: "PersontoContact", placeholder: "Contact", sideBySide: true },
    { name: "Phone-0", placeholder: "Phone", sideBySide: true }
];

export default function CustomerInfoForm({fields, customerInfo, onChange}: {
    fields: { name: string; placeholder: string; sideBySide?: boolean }[];
    customerInfo: Record<string, string>;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
    const groupedFields = fields.reduce<Array<Array<typeof fields[0]>>>((acc, field) => {
        if (field.sideBySide && fields[fields.indexOf(field) + 1]?.sideBySide) {
            acc.push([field, fields[fields.indexOf(field) + 1]]);
            return acc;
        }
        if (!field.sideBySide && !fields[fields.indexOf(field) - 1]?.sideBySide) {
            acc.push([field]);
        }
        return acc;
    }, []);

    return (
        <div className="space-y-4">
            {groupedFields.map((group, index) => (
                <div key={index} className={`grid ${group.length > 1 ? 'grid-cols-2 gap-4' : 'grid-cols-1'}`}>
                    {group.map(field => (
                        <input
                            key={field.name}
                            type="text"
                            name={field.name}
                            placeholder={field.placeholder}
                            className="input input-bordered w-full"
                            value={customerInfo[field.name] || ""}
                            onChange={onChange}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

