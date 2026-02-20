import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface ButtonSideBarProps {
  children: ReactNode;
  open: boolean;
  setOpenSideBar: (value: boolean) => void;
  title: string;
  route: string;
}

const ButtonSideBar = ({
  children,
  open,
  setOpenSideBar,
  title,
  route,
}: ButtonSideBarProps) => {
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const location = (route: string) => {
    switch (route) {
      case "/":
        return "Home";
      case "/COPAdmin":
        return "COPAdmin";
      case "/COP3eros":
        return "COP3eros";
      case "/TableroML":
        return "TableroML";
      case "/FootXSystem":
        return "FootXSystem";

      default:
        return "/";
    }
  };

  return (
    <button
      onClick={() => {
        setOpenSideBar(false);
        navigate(route);
      }}
      className={`flex items-center gap-2 rounded-xl  ${
        title === location(pathname)
          ? "bg-primary text-white"
          : "bg-white text-primary"
      }  px-1 xs:px-2  py-1 xs:py-2 hover:bg-primary-opacity w-full items-center justify-center cursor-pointer shadow-md`}
    >
      {children}
      {open && <span>{title}</span>}
    </button>
  );
};

export { ButtonSideBar };
