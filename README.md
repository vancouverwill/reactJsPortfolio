# reactJsPortfolio


## build process


```
npm install

npm install -g bower

npm install -g babel-cli

npm install -g watchify

npm install -g less

npm install --global gulp

bower install
```

### New js build
`broswerify  -t babelify  src/portfolio.js -o bundle.js`

or

`watchify  -t babelify  src/portfolio.js -o bundle.js`


### CSS

for CSS build I use gulp which runs default gulp tasks by. Minimization is currently disabled but that is easy to switch on.

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