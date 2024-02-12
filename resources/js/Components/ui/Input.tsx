import { InputHTMLAttributes } from 'react';
import { UseFormRegister } from "react-hook-form"
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hideLabel?: boolean;
  id: string;
  name?: string;
  type?: string;
  wrapperClass?: string;
  labelPosition?: 'top' | 'left';
  error?: string | boolean;
  required?: boolean;
  register: UseFormRegister<any>;
}

const Input = ({
    label,
    id,
    register,
    required = false,
    hideLabel = false,
    error = '',
    wrapperClass = '',
    labelPosition = 'top',
    type = 'text',
    name = '',
    ...rest
}: InputProps) => {
    const inputName = name || label.toLowerCase().replace(' ', '_');
    return (
        <div className={clsx(
            labelPosition === 'left' && 'flex items-center gap-3',
            wrapperClass,
        )}>
            <label
                htmlFor={id}
                className={clsx(
                    'block text-sm font text-gray-900 dark:text-white font-bold',
                    hideLabel && 'sr-only',
                    labelPosition === 'top' && 'mb-2'
                )}
            >
                {label}{required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                id={id}
                className={clsx(
                    'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
                    { '!border-red-500': !!error }
                )}
                {...rest}
                {...register(inputName, { required })}
                aria-invalid={!!error}
            />
            {error && <p role="alert" className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default Input;
