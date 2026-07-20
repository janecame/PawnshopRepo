# Architecture Overview

This is a **Pawnshop Management System** with two sub-projects:

- `SCPWEBAPI/` — ASP.NET Core 8 Web API (C#, SQL Server)
- `scpwebsite/` — React 18 frontend (Create React App + CRACO)

## Backend Structure

```
SCPWEBAPI/
├── Controllers/
│   ├── Transactions/   (NewRenewal, PartialPayment, PullOut, RedemptionAll, Renewal)
│   └── Reports/        (IndividualVoucher, Voucher)
├── FldrClass/          (Cls-prefixed helpers: ClsGetConnection, ClsAutoNum, ClsValidation, etc.)
└── FldrModels/         (Models.cs + per-transaction model files)
```

## Frontend Structure

```
scpwebsite/src/
├── config/             (routes.tsx + per-domain route files, AxiosConfig.ts)
├── contexts/           (AuthContext.tsx, SnackbarContext.tsx)
├── Components/
│   ├── auth/           (ProtectedRoute.tsx)
│   └── layout/         (MainLayout.tsx, Sidebar.tsx)
├── Hooks/              (TanStack Query hooks per domain)
├── Functions/          (AxiosFunction.js, ConnectionString.js, UtilityFunctions.js)
├── theme/              (muiTheme.ts)
└── types/              (layoutInterfaces.ts, securityInterfaces.ts)
```

## Environment Switching

- **Backend DB**: `SCPWEBAPI/FldrClass/ClsGetConnection.cs` — comment/uncomment the return statement to toggle local vs Azure SQL.
- **Frontend API**: `scpwebsite/src/Functions/ConnectionString.js` — toggle `strEndpoint` value.
