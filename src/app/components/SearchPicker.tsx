import Select from "react-select";

interface SearchPickerProps<T> {
  options: T[];
  getValue: (item: T) => number | string;
  getLabel: (item: T) => string;

  value: number | string | null;
  name: string;

  onChange: (name: string, value: number | string | null) => void;

  label?: string;
  placeholder?: string;
  isClearable?: boolean;
}

const SearchPicker = <T,>({
  options,
  getValue,
  getLabel,
  value,
  name,
  onChange,
  label,
  placeholder = "Buscar...",
  isClearable = true,
}: SearchPickerProps<T>) => {
  const selectOptions = options.map((o) => ({
    value: getValue(o),
    label: getLabel(o),
  }));

  const selectedOption = selectOptions.find((o) => o.value === value) ?? null;

  const roundedStyles = {
    control: (base: any) => ({
      ...base,
      borderRadius: "0.25rem",
      minHeight: "40px",
      boxShadow: "none",
      borderColor: "#e5e7eb",
      ":hover": {
        borderColor: "#d1d5db",
        cursor: "pointer",
      },
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: "0.75rem",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? "rgba(59,130,246,0.1)" : "white",
      color: "#374151",
    }),
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-600">{label}</label>
      )}

      <Select
        options={selectOptions}
        value={selectedOption}
        onChange={(opt) => onChange(name, opt ? opt.value : null)}
        placeholder={placeholder}
        isClearable={isClearable}
        isSearchable
        classNamePrefix="react-select"
        styles={roundedStyles}
      />
    </div>
  );
};

export { SearchPicker };
