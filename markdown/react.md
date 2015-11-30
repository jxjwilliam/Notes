### node_modules

1. babelify
1. react
1. react-dom

package.json:
"start": "watchify index.js -v -t babelify -o bundle.js"



npm install -g babel-cli
npm install babel-preset-es2015 babel-preset-react
babel --presets react demo.jsx --out-dir=build

//src folder
babel --presets react src --watch --out-dir build