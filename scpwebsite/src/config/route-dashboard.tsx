import DashboardIcon from "@mui/icons-material/Dashboard";

import Dashboard from "@/Components/Dashboard";

import { RouteConfig } from "@/types/layoutInterfaces";

const routes: RouteConfig[] = [
  {
    name: "Dashboard",
    key: "Dashboard",
    route: "/dashboard",
    permission: "Dashboard",
    layout: "/",
    icon: <DashboardIcon />,
    component: <Dashboard />,
  },
];

export default routes;
