import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import GroupsIcon from "@mui/icons-material/Groups";

import Group from "@/Components/Security/Group";
import Users from "@/Components/Security/Users";
import UsersForm from "@/Components/Security/UsersForm";
import Permission from "@/Components/Security/Permission";

import { RouteConfig } from "@/types/layoutInterfaces";

const routes: RouteConfig[] = [
  {
    name: "Security",
    key: "Security",
    route: "/security",
    layout: "/",
    icon: <ShieldOutlinedIcon />,
    component: null,
    childs: [
      {
        name: "Group",
        key: "Group",
        route: "/security/group",
        permission: "Group",
        layout: "/security",
        icon: <GroupsIcon />,
        component: <Group />,
      },
      {
        name: "Users",
        key: "Users",
        route: "/security/users",
        permission: "Users",
        layout: "/security",
        icon: <PeopleOutlinedIcon />,
        component: <Users />,
      },
      {
        name: "Users Form",
        key: "UsersForm",
        route: "/security/users/:id",
        layout: "/security",
        icon: <PeopleOutlinedIcon />,
        component: <UsersForm />,
        noDisplay: true,
      },
      {
        name: "Permission",
        key: "Permission",
        route: "/security/permission",
        permission: "Permission",
        layout: "/security",
        icon: <LockPersonIcon />,
        component: <Permission />,
      },
    ],
  },
];

export default routes;
