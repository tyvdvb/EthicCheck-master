import { ErrorMessage } from "@hookform/error-message";
import { FieldErrors, RegisterOptions, UseFormRegister } from "react-hook-form";

interface IFormTextFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  validation?: RegisterOptions<any, string> | undefined;
  errors?: FieldErrors;
  className?: string;
  disabled?: boolean;
}

export const FormTextField = ({
  label,
  name,
  register,
  errors,
  validation,
  disabled,
  placeholder,
  className,
}: IFormTextFieldProps) => {
  return (
    <div className={`md:flex md:items-center ${className}`}>
      {label && (
        <div>
          <label className="block md:text-right mb-1 md:mb-0 pr-4">
            {label}
          </label>
        </div>
      )}
      <div className="flex-1">
        <textarea
          {...register(name, validation)}
          placeholder={placeholder}
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          disabled={disabled}
        />
      </div>
      <ErrorMessage errors={errors} name={name} />
    </div>
  );
};
