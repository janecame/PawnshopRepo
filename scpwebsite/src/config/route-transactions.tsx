import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AddCardIcon from "@mui/icons-material/AddCard";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import PaymentIcon from "@mui/icons-material/Payment";
import RedeemIcon from "@mui/icons-material/Redeem";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import NewLoan from "@/Components/Transaction/NewLoan";
import Renewal from "@/Components/Transaction/Renewal";
import NewRenewal from "@/Components/Transaction/Renewal/NewRenewal";
import RedemptionAll from "@/Components/Transaction/Redemption-All";
import PartialPayment from "@/Components/Transaction/PartialPayment";
import PullOut from "@/Components/Transaction/PullOut";
import PullOutPawnTicket from "@/Components/Transaction/PullOut/PullOutPawnTicket";

import { RouteConfig } from "@/types/layoutInterfaces";

const routes: RouteConfig[] = [
  {
    name: "Transaction",
    key: "Transaction",
    route: "/transaction",
    layout: "/",
    icon: <ReceiptLongIcon />,
    component: null,
    childs: [
      {
        name: "New Loan",
        key: "NewLoan",
        route: "/transaction/new-loan",
        permission: "NewLoan",
        layout: "/transaction",
        icon: <AddCardIcon />,
        component: <NewLoan />,
      },
      {
        name: "Renewal",
        key: "Renewal",
        route: "/transaction/renewal",
        permission: "Renewal",
        layout: "/transaction",
        icon: <AutorenewIcon />,
        component: <Renewal />,
      },
      {
        name: "New Renewal",
        key: "NewRenewal",
        route: "/transaction/renewal/new",
        permission: "NewRenewal",
        layout: "/transaction",
        icon: <AutorenewIcon />,
        component: <NewRenewal />,
        noDisplay: true,
      },
      {
        name: "Partial Payment",
        key: "PartialPayment",
        route: "/transaction/partial-payment",
        permission: "PartialPayment",
        layout: "/transaction",
        icon: <PaymentIcon />,
        component: <PartialPayment />,
      },
      {
        name: "Redemption",
        key: "Redemption",
        route: "/transaction/redemption-all",
        permission: "Redemption",
        layout: "/transaction",
        icon: <RedeemIcon />,
        component: <RedemptionAll />,
      },
      {
        name: "Pull Out",
        key: "PullOut",
        route: "/transaction/pull-out",
        permission: "PullOut",
        layout: "/transaction",
        icon: <RemoveCircleOutlineIcon />,
        component: <PullOut />,
      },
      {
        name: "Pull Out Pawn Ticket",
        key: "PullOutPawnTicket",
        route: "/transaction/pull-out/:id",
        layout: "/transaction",
        icon: <RemoveCircleOutlineIcon />,
        component: <PullOutPawnTicket />,
        noDisplay: true,
      },
    ],
  },
];

export default routes;
