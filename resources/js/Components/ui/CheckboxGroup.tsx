import { InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

const Checkbox = ({ className = '', ...props }: CheckboxProps) => (
    <input
        {...props}
        type="checkbox"
        className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${className}`}
    />
);

interface Choice {
    id: string;
    name: string;
}

interface CheckboxGroupProps {
    choices: Choice[];
    layout: 'vertical' | 'horizontal';
}

const CheckboxGroup = ({ choices, layout }: CheckboxGroupProps) => (
    <div className={layout === 'horizontal' ? 'flex' : 'flex flex-col'}>
        {choices.map((choice) => (
            <div key={choice.id} className={layout === 'horizontal' ? 'flex items-center me-4' : 'flex items-center mb-4'}>
                <Checkbox id={choice.id} />
                <label htmlFor={choice.id} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {choice.name}
                </label>
            </div>
        ))}
    </div>
);

export default CheckboxGroup;
