# reactJsPortfolio


## build process


```
npm install

npm install -g react-tools

npm install -g bower

bower install fontawesome
```

while building we need to update the files in the src directory, run the below so that jsx monitors the src directory for changes

`jsx --watch --follow-requires src/ build/`

finally run 

`php server.php`