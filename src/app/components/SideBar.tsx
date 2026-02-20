import { useState, useMemo } from "react";

import { RiExpandRightLine, RiExpandLeftLine } from "react-icons/ri";
import { TbBuildingCommunity, TbBrandReact } from "react-icons/tb";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { HiOutlineHome } from "react-icons/hi2";

import { ButtonSideBar } from "./ButtonSideBar";

interface MenuItem {
  title: string;
  route: string;
  icon: React.ReactNode;
}

const SideBar = () => {
  const [openSideBar, setOpenSideBar] = useState(false);

  const menuItems: MenuItem[] = useMemo(
    () => [
      { title: "Home", route: "/", icon: <HiOutlineHome size={20} /> },
      {
        title: "COPAdmin",
        route: "/COPAdmin",
        icon: <MdOutlineAdminPanelSettings size={20} />,
      },
      {
        title: "COP3eros",
        route: "/COP3eros",
        icon: <TbBuildingCommunity size={20} />,
      },
      {
        title: "TableroML",
        route: "/TableroML",
        icon: <LuLayoutDashboard size={20} />,
      },
      {
        title: "FootXSystem",
        route: "/FootXSystem",
        icon: <TbBrandReact size={20} />,
      },
    ],
    [],
  );

  return (
    <aside
      className={`
        mt-14 fixed z-10 h-screen flex flex-col gap-4 py-5 px-2
        items-center text-sm bg-slate-50
        transition-all duration-300 ease-in-out
        ${openSideBar ? "w-48" : "w-12 sm:w-14"}
      `}
    >
      <button
        onClick={() => setOpenSideBar((prev) => !prev)}
        className="flex items-center justify-center w-full gap-2 px-2 py-2 bg-white rounded-xl text-primary cursor-pointer hover:bg-primary-opacity shadow-md"
      >
        {openSideBar ? (
          <RiExpandLeftLine size={20} />
        ) : (
          <RiExpandRightLine size={20} />
        )}
      </button>

      {menuItems.map(({ title, route, icon }) => (
        <ButtonSideBar
          key={route}
          title={title}
          route={route}
          open={openSideBar}
          setOpenSideBar={setOpenSideBar}
        >
          {icon}
        </ButtonSideBar>
      ))}
    </aside>
  );
};

export { SideBar };
