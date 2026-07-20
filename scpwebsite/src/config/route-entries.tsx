import EditNoteIcon from "@mui/icons-material/EditNote";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RuleIcon from "@mui/icons-material/Rule";
import PaletteIcon from "@mui/icons-material/Palette";
import CategoryIcon from "@mui/icons-material/Category";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import BuildIcon from "@mui/icons-material/Build";
import GradeIcon from "@mui/icons-material/Grade";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import WatchIcon from "@mui/icons-material/Watch";

import Customer from "@/Components/Entry/Customer";
import Condition from "@/Components/Entry/Condition";
import Color from "@/Components/Entry/Color";
import Items from "@/Components/Entry/Items";
import DiamondShape from "@/Components/Entry/DiamondShape";
import BirthStone from "@/Components/Entry/BirthStone";
import BirthStoneColor from "@/Components/Entry/BirthStoneColor";
import Made from "@/Components/Entry/Made";
import Karat from "@/Components/Entry/Karat";
import Brand from "@/Components/Entry/Brand";
import Model from "@/Components/Entry/Model";
import Titus from "@/Components/Entry/Titus";

import { RouteConfig } from "@/types/layoutInterfaces";

const routes: RouteConfig[] = [
  {
    name: "Entry",
    key: "Entry",
    route: "/entry",
    layout: "/",
    icon: <EditNoteIcon />,
    component: null,
    childs: [
      {
        name: "Customer",
        key: "EntryCustomer",
        route: "/entry/customer",
        permission: "EntryCustomer",
        layout: "/entry",
        icon: <PersonOutlineIcon />,
        component: <Customer />,
      },
      {
        name: "Condition",
        key: "EntryCondition",
        route: "/entry/condition",
        permission: "EntryCondition",
        layout: "/entry",
        icon: <RuleIcon />,
        component: <Condition />,
      },
      {
        name: "Color",
        key: "EntryColor",
        route: "/entry/color",
        permission: "EntryColor",
        layout: "/entry",
        icon: <PaletteIcon />,
        component: <Color />,
      },
      {
        name: "Item",
        key: "EntryItem",
        route: "/entry/item",
        permission: "EntryItem",
        layout: "/entry",
        icon: <CategoryIcon />,
        component: <Items />,
      },
      {
        name: "Diamond Shape",
        key: "EntryDiamondShape",
        route: "/entry/diamond-shape",
        permission: "EntryDiamondShape",
        layout: "/entry",
        icon: <ChangeHistoryIcon />,
        component: <DiamondShape />,
      },
      {
        name: "Birthstone",
        key: "EntryBirthstone",
        route: "/entry/birthstone",
        permission: "EntryBirthstone",
        layout: "/entry",
        icon: <StarBorderIcon />,
        component: <BirthStone />,
      },
      {
        name: "Birthstone Color",
        key: "EntryBirthstoneColor",
        route: "/entry/birthstone-color",
        permission: "EntryBirthstoneColor",
        layout: "/entry",
        icon: <ColorLensIcon />,
        component: <BirthStoneColor />,
      },
      {
        name: "Made",
        key: "EntryMade",
        route: "/entry/made",
        permission: "EntryMade",
        layout: "/entry",
        icon: <BuildIcon />,
        component: <Made />,
      },
      {
        name: "Karat",
        key: "EntryKarat",
        route: "/entry/karat",
        permission: "EntryKarat",
        layout: "/entry",
        icon: <GradeIcon />,
        component: <Karat />,
      },
      {
        name: "Brand",
        key: "EntryBrand",
        route: "/entry/brand",
        permission: "EntryBrand",
        layout: "/entry",
        icon: <BrandingWatermarkIcon />,
        component: <Brand />,
      },
      {
        name: "Model",
        key: "EntryModel",
        route: "/entry/model",
        permission: "EntryModel",
        layout: "/entry",
        icon: <DirectionsCarIcon />,
        component: <Model />,
      },
      {
        name: "Titus",
        key: "EntryTitus",
        route: "/entry/titus",
        permission: "EntryTitus",
        layout: "/entry",
        icon: <WatchIcon />,
        component: <Titus />,
      },
    ],
  },
];

export default routes;
