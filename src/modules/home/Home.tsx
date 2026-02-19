import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { TbBuildingCommunity } from "react-icons/tb";
import { LuLayoutDashboard } from "react-icons/lu";
import { TbBrandReact } from "react-icons/tb";

import { AccesButton } from "../../app/components/AccesButton";
import { useAuthStore } from "../../app/store/useStore";

const iconSize = 50;

const Home = () => {
  const { user } = useAuthStore();

  const botones = [
    {
      title: "COPAdmin",
      icon: <MdOutlineAdminPanelSettings size={iconSize} />,
      route: "/COPAdmin",
      access: user?.usu_app_footx_administrador === 1,
    },
    {
      title: "COP3eros",
      icon: <TbBuildingCommunity size={iconSize} />,
      route: "/COP3eros",
      access: true,
    },
    {
      title: "TableroML",
      icon: <LuLayoutDashboard size={iconSize} />,
      route: "/TableroML",
      access: true,
    },
    {
      title: "FootXSystem",
      icon: <TbBrandReact size={iconSize} />,
      route: "/FootXSystem",
      access: true,
    },
  ];
  return (
    <div className="w-full h-full p-4 flex bg-linear-to-br from-primary/10">
      <div className="grid flex-1 sm:grid-cols-2 grid-cols-1 auto-rows-fr gap-2 sm:gap-4 mt-4 sm:ml-4 ml-2">
        {botones.map((item: any, index: number) => (
          <AccesButton
            key={index}
            data={{
              title: item.title,
              icon: item.icon,
              route: item.route,
              access: item.access,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export { Home };
