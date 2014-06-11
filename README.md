# ![Carolayne](logo2.png)

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

5º Build Carolayne

```bash
make build
```

6º Start Carolayne

```bash
npm start
```

Test your Carolayne app

```bash
npm test
```

## Documentation

### Controllers

How to use controllers

The Carolayne uses javascript prototype in controllers, you need to follow some conventions to able to use it.

1. The file name and the method name will be used as socket path. e.g: `test.js` + `index` = `test/index`

Example:

```javascript

module.exports = function(app, config) {

    function IndexController() {
        //inherits
    }

    IndexController.prototype.index = function index(req, res, next) {
        return res.sendResponse(200, {welcome: 'Welcome to Carolayne.js'});
    };

    return IndexController;
};

```

## Models

How to use Models

The models in Carlyne.js uses the mongoose and follows the implementation of the example below:

```javascript
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Taks Schema
 */
var TaskSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: true
  },
  slug: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  closed: {
    type: Boolean,
    default: false
  }
});

//Exports model
module.exports = mongoose.model('Task', TaskSchema);
```

## Views

How to use Swig views

The Carolayne.js uses the Swig as its template engine, you can see more information on how to use Swig on the link below.

[How to use Swig](http://paularmstrong.github.io/swig/)

You can also use any of the listed template engines in this link:

[List of supported template engines](https://github.com/visionmedia/consolidate.js#supported-template-engines)

Example:

`api/views/index.html`

```html
{% extends '../layouts/default.html' %} 

{% block content %}
<div><strong>Hello World</strong></div>
{% endblock %}

```

## Internationalisation (i18n)

How to use Livi18n

The language files of Selena.js are in the folder `app/locales`

To use the Livi18n you must follow some conventions:

1. All language files are in `app/locales`, except as you change the settings in `app/config/<env>/i18n.json`
2. File names will be used to get the translation strings.

Quick example:

`app/locales/messages.json`

```json
{
  "welcome": "Hello :name, Welcome to Selena.js!",
  "message": ":name have :&: The Vampire Diaries Book||:name have :&: The Vampire Diaries Books"
}
```

In Views

`app/views/index.html`

```html
<div class="content">
  <p>{{ {key: 'messages.welcome', options: {name: 'Selena'}, defaultValue: 'TestValue'}) }}</p>
  <p>{{ {key: 'messages.message', options: {name: 'Selena'}, value: 10, defaultValue: 'TestValue'}) }}</p>
</div>
```

In Controllers

`app/controllers/index.js`

```javascript
module.exports = {

 /*
  * GET /
  */

 index: {
  method: 'GET',
  fn: function (req, res) {
   res.jsonp(200, {
    welcome: req.t({key: 'messages.welcome', options: {name: 'Selena'}, defaultValue: 'TestValue'});,
    message: req.p({key: 'messages.message', options: {name: 'Selena'}, value: 10, defaultValue: 'TestValue'});
   });
  }
 }
};
```

For more information see the documentation of the implementation of the Livi18n in Selena.js:

[Example of Livi18n on Backend](https://github.com/chrisenytc/livi18n/#examples)

[Example of Livi18n on Frontend with json API](https://github.com/chrisenytc/livi18n.js/#documentation)

[Example of Livi18n on Frontend with socket.io API](https://github.com/chrisenytc/livi18n.socket.js/#documentation)

### Sockets

How to use Sockets

The Carolayne uses socket.io, you need to follow some conventions to able to use it.

1. The file name and the method name will be used as socket path. e.g: `test.js` + `index` = `test/index`
2. You can listen or emit a message using that path. e.g: `on: function(data){}` or `emit: 'message-example'`
3. `this` variable has the scope of socket.io and can use all of its methods. e.g: `this.on('test/index', function(data){});`, `this.emit('test/index', 'message-example')` and more.

Example:

```javascript

module.exports = function(app, config) {

    function IndexSocket() {
        //inherits
    }

    IndexSocket.prototype.index = {
        on: function() {
            return this.emit('index/list', {config: config, service: app.getService('utilsService')});
        },
        emit: 'Hello Frontend!'
    };

    return IndexSocket;
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

