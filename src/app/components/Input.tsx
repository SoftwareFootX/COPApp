interface InputProps {
  label: string;
  name: string;
  value: string | number;
  placehodler?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
}

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "number",
  disabled = false,
  placehodler = "",
}: InputProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
      disabled={disabled}
      type={type}
      placeholder={placehodler}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded border border-gray-200 px-3 py-2
        focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm h-10 cursor-pointer"
    />
  </div>
);

export { Input };
