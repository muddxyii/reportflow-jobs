﻿import {ChangeEvent} from "react";
import CollapsibleSection from "@/components/collapsible-section";
import {FacilityOwnerInfo, RepresentativeInfo} from "@/components/types/customer";

interface CustomerInfoFormProps {
    facilityOwnerInfo: FacilityOwnerInfo;
    representativeInfo: RepresentativeInfo;
    onFacilityOwnerChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onRepresentativeChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function CustomerInfoForm({
                                             facilityOwnerInfo,
                                             representativeInfo,
                                             onFacilityOwnerChange,
                                             onRepresentativeChange
                                         }: CustomerInfoFormProps) {
    return (
        <div className="space-y-4">
            <CollapsibleSection title="Facility Owner Details">
                <div className="space-y-4">
                    <input
                        type="text"
                        name="owner"
                        placeholder="Facility/Owner"
                        className="input input-bordered w-full"
                        value={facilityOwnerInfo.owner || ""}
                        onChange={onFacilityOwnerChange}
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        className="input input-bordered w-full"
                        value={facilityOwnerInfo.address || ""}
                        onChange={onFacilityOwnerChange}
                    />
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        className="input input-bordered w-full"
                        value={facilityOwnerInfo.email || ""}
                        onChange={onFacilityOwnerChange}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="contact"
                            placeholder="Contact"
                            className="input input-bordered w-full"
                            value={facilityOwnerInfo.contact || ""}
                            onChange={onFacilityOwnerChange}
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            className="input input-bordered w-full"
                            value={facilityOwnerInfo.phone || ""}
                            onChange={onFacilityOwnerChange}
                        />
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Representative Details">
                <div className="space-y-4">
                    <input
                        type="text"
                        name="owner"
                        placeholder="Owner Representative"
                        className="input input-bordered w-full"
                        value={representativeInfo.owner || ""}
                        onChange={onRepresentativeChange}
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        className="input input-bordered w-full"
                        value={representativeInfo.address || ""}
                        onChange={onRepresentativeChange}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="contact"
                            placeholder="Contact"
                            className="input input-bordered w-full"
                            value={representativeInfo.contact || ""}
                            onChange={onRepresentativeChange}
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            className="input input-bordered w-full"
                            value={representativeInfo.phone || ""}
                            onChange={onRepresentativeChange}
                        />
                    </div>
                </div>
            </CollapsibleSection>
        </div>
    );
}