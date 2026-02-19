interface PickerProps<T> {
  options: T[];
  getValue: (item: T) => string | number;
  getLabel: (item: T) => string;

  value: string | number;
  name: string;
  onChange: (name: string, value: string | number) => void;

  label?: string;
  id?: string;
}

const Picker = <T,>({
  options,
  getValue,
  getLabel,
  value,
  name,
  onChange,
  label,
  id,
}: PickerProps<T>) => {
  const selectId = id ?? name;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-gray-600">
          {label}
        </label>
      )}

      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(name, Number(e.target.value))}
        className="w-full rounded border border-gray-300 px-3 py-2 h-10 cursor-pointer"
      >
        <option value="">Seleccione una opción</option>

        {options.map((item) => (
          <option key={getValue(item)} value={getValue(item)}>
            {getLabel(item)}
          </option>
        ))}
      </select>
    </div>
  );
};

export { Picker };
