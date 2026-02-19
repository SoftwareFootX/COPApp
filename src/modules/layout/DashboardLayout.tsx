import { Outlet } from "react-router-dom";

import { SideBar } from "../../app/components/SideBar";
import { Navbar } from "../../app/components/Navbar";

const DashboardLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <SideBar />
        <main className="flex-1 overflow-auto mt-10 ml-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export { DashboardLayout };
