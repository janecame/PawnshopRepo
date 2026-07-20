# Backend Style (Analyze Only)

Understand the patterns below. Do not over-analyze control flow — focus on structure, endpoints, and models.

## Code Pattern

- Raw ADO.NET only (`SqlConnection`, `SqlCommand`, `SqlDataReader`). No ORM.
- Business logic lives in `FldrClass/` helper classes (prefixed `Cls`). Controllers call these helpers.
- Multi-step DB operations use explicit SQL transactions.

## File Structure

- `Controllers/` — flat for general CRUD; `Controllers/Transactions/` and `Controllers/Reports/` for grouped operations.
- `FldrClass/` — `Cls`-prefixed utility classes (e.g., `ClsGetConnection`, `ClsAutoNum`, `ClsValidation`, `ClsNewRenewal`).
- `FldrModels/` — most models nested inside `Models.cs`; transaction models have own files (`RenewalModel.cs`, `PullOutModel.cs`, etc.).

## API Endpoints

Routes are defined on individual actions, not on the controller class:

| Prefix | Usage |
|---|---|
| `API/SCPWEBAPI/{action}` | Main CRUD operations |
| `API/MRMS/{action}` | Lookup / read-only |
| `WEB/API/{action}` | Item / entry endpoints |
| `API/SCPWEBAPI/Security/{action}` | Security management (SecurityController uses class-level `[Route]`) |

## Models

- General models: nested classes inside `FldrModels/Models.cs`
- Transaction-specific: own file per type (`RenewalModel.cs`, `PullOutModel.cs`, `RedemptionModel.cs`, `PartialPaymentModel.cs`)
- Security models: `SecurityModel.cs`
- Search models: `SearchModel.cs`

## Authentication

Login validates username + MD5-hashed password against `tblUser`. Returns serialized `MdltblUsers` JSON on success; string codes on failure:
- `"2"` = wrong password
- `"3"` = user not found
- `"4"` = no data

No JWT is issued by the API. The frontend manages its own session token.
