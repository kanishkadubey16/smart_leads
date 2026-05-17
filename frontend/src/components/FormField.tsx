import React from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  registration: UseFormRegisterReturn;
  options?: { value: string; label: string }[]; // For select dropdowns
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  placeholder,
  error,
  registration,
  options,
}) => {
  const hasError = !!error;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-slate-600 font-medium">
        {label}
      </label>
      
      {options ? (
        <select
          {...registration}
          className={`w-full px-4 py-3 bg-white border ${
            hasError
              ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
              : 'border-slate-200 focus:ring-blue-100 focus:border-blue-500'
          } rounded-xl text-sm text-slate-800 font-medium transition-all duration-200 outline-none focus:ring-4 appearance-none relative`}
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right 1rem center',
            backgroundSize: '1.25rem',
            backgroundRepeat: 'no-repeat',
            paddingRight: '2.5rem'
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          {...registration}
          className={`w-full px-4 py-3 bg-white border ${
            hasError
              ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
              : 'border-slate-200 focus:ring-blue-100 focus:border-blue-500'
          } rounded-xl text-sm text-slate-800 transition-all duration-200 outline-none focus:ring-4 placeholder-slate-400`}
        />
      )}

      {hasError && (
        <span className="text-xs text-red-500 font-medium mt-0.5">{error}</span>
      )}
    </div>
  );
};
export default FormField;
