import React, {ChangeEvent} from 'react';

interface JobTypeSelectorProps {
    selectedJobType: string;
    onChange: (value: string) => void;
}

const JobTypeSelector: React.FC<JobTypeSelectorProps> = ({selectedJobType, onChange}) => {
    const jobTypes = ['New Test', 'Annual Test', 'Service Call', 'Repair', 'Replacement'];

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className="form-control w-full mb-2">
            <label className="label">
                <span className="text-xl font-semibold">Job Type</span>
            </label>
            <div className="flex flex-wrap gap-4">
                {jobTypes.map((type) => (
                    <label
                        key={type}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <input
                            type="radio"
                            name="jobType"
                            value={type}
                            checked={selectedJobType === type}
                            onChange={handleChange}
                            className="radio radio-primary"
                        />
                        <span className="text-base">{type}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default JobTypeSelector;