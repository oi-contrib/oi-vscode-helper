const { copySync } = require("oipage");

copySync("./node_modules/oipage/stylecss/normalize.css", "./src/views/libs/normalize.css");
copySync("./node_modules/vislite/lib/index.umd.min.js", "./src/views/libs/vislite.js");