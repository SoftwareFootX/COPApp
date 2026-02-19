const roundedStyles = {
  control: (base: any) => ({
    ...base,
    borderRadius: "0.75rem", // rounded-xl
    minHeight: "40px",
    boxShadow: "none",
    borderColor: "#e5e7eb",
    ":hover": {
      borderColor: "#d1d5db",
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

export { roundedStyles };
