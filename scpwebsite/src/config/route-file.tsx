import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import BusinessIcon from "@mui/icons-material/Business";
import EventIcon from "@mui/icons-material/Event";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import Company from "@/Components/File/Company";
import SecurityDate from "@/Components/File/SecurityDate";
import Reset from "@/Components/File/Reset";

import { RouteConfig } from "@/types/layoutInterfaces";

const routes: RouteConfig[] = [
  {
    name: "File",
    key: "File",
    route: "/file",
    layout: "/",
    icon: <FolderOpenIcon />,
    component: null,
    childs: [
      {
        name: "Company",
        key: "Company",
        route: "/file/company",
        permission: "Company",
        layout: "/file",
        icon: <BusinessIcon />,
        component: <Company />,
      },
      {
        name: "Security Date",
        key: "SecDate",
        route: "/file/security-date",
        permission: "SecDate",
        layout: "/file",
        icon: <EventIcon />,
        component: <SecurityDate />,
      },
      {
        name: "Reset",
        key: "Reset",
        route: "/file/reset",
        permission: "Reset",
        layout: "/file",
        icon: <RestartAltIcon />,
        component: <Reset />,
      },
    ],
  },
];

export default routes;
