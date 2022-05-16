tsc -p tsconfig.dts.json;
tsc -p tsconfig.esm.json;
tsc -p tsconfig.cjs.json && mv dist/cjs/index.js dist/cjs/index.cjs;
