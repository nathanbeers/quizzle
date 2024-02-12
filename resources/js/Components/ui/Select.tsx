import { UseFormRegister } from 'react-hook-form';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  name: string;
  options: SelectOption[];
  register: UseFormRegister<any>;
  className?: string;
  defaultValue?: string;
  required?: boolean;
  error?: string | boolean;
}

const Select = ({ label, name, options, register, className, defaultValue, required = false, error = '' }: SelectProps) => {
  return (
    <>
      <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        {...register(name)}
        defaultValue={defaultValue}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${className}`}
      >
        {/* set a disabled sselect option first */}
        <option value="" disabled>Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p role="alert" className="text-red-500 text-xs mt-1">{error}</p>}
    </>
  );
};

export default Select;
