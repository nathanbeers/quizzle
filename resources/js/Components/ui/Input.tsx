import { InputHTMLAttributes } from 'react';
import { UseFormRegister } from "react-hook-form"
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  name?: string;
  type?: string;
  error: string | boolean;
  register: UseFormRegister<any>;
  required: boolean;
}

const Input = ({ label, id, register, required = false, error = '', type = 'text', name = label, ...rest }: InputProps) => (
  <div>
    <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}{required && <span className="text-red-500">*</span>}
    </label>
    <input
        type={type}
        id={id}
        className={clsx(
            'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
            { '!border-red-500': !!error }
        )}
        {...rest}
        {...register(name, { required })}
        aria-invalid={!!error}
    />
    {error && <p role="alert" className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default Input;
