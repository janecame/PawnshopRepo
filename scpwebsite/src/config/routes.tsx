import { RouteConfig } from "@/types/layoutInterfaces";

import RouteDashboard from "@/config/route-dashboard";
import RouteFile from "@/config/route-file";
import RouteSetup from "@/config/route-setup";
import RouteEntries from "@/config/route-entries";
import RouteTransactions from "@/config/route-transactions";
import RouteSearch from "@/config/route-search";
import RouteReports from "@/config/route-reports";
import RouteSecurity from "@/config/route-security";

export const routes: RouteConfig[] = [
  ...RouteDashboard,
  ...RouteFile,
  ...RouteSetup,
  ...RouteEntries,
  ...RouteTransactions,
  ...RouteSearch,
  ...RouteReports,
  ...RouteSecurity,
];

export type { RouteConfig } from "@/types/layoutInterfaces";
