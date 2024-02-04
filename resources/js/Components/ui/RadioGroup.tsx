import React from 'react';

interface Choice {
    id: string;
    name: string;
}

interface RadioProps {
    id: string;
    label: string;
    name: string;
    className?: string;
}

interface RadioGroupProps {
    choices: Choice[];
    layout: 'vertical' | 'horizontal';
    groupName: string;
}

const Radio = ({ id, label, name, className = '', ...props }: RadioProps) => (
    <div className={`${className} flex items-center`}>
        <input
            {...props}
            type="radio"
            id={id}
            name={name}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label htmlFor={id} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            {label}
        </label>
    </div>
);

const RadioGroup = ({ choices, layout, groupName }: RadioGroupProps) => {
    return (
        <div className={layout === 'horizontal' ? 'flex' : 'flex flex-col'}>
            {choices.map((choice) => (
                <Radio
                    key={choice.id}
                    id={choice.id}
                    label={choice.name}
                    name={groupName}
                    className={layout === 'horizontal' ? 'mr-4' : 'mb-4'}
                />
            ))}
        </div>
    );
};

export default RadioGroup;
