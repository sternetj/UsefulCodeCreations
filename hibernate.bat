:: @MODE CON: COLS=32 LINES=1

:: @COLOR E5

@TITLE Countdown

@ECHO OFF

SETLOCAL ENABLEEXTENSIONS
SETLOCAL ENABLEDELAYEDEXPANSION

FOR /F %%# IN ('COPY /Z "%~dpf0" NUL') DO SET "CR=%%#"

FOR /L %%# IN (15,-1,1) DO (SET/P "=The Computer will Hibernate in %%# seconds. !CR!"<NUL :

	PING -n 2 127.0.0.1 >NUL:)

shutdown /h /f

:: Original Shutdown Command:
:: timeout /t 20 /NOBREAK > NUL && shutdown /h /f