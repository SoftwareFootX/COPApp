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

const AccessButton = ({ data }: Props) => {
  const { title, icon, route, access } = data;
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(route)}
      className={`
    shadow-md
    cursor-pointer
    rounded-3xl
    bg-white
    hover:bg-slate-50
    flex flex-col
    items-center
    justify-center
    text-gray-700
    ${!access && "hidden"}

    h-28 w-full
    sm:h-40 sm:w-40
    md:h-44 md:w-44
    lg:h-50 lg:w-50
    xl:h-56 xl:w-56

    p-4
    sm:p-5
    md:p-6
    gap-2
  `}
    >
      {icon}
      <span className="font-medium">{title}</span>
    </button>
  );
};

export { AccessButton };
