@echo off
setlocal enabledelayedexpansion

cd evidence-frontend
REM Specify the file you want to modify
@REM set "file_to_modify=example.txt"
set "file_to_modify=.env"

REM Get local IPv4 address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| find "IPv4"') do (
    set "ipv4_address=%%a"
    set "ipv4_address=!ipv4_address:~1!"
    echo Local IPv4 address: !ipv4_address!
)

REM Temporary file to store modified content
set "temp_file=%temp%\tempfile.txt"

REM Remove existing lines with REACT_APP_API_SERVER and REACT_APP_URL_ASSET
findstr /v "REACT_APP_API_SERVER REACT_APP_URL_ASSET" "%file_to_modify%" > "%temp_file%"

REM Add updated lines to the temporary file
echo REACT_APP_API_SERVER=http://%ipv4_address%:8000/api/v1>>"%temp_file%"
echo REACT_APP_URL_ASSET=http://%ipv4_address%:8000/asset>>"%temp_file%"

REM Replace the original file with the modified content
move /y "%temp_file%" "%file_to_modify%"

echo File .env updated with new IPv4 address.

echo Frontend and Backend is loading...
REM Add a delay of 5 seconds before opening the link
timeout /t 3 /nobreak >nul

start yarn start

cd ..
cd evidence-backend
start yarn dev

cd ..
REM Specify the file to store the link
set "link_file=link.html"

@echo off
@echo off && echo ^<html^>^<head^>^<style^>body { font-size: 40px; color: #FF0000; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; } a { text-decoration: none; color: #FF0000; } ^</style^>^</head^>^<body^> ^<a href="http://%ipv4_address%:3000"^>http://%ipv4_address%:3000^</a^> ^</body^>^</html^> > "%link_file%"

REM Add a delay of 5 seconds before opening the link
timeout /t 3 /nobreak >nul

REM Open the link file in the default web browser
start "" "%link_file%"