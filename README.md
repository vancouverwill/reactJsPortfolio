<img src="https://travis-ci.org/vancouverwill/reactJsPortfolio.svg?branch=master" />

# reactJsPortfolio


## build process


```
npm install

npm install --global gulp
```

##

Running is really simple just

```
gulp
```

### New js build
`gulp js`

### CSS
`
gulp css
`
or 
`
gulp css  --prod
`

If you want to run without node as local web server

`php server.php`

or

`open index.html`


## DEV-STEPS

While building use eslint to lint javascript

`gulp lint`

`gulp lint-fix` to attempt to automaticaly fix lint issues

## credit 
- to Eric Grosse `https://github.com/ericgrosse/task-runner-bundler-comparison` for really good example of a clean gulp file which handles produciton and dev in same place
- to https://medium.freecodecamp.org/the-right-way-to-test-react-components-548a4736ab22 for good testing patterns