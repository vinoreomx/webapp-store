import type {
  FieldValues,
  ControllerRenderProps,
  Path
} from 'react-hook-form'

interface Props<T extends FieldValues, fieldName extends Path<T>> {
  field: ControllerRenderProps<T, fieldName>;
  options: { value: string; label: string }[];
  label: string;
  disabled?: boolean;
  className?: string;
  type?: 'checkbox' | 'radio';
}

export const RadioGroup = <T extends FieldValues, fieldName extends Path<T>>({
  field,
  options,
  label,
  disabled,
  className,
  type,
}: Props<T, fieldName>) => {
  return (
    <div className={className}>
      <label htmlFor={label} className="form-label font-bold">
        {label}
      </label>
      {options.map((option) => (
        <label key={option.value}>
          <input
            type={type || 'radio'}
            {...field}
            value={option.value}
            checked={field.value === option.value}
            disabled={disabled}
            className="mr-2"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};
