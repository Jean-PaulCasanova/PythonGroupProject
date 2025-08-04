#!/bin/zsh
# Start Flask backend and React Vite frontend in separate tabs

# Start backend
osascript -e 'tell application "Terminal" to do script "cd /Volumes/selfexec_/acad_/GitHub/PythonGroupProject && export FLASK_APP=app && flask run"'

# Start frontend
osascript -e 'tell application "Terminal" to do script "cd /Volumes/selfexec_/acad_/GitHub/PythonGroupProject/react-vite && npm run dev"'

echo "Both backend and frontend are starting in new Terminal tabs."
