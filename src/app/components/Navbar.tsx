import { CiLogout } from "react-icons/ci";
import { useAuthStore } from "../store/useStore";
import { cop_logo } from "../../../public";

const Navbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="w-full h-14 bg-slate-50 flex items-center fixed">
      {user && (
        <div className="w-full max-w-5xl mx-auto flex justify-between items-center px-4 sm:px-10">
          <span className="font-semibold text-gray-700 truncate text-xs sm:text-md">
            {user.usu_nombre} {user.usu_apellido}
          </span>

          <button
            onClick={logout}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 text-xs sm:text-md cursor-pointer"
          >
            Salir
            <CiLogout size={20} />
          </button>
        </div>
      )}

      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <img src={cop_logo} className="h-8" />
      </div>
    </div>
  );
};

export { Navbar };
