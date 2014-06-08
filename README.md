# ![Carolayne](logo.png)

> A superhero fullstack framework for node.js

[![Build Status](https://secure.travis-ci.org/chrisenytc/carolayne.png?branch=master)](http://travis-ci.org/chrisenytc/carolayne) [![GH version](https://badge-me.herokuapp.com/app/gh/chrisenytc/carolayne.png)](http://badges.enytc.com/for/gh/chrisenytc/carolayne)

## Getting Started

1º Clone Carolayne repo

```bash
git clone https://github.com/chrisenytc/carolayne.git
```

2º Enter in he-man directory
```bash
cd carolayne
```

3º Install dependencies

```bash
npm install
```

4º Configure the settings in `api/config`

6º Start Carolayne

```bash
npm start
```

Test your Carolayne app

```bash
npm test
```

## Documentation

### Socket Controllers

How to use Sockets

The Carolayne uses socket.io, you need to follow some conventions to able to use it.

1. The file name and the method name will be used as socket path. e.g: `test.js` + `index` = `test/index`
2. You can listen or emit a message using that path. e.g: `on: function(data){}` or `emit: 'message-example'`
3. `this` variable has the scope of socket.io and can use all of its methods. e.g: `this.on('test/index', function(data){});`, `this.emit('test/index', 'message-example')` and more.

Example:

```javascript

module.exports = function(app, config) {

    function IndexController() {
        //inherits
    }

    IndexController.prototype.index = {
        on: function() {
            return this.emit('index/list', {config: config, service: app.getService('utilsService')});
        },
        emit: 'Hello Frontend!'
    };

    return IndexController;
};

```

## Services

How to use services

Services are an abstraction layer that allows you to do all the heavy lifting here and let sockets clean.

Conventions:

- The name of the js file will be used as the name of the service. e.g: `app.getService('utilsService')`

Example:

```javascript
module.exports = function utilsService() {
    return 'Hello World!';
};
```

## Settings

How to use Settings

The Carolayne works with environments, you can have multiple configurations in your application.

The defaults environments are: `development`, `test` and `production`. You also create your own customized reports environments.

You can access the contents of environments using `app.getConfig('nameofconfigfile')`

Conventions:

- The name of the configuration files in `api/config/<env>` are the names used to get the contents of the settings in: `app.getConfig('nameofconfigfile')`


##### Custom Environments

How to create custom environments

1º Create `mycustomenv` folder in `api/config/`

2º Create config files in `api/config/mycustomenv`

3º Run your environment

```bash
NODE_ENV=mycustomenv node app
```

Example:

```bash
NODE_ENV=production node app
```

## Contributing

Please submit all issues and pull requests to the [chrisenytc/carolayne](http://github.com/chrisenytc/carolayne) repository!

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/chrisenytc/carolayne/issues).

## License 

The MIT License

Copyright (c) 2014, Christopher EnyTC

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

