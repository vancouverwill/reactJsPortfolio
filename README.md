# reactJsPortfolio


## build process


```
npm install

npm install -g react-tools

npm install -g bower

npm install -g babel-cli

bower install fontawesome

npm install -g watchify

npm install -g less

npm install --global gulp
```

while building we need to update the files in the src directory, run the below so babel the src directory for changes

`babel --presets react src --watch --out-dir build`

and 

`watchify  -t babelify  build/portfolio.js -o bundle.js` 



for CSS build I use gulp which runs default by 

`
gulp
`



finally run 

`php server.php`