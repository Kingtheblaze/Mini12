@echo off
echo ===================================================
echo [SkillSwap] Resetting Passwords to password124...
echo ===================================================
echo Make sure you are connected to your Phone's Mobile Hotspot!
echo.
pause
echo Running migration to Supabase...
npx tsx seed_old_data.ts
echo.
echo ===================================================
echo Done! You can now log in using password124!
echo ===================================================
pause
