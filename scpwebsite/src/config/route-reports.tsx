import AssessmentIcon from "@mui/icons-material/Assessment";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

import TransactionReport from "@/Components/Reports/TransactionReport";
import IndividualLedger from "@/Components/Reports/IndividualLedgerReport";

import { RouteConfig } from "@/types/layoutInterfaces";

const routes: RouteConfig[] = [
  {
    name: "Reports",
    key: "Reports",
    route: "/reports",
    layout: "/",
    icon: <AssessmentIcon />,
    component: null,
    childs: [
      {
        name: "Transactions",
        key: "Transactions",
        route: "/reports/transactions",
        permission: "Transactions",
        layout: "/reports",
        icon: <DescriptionIcon />,
        component: <TransactionReport />,
      },
      {
        name: "Individual Ledger",
        key: "IL",
        route: "/reports/individual-ledger",
        permission: "IL",
        layout: "/reports",
        icon: <AccountBoxIcon />,
        component: <IndividualLedger />,
      },
    ],
  },
];

export default routes;
