# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pawnshop Management System with two sub-projects:
- `SCPWEBAPI/` — ASP.NET Core 8 Web API (C#, SQL Server)
- `scpwebsite/` — React 18 frontend (Create React App + CRACO)

Detailed rules are in `.claude/rules/`:
- `architecture.md` — project structure and environment switching
- `backend-style.md` — BE code patterns, endpoints, models (analyze only)
- `frontend-style.md` — FE layout, routing, hooks, components, TypeScript
- `database.md` — empty (no DB details)
- `testing.md` — no testing tools

---

## Commands

### Backend

```powershell
cd SCPWEBAPI
dotnet run        # http://localhost:23854
dotnet build
dotnet restore
```

### Frontend

```powershell
cd scpwebsite
npm start         # dev server
npm run build     # production build
```

---

## Prompt Clarification Rule

Before acting on any user prompt, paraphrase the request back and ask "Is this what you mean?" Wait for confirmation before writing any code. This applies to all feature requests, bug fixes, and refactors.
