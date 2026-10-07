@echo off
REM ===================================================
REM LOCUS Workspace Cleanup Script (Windows Batch)
REM Cleans temporary Python bytecode and test caches
REM ===================================================

echo [LOCUS] Cleaning temporary Python bytecode and test caches...

REM Remove __pycache__ directories
for /d /r . %%d in (__pycache__) do (
    if exist "%%d" (
        echo Removing: "%%d"
        rd /s /q "%%d"
    )
)

REM Remove .pytest_cache directories
for /d /r . %%d in (.pytest_cache) do (
    if exist "%%d" (
        echo Removing: "%%d"
        rd /s /q "%%d"
    )
)

REM Remove *.pyc and *.pyo files
del /s /q *.pyc >nul 2>&1
del /s /q *.pyo >nul 2>&1

echo [LOCUS] Workspace clean complete!
