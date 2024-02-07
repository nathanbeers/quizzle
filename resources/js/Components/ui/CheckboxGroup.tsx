import { ReactNode } from "react";
import { UseFormRegister } from "react-hook-form"
import clsx from "clsx";

interface CheckboxProps {
    id: string;
    label: string;
    name: string;
    value: string;
    register: UseFormRegister<any>;
    className?: string;
    required?: boolean;
    checked?: boolean;
}

interface CheckboxGroupProps {
    layout: 'vertical' | 'horizontal';
    children: ReactNode;
    legend: string | ReactNode;
    error?: string;
    className?: string;
    required?: boolean;
}

const Checkbox = ({ id, label, name, register, value, required = false, className = '', ...props }: CheckboxProps) => (
    <div className={`flex items-center ${className}`}>
        <input
            {...register(name, { required })}
            id={id}
            type="checkbox"
            value={value}
            {...props}
            className={clsx(
                'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600',
                'checked:ring-2 checked:dark:ring-offset-gray-800'
            )}
        />
        <label htmlFor={id} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            {label}
        </label>
    </div>
);

const CheckboxGroup = ({ layout, children, legend, required = false, className = '', error = '' }: CheckboxGroupProps) => {
    return (
        <fieldset className="block mb-3 text-sm font-medium text-gray-900 dark:text-white">
            <legend className="font-bold mb-2">
                {legend}
                {required && <span className="text-red-500">*</span>}
            </legend>
            <div className={clsx(
                layout === 'horizontal' ? 'flex' : 'flex flex-col',
                className,
            )}>
                {children}
            </div>
            {error && <p role="alert" className="text-red-500 text-xs mt-1">{error}</p>}
        </fieldset>
    );
};

export { CheckboxGroup, Checkbox };
