@echo off
cd /d "C:\Users\96896\Downloads\my-tools-site"
echo ==== %date% %time% ==== >> "%LOCALAPPDATA%\adawati-offers-research.log"
type "tools\offers-research-prompt.txt" | call "C:\Users\96896\AppData\Roaming\npm\claude.cmd" -p --permission-mode acceptEdits --allowedTools "Read,Write,Glob,Grep,WebSearch,WebFetch" --disallowedTools "Bash,PowerShell,Edit" >> "%LOCALAPPDATA%\adawati-offers-research.log" 2>&1
node "tools\offers-auto-deploy.js" >> "%LOCALAPPDATA%\adawati-offers-research.log" 2>&1
