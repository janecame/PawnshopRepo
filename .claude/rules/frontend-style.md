# Frontend Style

## Entry Point & Routing

`App.js` wraps the app with `SnackbarProvider` and `AuthProvider`. Routes are flattened from `config/routes.tsx` (which aggregates per-domain files: `route-transactions.tsx`, `route-security.tsx`, etc.) and rendered under `MainLayout` via `ProtectedRoute`.

- `/login` — public login page
- `/` and nested paths — protected, rendered inside `MainLayout`

## API Calls

- **Base URL**: `src/Functions/ConnectionString.js` exports `StringHost()`. Toggle local (`http://localhost:23854`) vs Azure by uncommenting.
- **Axios config**: `src/config/AxiosConfig.ts` — shared axios instance with a request interceptor that attaches the Bearer token.
- **All fetch functions**: `src/Functions/AxiosFunction.js` — single file for every API call. Add new calls here.

## State & Data Fetching

TanStack React Query v5 via hooks in `src/Hooks/`:

| Hook | Domain |
|---|---|
| `useTransactionQueries.js` | Pawn tickets, customers |
| `useSecurityQueries.js` | Users, groups, permissions, branches |
| `useEntriesQueries.js` | Entry lookups (items, colors, etc.) |
| `useUtilityQueries.js` | Misc utility queries |
| `useSearchQueries.js` | Search |
| `use-security.ts` | Security/permissions (TypeScript) |

## Authentication

`src/contexts/AuthContext.tsx` provides `useAuth` hook. Stores session in `localStorage` with auto-expiry and auto-logout. User object fields: `userCode`, `userName`, `completeName`, `groupCode`, `cnCode`, `token`, `expiresIn`, `expiryTimeStamp`. Supports hydration from the legacy `UserSession` format.

Legacy: `src/Functions/UtilityFunctions.js` (`UserSession()`, `ExpireComponentToken()`) — still used by components not yet migrated to `AuthContext`.

## Permission System

After login, permissions for the user's `GroupCode` are fetched from `tblPermission`. The list contains **blocked** `ObjectName` strings — if a menu key is **in** the list, the user is redirected to `/unauthorized`. This is an inverted model (list = restricted, not allowed).

## Layout & Components

- `Components/layout/MainLayout.tsx` — wraps all authenticated pages
- `Components/layout/Sidebar.tsx` — collapsible MUI navigation drawer with tree connectors, user profile dropdown
- `Components/auth/ProtectedRoute.tsx` — checks auth and permissions before rendering

## TypeScript

- `src/types/layoutInterfaces.ts` — `RouteConfig`, `SelectOption`, payload types, asset/member models
- `src/types/securityInterfaces.ts` — `Group`, `User`, `RegisterListAppKeys`
- `src/lib/utils.ts` — `cn()` utility (clsx wrapper for conditional class names)
- `src/theme/muiTheme.ts` — MUI light theme, Navy/Indigo palette, accounting colors (success=green, error=red, warning=amber)

## UI Libraries

| Library | Usage |
|---|---|
| Bootstrap 5 + react-bootstrap | Layout, general components |
| MUI v7 | Form inputs, navigation, theming |
| react-data-table-component | Data tables |
| sweetalert2 + react-hot-toast | Alerts and toasts |
| react-hook-form + zod | Form validation |
