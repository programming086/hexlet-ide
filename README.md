[![Build Status](https://travis-ci.org/Hexlet/hexlet-ide.svg?branch=master)](https://travis-ci.org/Hexlet/hexlet-ide)

### RUN in development mode
    1. npm i && bower i
    2. make develop
    3. Visit http://localhost:9000

### RUN in production mode
    1. npm i && bower i
    2. make assets && make prepublish
    2. make production
    3. Visit http://localhost:8000

### Embed usage

    1. npm i --save hexlet-ide
    2. require hexlet-ide frontend module
       var HexletIde = require("hexlet-ide/src/editor/main");

    3. Create widget
       var widget = HexletIde.create(document.getElementById("ide"), {
         url: "Backend url"
       });

### Hotkeys

`Ctrl+r` – run tests

`Esc` – close modal windows (e.g. README or Test output)

`Ctrl+[` and `Ctrl+]` – switch between modes (normal and terminal)
