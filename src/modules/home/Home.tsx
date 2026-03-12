import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { TbBuildingCommunity } from "react-icons/tb";
import { LuLayoutDashboard } from "react-icons/lu";
import { TbBrandReact } from "react-icons/tb";

import { AccessButton } from "../../app/components/AccessButton";
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
      access: user?.usu_app_footx_desarrollador === 1,
    },
    {
      title: "TableroML",
      icon: <LuLayoutDashboard size={iconSize} />,
      route: "/TableroML",
      access: user?.usu_app_footx_desarrollador === 1,
    },
    {
      title: "FootXSystem",
      icon: <TbBrandReact size={iconSize} />,
      route: "/FootXSystem",
      access: user?.usu_app_footx_desarrollador === 1,
    },
  ];
  return (
    <div className="w-full h-full p-4 flex bg-linear-to-br from-primary/10">
      <div
        className="
          grid flex-1
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          xl:grid-cols-6
          auto-rows-fr
          gap-2
          sm:gap-3
          md:gap-4
          mt-4
          ml-2
          sm:ml-4
          "
      >
        {botones.map((item: any, index: number) => (
          <AccessButton
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
