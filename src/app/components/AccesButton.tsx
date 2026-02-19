import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  data: {
    title: string;
    icon?: ReactNode;
    route: string;
    access: boolean;
  };
}

const AccesButton = ({ data }: Props) => {
  const { title, icon, route, access } = data;
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(route)}
      className={`shadow-md rounded-xl p-6 cursor-pointer ${!access && "hidden"} hover:bg-slate-50 flex flex-col items-center justify-center gap-2 text-gray-700 bg-white max-h-78`}
    >
      {icon}
      <span className="font-medium">{title}</span>
    </button>
  );
};

export { AccesButton };
