import { AccessButton } from "../../../app/components/AccessButton";
import { Container } from "../../../ui/components";

import { TbCalendarCog } from "react-icons/tb";
import { LuCalendarArrowDown } from "react-icons/lu";
import { MdMessage } from "react-icons/md";
import {
  FaClipboardList,
  FaCashRegister,
  FaFileMedical,
  FaExchangeAlt,
  FaUserCheck,
  FaUserPlus,
  FaIdCard,
  FaGift,
} from "react-icons/fa";

import { useAuthStore } from "../../../app/store/useStore";

const iconSize = 40;

const CopAdmin = () => {
  const { user } = useAuthStore();

  const botones = [
    {
      title: "Nuevo turno",
      route: "/COPAdmin",
      icon: <FaUserPlus size={iconSize} />,
      access: user?.usu_app_footx_desarrollador === 1,
    },
    {
      title: "Consultar turnos",
      route: "/COP3eros",
      icon: <FaClipboardList size={iconSize} />,
      access: user?.usu_app_footx_desarrollador === 1,
    },
    {
      title: "Recepción de paciente",
      route: "/TableroML",
      icon: <FaUserCheck size={iconSize} />,
      access: user?.usu_app_footx_desarrollador === 1,
    },
    {
      title: "Ordenes de trabajo",
      route: "/FootXSystem",
      icon: <FaFileMedical size={iconSize} />,
      access: user?.usu_app_footx_desarrollador === 1,
    },
    {
      title: "Ver ficha",
      route: "/FootXSystem",
      icon: <FaIdCard size={iconSize} />,
      access: user?.usu_app_footx_desarrollador === 1,
    },
    {
      title: "Caja",
      route: "/FootXSystem",
      icon: <FaCashRegister size={iconSize} />,
      access: user?.usu_app_footx_desarrollador === 1,
    },
    {
      title: "Recibir / Entregar OTs",
      route: "/FootXSystem",
      icon: <FaExchangeAlt size={iconSize} />,
      access: user?.usu_app_footx_desarrollador === 1,
    },
    {
      title: "Gift Cards",
      route: "/FootXSystem",
      icon: <FaGift size={iconSize} />,
      access: user?.usu_app_footx_desarrollador === 1,
    },
    {
      title: "Mensajes a 3eros",
      route: "/FootXSystem",
      icon: <MdMessage size={iconSize} />,
      access: user?.usu_app_footx_desarrollador === 1,
    },
    {
      title: "Admin Turnos",
      route: "/AdminTurnos",
      icon: <TbCalendarCog size={iconSize} />,
      access: user?.usu_app_footx_administrador === 1,
    },
    {
      title: "Reporte de Turnos",
      route: "/ReportesTurnos",
      icon: <LuCalendarArrowDown size={iconSize} />,
      access: user?.usu_app_footx_administrador === 1,
    },
  ];

  return (
    <Container>
      <div className="grid flex-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 grid-cols-2 auto-rows-fr gap-2 sm:gap-4 mt-4 sm:ml-4 ml-2">
        {botones.map((item: any, index: number) => (
          <AccessButton
            key={index}
            data={{
              title: item.title,
              route: item.route,
              icon: item.icon,
              access: item.access,
            }}
          />
        ))}
      </div>
    </Container>
  );
};

export { CopAdmin };
