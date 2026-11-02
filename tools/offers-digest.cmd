@echo off
cd /d "C:\Users\96896\Downloads\my-tools-site"
node "tools\offers-digest.js" >> "%LOCALAPPDATA%\adawati-offers-digest.log" 2>&1
