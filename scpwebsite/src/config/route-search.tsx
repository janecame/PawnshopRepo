import SearchIcon from "@mui/icons-material/Search";
import GavelIcon from "@mui/icons-material/Gavel";
import ReceiptIcon from "@mui/icons-material/Receipt";

import ReadyForAuction from "@/Components/Search/ReadyForAuction";
import SearchTransaction from "@/Components/Search/SearchTransaction";

import { RouteConfig } from "@/types/layoutInterfaces";

const routes: RouteConfig[] = [
  {
    name: "Search",
    key: "Search",
    route: "/search",
    layout: "/",
    icon: <SearchIcon />,
    component: null,
    childs: [
      {
        name: "Ready For Auction",
        key: "RA",
        route: "/search/ready-for-auction",
        permission: "RA",
        layout: "/search",
        icon: <GavelIcon />,
        component: <ReadyForAuction />,
      },
      {
        name: "Search Transaction",
        key: "ST",
        route: "/search/search-transaction",
        permission: "ST",
        layout: "/search",
        icon: <ReceiptIcon />,
        component: <SearchTransaction />,
      },
    ],
  },
];

export default routes;
