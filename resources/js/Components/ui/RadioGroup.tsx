import { ReactNode } from "react";
import { UseFormRegister } from "react-hook-form"

interface Choice {
    id: string;
    name: string;
}

interface RadioProps {
    id: string;
    label: string;
    name: string;
    className?: string;
    register: UseFormRegister<any>;
    required: boolean;
    checked?: boolean;
}

interface RadioGroupProps {
    layout: 'vertical' | 'horizontal';
    error?: string;
    children: ReactNode;
    legend: string;
}

const Radio = ({ id, label, name, register, required, ...props }: RadioProps) => (
    <div className={`${props.className || ''} flex items-center`}>
        <input
            {...register(name, { required })}
            id={id}
            type="radio"
            value={label}
            {...props}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label htmlFor={id} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            {label}
        </label>
    </div>
  );

const RadioGroup = ({ layout, children, legend, error = '' }: RadioGroupProps) => {
    return (
        <fieldset className="block mb-3 text-sm font-medium text-gray-900 dark:text-white">
            <legend>{legend}</legend>
            <div className={layout === 'horizontal' ? 'flex' : 'flex flex-col'}>
                {children}
            </div>
            {error && <p role="alert" className="text-red-500 text-xs mt-1">{error}</p>}
        </fieldset>
    );
};

export { RadioGroup, Radio };
