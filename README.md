# reactJsPortfolio


## build process


```
npm install



npm install -g react-tools

npm install -g bower

npm install -g babel-cli

npm install -g watchify

npm install -g less

npm install --global gulp

bower install
```

### Outdate js build
~~while building we need to update the files in the src directory, run the below so babel the src directory for changes

`babel --presets react src --watch --out-dir build`

and 

`watchify  -t babelify  build/portfolio.js -o bundle.js` 

or 

`broswerify  -t babelify  build/portfolio.js --outfile bundle.js`~~

### New js build

`watchify  -t babelify  src/portfolio.js -o bundle.js`



for CSS build I use gulp which runs default by

`
gulp
`



finally to run as local web server

`php server.php`

or

`open index.html`


## DEV-STEPS

While building use eslint to lint javascript

`./node_modules/.bin/eslint src/portfolio.js`