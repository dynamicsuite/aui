call vue-cli-service build --target wc --name aui *.vue --dest ../client/js --no-clean
rmdir /s /q .\node_modules
del /s /q ..\client\js\demo.html
del /s /q ..\client\js\aui.js