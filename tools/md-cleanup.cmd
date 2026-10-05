@echo off
cd /d "C:\Users\96896\Downloads\my-tools-site"
echo ==== %date% %time% ==== >> "%LOCALAPPDATA%\adawati-md-cleanup.log"
type "tools\md-cleanup-prompt.txt" | call "C:\Users\96896\AppData\Roaming\npm\claude.cmd" -p --permission-mode acceptEdits --allowedTools "Read,Edit,Write,Glob,Grep" --disallowedTools "Bash,PowerShell,WebFetch,WebSearch" >> "%LOCALAPPDATA%\adawati-md-cleanup.log" 2>&1
