# reactJsPortfolio


## build process


```
npm install

npm install -g react-tools

npm install -g bower

bower install fontawesome
```

if necessary 

```
npm install -g browserify
npm install -g watchify
```

while building we need to update the files in the src directory, run the below so that jsx monitors the src directory for changes

`jsx --watch --follow-requires src/ build/`

this has now been updated to use babel instead

`babel src --watch --out-dir build` and `browserify -t babelify  build/portfolio.js -o bundle.js` 

althought I need to figure out a way to watch this and not manually have to call it

```
watchify  -t babelify  build/portfolio.js -o bundle.js
```

finally run 

`php server.php`