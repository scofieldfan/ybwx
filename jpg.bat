@echo none 
for /f "delims=" %%a in ('dir "app\img\*.jpg" /b /s /a-d') do (
echo processing "%%a"
"wintool\jpegtran.exe" -optimize -progressive -copy none "%%a" "%%a.tmp"
move /Y "%%a.tmp" "%%a" >nul
)


@echo none 
for /f "delims=" %%a in ('dir "app\img\product\*.jpg" /b /s /a-d') do (
echo processing "%%a"
"wintool\jpegtran.exe" -optimize -progressive -copy none "%%a" "%%a.tmp"
move /Y "%%a.tmp" "%%a" >nul
)

@echo none 
for /f "delims=" %%a in ('dir "app\img\gl\*.jpg" /b /s /a-d') do (
echo processing "%%a"
"wintool\jpegtran.exe" -optimize -progressive -copy none "%%a" "%%a.tmp"
move /Y "%%a.tmp" "%%a" >nul
)


pause