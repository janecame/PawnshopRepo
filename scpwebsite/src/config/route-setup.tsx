import SettingsIcon from "@mui/icons-material/Settings";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import PercentIcon from "@mui/icons-material/Percent";
import DiamondIcon from "@mui/icons-material/Diamond";
import NumbersIcon from "@mui/icons-material/Numbers";
import RedeemIcon from "@mui/icons-material/Redeem";
import Inventory2Icon from "@mui/icons-material/Inventory2";

import EarlyRenewalSetup from "@/Components/Setup/EarlyRenewalSetup";
import InterestRate from "@/Components/Setup/InterestRate";
import InterestRateGold from "@/Components/Setup/InterestRateGold";
import PTNoSetup from "@/Components/Setup/PTNoSetup";
import EarlyRedemptionSetup from "@/Components/Setup/EarlyRedemptionSetup";
import SetupBoxNo from "@/Components/Setup/SetupBoxNo";

import { RouteConfig } from "@/types/layoutInterfaces";

const routes: RouteConfig[] = [
  {
    name: "Setup",
    key: "Setup",
    route: "/setup",
    layout: "/",
    icon: <SettingsIcon />,
    component: null,
    childs: [
      {
        name: "Early Renewal",
        key: "ERS",
        route: "/setup/early-renewal",
        permission: "ERS",
        layout: "/setup",
        icon: <AutorenewIcon />,
        component: <EarlyRenewalSetup />,
      },
      {
        name: "Interest Rate",
        key: "IR",
        route: "/setup/interest-rate",
        permission: "IR",
        layout: "/setup",
        icon: <PercentIcon />,
        component: <InterestRate />,
      },
      {
        name: "Interest Rate Gold",
        key: "IRT",
        route: "/setup/interest-rate-gold",
        permission: "IRT",
        layout: "/setup",
        icon: <DiamondIcon />,
        component: <InterestRateGold />,
      },
      {
        name: "PT No Setup",
        key: "PTNoSetup",
        route: "/setup/pt-no-setup",
        permission: "PTNoSetup",
        layout: "/setup",
        icon: <NumbersIcon />,
        component: <PTNoSetup />,
      },
      {
        name: "Early Redemption",
        key: "ER",
        route: "/setup/early-redemption",
        permission: "ER",
        layout: "/setup",
        icon: <RedeemIcon />,
        component: <EarlyRedemptionSetup />,
      },
      {
        name: "Setup Box No",
        key: "SB",
        route: "/setup/setup-box-no",
        permission: "SB",
        layout: "/setup",
        icon: <Inventory2Icon />,
        component: <SetupBoxNo />,
      },
    ],
  },
];

export default routes;
