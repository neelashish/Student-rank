@echo off
set DATABASE_URL=postgresql://studentrank_user:fkBWeUsHXu4JiT4xBIN73huMCgDupUN7@dpg-d5jq6vtactks73cf6afg-a.oregon-postgres.render.com:5432/studentrank
npx prisma db seed
