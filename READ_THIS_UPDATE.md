## Purpose

Two unrelated efforts landed in one commit:

1. **Backend layering pilot** — introduces the first real example of the `Controller → Service → Repository` structure documented in `.claude/rules/architecture.md`, using the **Color** entry (a "code + description" lookup table) as the pilot case. The old `FilipGetListController` / `FilipInsertController` / `FilipUpdateController` endpoints for Color are left untouched and unwired from the frontend — this new stack is additive, meant for review before anything switches over.
2. **Connection-string cleanup** — replaces the old pattern in `ClsGetConnection.cs` of manually commenting/uncommenting hardcoded connection strings (including a plaintext Azure SQL password) with config-driven connection strings read from `appsettings.json` / `appsettings.Development.json`, selected automatically via `ASPNETCORE_ENVIRONMENT`.

---

## Files Added

### Backend — Color entry pilot (`Controller → Service → Repository`)
| File | Purpose |
|---|---|
| `SCPWEBAPI/Controllers/Entries/ColorController.cs` | New REST endpoints: `GET/POST/PUT api/entries/color` |
| `SCPWEBAPI/DTOs/Entries/ColorDto.cs` | Full row shape returned to the client (includes `CNCode`) |
| `SCPWEBAPI/DTOs/Entries/ColorCreateRequest.cs` | Request body for `POST` |
| `SCPWEBAPI/DTOs/Entries/ColorUpdateRequest.cs` | Request body for `PUT` (no `ColorCode`, it's in the route) |
| `SCPWEBAPI/Repositories/Interfaces/Entries/IEntryLookupRepository.cs` | Generic contract (`GetAll`, `Insert`, `Update`) shared by all future "code+description" lookup tables |
| `SCPWEBAPI/Repositories/Interfaces/Entries/IColorRepository.cs` | Marker interface: `IEntryLookupRepository<ColorDto>` |
| `SCPWEBAPI/Repositories/Implementations/Entries/EntryLookupRepository.cs` | Abstract generic base — builds parameterized SQL from template properties (`TableName`, `CodeColumn`, `SelectColumns`, etc.) |
| `SCPWEBAPI/Repositories/Implementations/Entries/ColorRepository.cs` | Concrete repo for `tblEntryColor`, extends `EntryLookupRepository<ColorDto>` |
| `SCPWEBAPI/Services/Interfaces/Entries/IColorService.cs` | Service contract |
| `SCPWEBAPI/Services/Implementations/Entries/ColorService.cs` | Thin service delegating to `IColorRepository` |



## Files Edited

### `SCPWEBAPI/FldrClass/ClsGetConnection.cs`
- **Lines 236–251 (new):** adds `using Microsoft.Extensions.Configuration;` and a static `IConfiguration Configuration` built from `appsettings.json` + `appsettings.{ASPNETCORE_ENVIRONMENT}.json` + environment variables.
- **Lines 253–257 (new):** `PlsConnect()` now returns `Configuration.GetConnectionString("Default")`, throwing `InvalidOperationException` if unset.
- **Lines 259–269 (removed):** deletes the old hardcoded/commented connection strings for local SQL 2022 (`WINSERVER\SQLEXPRESS`), a second local option (`DESKTOP-DTK5R9C\SQLEXPRESS`), and the Azure SQL string with the plaintext password `Admin123`.

### `SCPWEBAPI/Program.cs`
- **Lines 279–283 (new):** adds `using` statements for `Repositories.Implementations/Interfaces.Entries` and `Services.Implementations/Interfaces.Entries`.
- **Lines 291–294 (new):** registers `IColorRepository → ColorRepository` and `IColorService → ColorService` as scoped DI services, under a `// Entries (Controller -> Service -> Repository) pilot` comment.

### `SCPWEBAPI/appsettings.Development.json`
- **Lines 518–525:** adds a `ConnectionStrings.Default` key pointing at the local `WINSERVER\SQLEXPRESS` instance, database `SCP_BE_NEW`.

### `SCPWEBAPI/appsettings.json`
- **Lines 531–539:** adds `ConnectionStrings.Default` pointing at the Azure SQL instance (`pawnshopcloud.database.windows.net`), plaintext password `Admin123`.

### `.gitignore`
- **Line 132–135:** appends `.devswarm-temp/` after `**/build/` (and fixes a missing trailing newline).

### `.claude/rules/architecture.md`
- **Lines 90–108:** expands the `SCPWEBAPI/` tree to document the new `Services/`, `Repositories/`, `DTOs/`, `Middleware/`, `Validators/`, `Configurations/` folders, and adds a paragraph clarifying that new backend work should follow the layered structure while `Controllers/` stays as-is for now.

---

## Files Renamed/Converted (JS → TSX)

### `Customer.js` → `Customer.tsx`
- Adds typed `CustomerRow` state (`useState<CustomerRow | null>`), typed `columns: TableColumn<CustomerRow>[]`.
- Swaps Bootstrap chrome for MUI (`Box`, `Typography`, `Button`, `TextField`, `Chip`, `Stack`, `CircularProgress`), adds a live "X of Y customers" counter and a `Chip`-based Active/Inactive status badge (previously a raw `<span className="badge">`).
- Imports shared `customStyles` from the new `./entryTableStyles` module (introduced in commit 15eeff8) instead of a local copy.

### `CustModal.js` → `CustModal.tsx`
- Replaces manual `formData` state + `handleSubmit`/`handleUpdate` async functions with `useForm` (React Hook Form) + `zodResolver` against a new `customerFormSchema` (Zod), and `useMutation` (`insertMutation`/`updateMutation`) from TanStack Query.
- Preserves existing behavior: `Birthdate` empty string → `null` before submit, `ControlNo` shown instead of the auto-number on Update, snackbar success/warning/error messages unchanged, update-path errors still silently swallowed (`onError: () => {}`, explicitly commented as intentional to preserve prior behavior).
- Drops the stray `console.log(props.update)` that existed in the old `useEffect`.
- Converts the "Active?" checkbox to a Controller-wrapped native checkbox (kept as raw `<input type="checkbox">`, not MUI, since it wasn't in scope per the linked plan doc).

---