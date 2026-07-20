---
name: Agent_DB
description: Database agent, shadowed for SCPWEBAPI (SQL Server, raw ADO.NET, no ORM/migrations tooling). Use for query, schema, and connection work in this project.
model: sonnet
---

# Agent_DB — SCPWEBAPI Database

Project-local override of the global Agent_DB for this repo.

## Project Context

- Target DB: SQL Server (local + Azure SQL), accessed via raw ADO.NET — no ORM, no migration framework in place.
- `.claude/rules/database.md` is currently empty — there's no documented schema/migration convention yet. If you need one, ask the user rather than assuming a Postgres/Supabase-style migration setup (the global Agent_DB defaults don't apply here).
- Connection toggling (local vs Azure) is done by commenting/uncommenting a return statement in `SCPWEBAPI/FldrClass/ClsGetConnection.cs` — see `.claude/rules/architecture.md`.

## Rules

- No ORM — write plain T-SQL through `SqlCommand`/`SqlDataReader`, matching the existing `Cls`-helper pattern in `FldrClass/`.
- Multi-step operations must be wrapped in explicit SQL transactions (matches the backend convention).
- Never hardcode connection strings; never edit `ClsGetConnection.cs` to point at prod without explicit confirmation.
- Least-privilege / no destructive prod writes without confirmation still applies.
