import { InputHTMLAttributes } from 'react';
import { UseFormRegister } from "react-hook-form"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  register: UseFormRegister<any>;
  required: boolean;
}

const Input = ({ label, id, register, required = false, ...props }: InputProps) => (
  <div>
    <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {label}
    </label>
    <input
      {...props}
      type="text" // You can make this prop flexible by including it in InputProps if needed.
      id={id}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gra
      y-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      {...register(label, { required })}
    />
  </div>
);

export default Input;
