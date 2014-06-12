/*
 * carolayne
 * https://github.com/chrisenytc/carolayne
 *
 * Copyright (c) 2014, Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

/*
 * Module Dependencies
 */

var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    _s = require('underscore.string'),
    debug = require('./debugger.js'),
    Logger = require('./logger.js'),
    join = path.resolve,
    readdir = fs.readdirSync,
    exists = fs.existsSync,
    configStorage = {},
    serviceStorage = {},
    modelStorage = {};

var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    logger = require('morgan'),
    compression = require('compression'),
    responseTime = require('response-time'),
    mongoStore = require('connect-mongo')(session),
    flash = require('connect-flash'),
    cors = require('cors'),
    swig = require('swig'),
    livi18n = require('livi18n'),
    mongoose = require('mongoose');

/*
 * Public Methods
 */

/**
 * @class Carolayne
 *
 * @constructor
 *
 * Constructor responsible for provide a application server and helpers
 *
 * @example
 *
 *     var carolayne = new Carolayne();
 *
 */

var Carolayne = module.exports = function() {
    //Get version
    this.version = require('../../package.json').version;
    //Load files
    this.load = function(root, cb) {
        var fullPath = join(__dirname, '..', '..', 'api', root);
        var ENV = process.env.NODE_ENV || 'development';
        //
        if (root === 'config') {
            var configPath = join(fullPath, ENV);
            //Read this directory
            if (exists(configPath)) {
                readdir(configPath).forEach(function(file) {
                    if (fs.statSync(join(configPath, file)).isFile()) {
                        //Resolve file path
                        var filePath = join(configPath, file);
                        //Check if this file exists
                        if (exists(filePath)) {
                            //Run callback
                            var fileName = file.replace(/\.js$/, '');
                            fileName = fileName.replace(/\.json$/, '');
                            cb(filePath, fileName);
                        }
                    }
                });
            } else {
                console.log('ERROR: The '.red + ENV.white + ' environment not exists in api/config'.red);
                process.exit(0);
            }
        } else {
            //Read this directory
            readdir(fullPath).forEach(function(file) {
                if (fs.statSync(join(fullPath, file)).isFile()) {
                    //Resolve file path
                    var filePath = join(fullPath, file);
                    //Check if this file exists
                    if (exists(filePath)) {
                        //Run callback
                        var fileName = file.replace(/\.js$/, '');
                        fileName = fileName.replace(/\.json$/, '');
                        cb(filePath, fileName);
                    }
                }
            });
        }
    };
};

/**
 * Method responsible for load configs
 *
 * @example
 *
 *     carolayne.loadConfigs();
 *
 * @method loadConfigs
 * @public
 */

Carolayne.prototype.loadConfigs = function loadConfigs() {
    //Load Settings
    this.load('config', function(filePath, fileName) {
        //Require configs
        var config = require(filePath);
        //Set Property
        configStorage[fileName] = config;
    });
    //Debug
    debug('Settings loaded', 'success');
};

/**
 * Method responsible for load all dependencies
 *
 * @example
 *
 *     carolayne.loader();
 *
 * @method loader
 * @public
 */

Carolayne.prototype.loader = function loader() {
    //Load Services
    this.load('services', function(filePath, fileName) {
        //Check if exists
        if (exists(filePath)) {
            //Require service
            var service = require(filePath);
            serviceStorage[fileName] = service;
        }
    });
    //Debug
    debug('Services loaded', 'success');
    //Load Models
    this.load('models', function(filePath, fileName) {
        //Check if exists
        if (exists(filePath)) {
            //Require Models
            var model = require(filePath);
            modelStorage[_s.capitalize(fileName)] = model;
        }
    });
    //Debug
    debug('Models loaded', 'success');
};

/**
 * Method responsible for configure the server
 *
 * @example
 *
 *     carolayne.configureServer();
 *
 * @method configureServer
 * @public
 */

Carolayne.prototype.configureServer = function configureServer() {
    //Instance app
    var App = express(),
        Db;
    //Set the node enviornment variable if not set before
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    //Database manager
    if (configStorage.database.enabled) {
        //If not connected, connect and use this connection
        mongoose.connect(configStorage.database.uri);
        Db = mongoose.connection;
        //MongoDB ErrorHandler
        if (App.get('env') !== 'test') {
            Db.on('error', console.error.bind(console, 'Connection error:'.red));
        }
        //MongoDB ConnnectedEvent
        Db.on('connected', function() {
            debug('MongoDB connected successfully', 'success');
        });
        //MongoDB DisconnnectedEvent
        Db.on('disconnected', function() {
            debug('MongoDB disconnected', 'error');
        });
        //MongoDB autoClose
        process.on('SIGINT', function() {
            mongoose.connection.close(function() {
                debug('Mongoose disconnected through app termination', 'error');
                process.exit(0);
            });
        });
    }

    //Logger
    if (App.get('env') !== 'test') {
        App.use(logger(Logger));
    }

    //Jsonp support
    App.enable('jsonp callback');

    App.set('showStackError', true);

    //Swig
    swig.setDefaults({
        cache: 'memory'
    });

    //assign the template engine to .html files
    //app.engine('html', consolidate[app.get('app').templateEngine]);
    App.engine('html', swig.renderFile);

    //set .html as the default extension
    App.set('view engine', 'html');

    //Set views path, template engine and default layout
    App.set('views', path.join(__dirname, '..', '..', 'api', 'views'));

    //Manage cache
    if ('production' !== App.get('env')) {
        //Cache
        App.set('view cache', false);
    }

    //Static files
    App.use('/assets', express.static(path.join(__dirname, '..', '..', 'api', 'public')));
    App.use('/assets', express.static(path.join(__dirname, '..', '..', 'api', 'assets')));

    //CookieParser
    App.use(cookieParser(configStorage.auth.sessionSecret));

    //Headers
    App.use(bodyParser());
    App.use(methodOverride());

    //SessionManager
    if (configStorage.database.enabled) {
        // Express/Mongo session storage
        App.use(session({
            secret: configStorage.auth.sessionSecret,
            store: new mongoStore({
                db: mongoose.connections[0].db,
                collection: configStorage.database.sessionCollection
            })
        }));
    } else {
        //Express Session
        App.use(session());
    }

    //Connect flash for flash messages
    App.use(flash());

    //Cors Options
    var corsOptions = configStorage.cors;
    //Cors
    if (corsOptions.enabled) {
        App.use(cors(corsOptions));
        debug('CORS support enabled', 'success');
    }

    //User locals
    App.use(function(req, res, next) {
        req.configs = configStorage;
        res.locals.configs = configStorage;
        res.locals.appName = configStorage.app.applicationName;
        res.locals.appDescription = configStorage.app.description;
        res.locals.msg = req.flash();
        res.locals.routePath = req.path;
        next();
    });

    //Powered By
    App.use(function(req, res, next) {
        res.removeHeader('X-Powered-By');
        res.setHeader('X-Powered-By', configStorage.app.poweredBy);
        next();
    });

    this.loadMiddlewares(App, function() {
        debug('Middlewares loaded', 'success');
    });

    //Internationalisation (i18n)
    if (configStorage.i18n.enabled) {
        //I18n Provider
        App.use(livi18n.init(App, {
            defaultLanguage: configStorage.i18n.defaultLanguage,
            languages: configStorage.i18n.languages,
            storageKey: configStorage.i18n.StorageKey,
            cookie: configStorage.i18n.cookie,
            cookieSettings: configStorage.i18n.cookieSettings,
            socket: configStorage.i18n.socket,
            serveClient: configStorage.i18n.serveClient,
            path: path.join(__dirname, '..', '..', 'api', configStorage.i18n.path)
        }));
        //Locales loaded successfully
        debug('Locales loaded', 'success');
    }

    //Compress
    App.use(compression());

    //ResponseTime
    App.use(responseTime());

    //Loader webservices
    if (configStorage.app.webservices) {
        this.loadWS(App, function() {
            debug('WebServices loaded', 'success');
        });
    }

    //Loader controllers
    this.loadControllers(App, function() {
        debug('Controllers loaded', 'success');
    });

    //Loader extensions
    this.loadExtensions(App, function() {
        debug('Extensions loaded', 'success');
    });

    //Error 500 Handler
    App.use(function(err, req, res, next) {
        //Error message
        var error;
        //Handler
        if (err.message === 'Validation failed') {
            var errorList = [];
            var errorMessages = err.errors;
            for (var e in errorMessages) {
                errorList.push(errorMessages[e].message.replace(new RegExp('Path', 'g'), 'The'));
            }
            error = errorList;
        } else {
            if (!err.message) {
                error = err;
            } else {
                error = err.message;
            }
        }
        var error500 = configStorage.errors['500'].message.replace(/:method/, req.method).replace(/:path/, req.url);
        if (req.is('json')) {
            res.sendResponse(500, {
                msg: error500,
                error: error,
                documentation_url: configStorage.app.documentation_url
            });
        } else {
            res.status(500).render('500', {
                message: error500,
                error: err.message || err
            });
        }
        if ('development' === App.get('env')) {
            if (!err.stack) {
                console.error('Error => ' + err.red);
            } else {
                console.error(err.stack.red);
            }
        }
    });

    //Error 404 Handler
    App.use(function(req, res) {
        var error404 = configStorage.errors['404'].message.replace(/:method/, req.method).replace(/:path/, req.url);
        if (req.is('json')) {
            res.sendResponse(404, {
                url: req.originalUrl,
                error: error404
            });
        } else {
            res.status(404).render('404', {
                url: req.originalUrl,
                message: error404
            });
        }
    });

    //Return Application
    return App;
};

/**
 * Method responsible for get configs
 *
 * @example
 *
 *     carolayne.getConfig('fileName');
 *
 * @method getConfig
 * @public
 * @param {String} fileName Name of config file
 */

Carolayne.prototype.getConfig = function getConfig(fileName) {

    if (fileName) {
        return configStorage[fileName] || null;
    } else {
        return configStorage || {};
    }
};

/**
 * Method responsible for get services
 *
 * @example
 *
 *     carolayne.getService('fileName');
 *
 * @method getService
 * @public
 * @param {String} fileName Name of service file
 */

Carolayne.prototype.getService = function getService(fileName) {

    if (_.isFunction(serviceStorage[fileName])) {
        return serviceStorage[fileName].call(this) || null;
    }

    return serviceStorage[fileName] || null;
};

/**
 * Method responsible for get models
 *
 * @example
 *
 *     carolayne.getModel('fileName');
 *
 * @method getModel
 * @public
 * @param {String} fileName Name of model file
 */

Carolayne.prototype.getModel = function getModel(fileName) {

    if (fileName) {
        return modelStorage[_s.capitalize(fileName)] || null;
    } else {
        return modelStorage || null;
    }
};

/**
 * Method responsible for get base
 *
 * @example
 *
 *     carolayne.getLib('baseApplication');
 *
 * @method getLib
 * @public
 * @param {String} fileName Name of lib file
 */

Carolayne.prototype.getLib = function getLib(fileName) {
    //Load Lib
    return require(join(__dirname, '..', fileName));
};

/**
 * Method responsible for load middlewares
 *
 * @example
 *
 *     carolayne.loadMiddlewares(App);
 *
 * @method loadMiddlewares
 * @public
 * @param {Object} App Instance of express();
 * @param {Function} cb Callback
 */

Carolayne.prototype.loadMiddlewares = function loadMiddlewares(App, cb) {
    //Load middlewares
    this.load('middlewares', function(filePath) {
        //Check if exists
        if (exists(filePath)) {
            //Require middleware
            var midd = require(filePath);
            //Create ws
            if (midd.enabled) {
                App.use(midd.fn);
            }

        }
    });

    //Run callback
    cb();
};

/**
 * Method responsible for load webservices
 *
 * @example
 *
 *     carolayne.loadWS(App, function(){});
 *
 * @method loadWS
 * @public
 * @param {Object} App Instance of express();
 * @param {Function} cb Callback
 */

Carolayne.prototype.loadWS = function loadWS(App, cb) {
    //Load webservices
    this.load('webservices', function(filePath, fileName) {
        //Check if exists
        if (exists(filePath)) {
            //Require webservice
            var ws = require(filePath);
            //Create ws
            App.get('/ws/' + fileName, function(req, res) {
                return res.jsonp(ws);
            });
            //Create ws .json
            App.get('/ws/' + fileName + '.json', function(req, res) {
                return res.jsonp(ws);
            });

        }
    });

    //Run callback
    cb();
};

/**
 * Method responsible for loadding sockets
 *
 * @example
 *
 *     carolayne.loadSockets(server, function() {});
 *
 * @method loadSockets
 * @public
 * @param {Object} server Instance of server
 * @param {Function} cb Callback
 */

Carolayne.prototype.loadSockets = function loadSockets(server, cb) {
    var io = require('socket.io').listen(server);

    //carolayne instance
    var carolayne = new Carolayne();

    //Instance
    var loader = this;

    //Loader extensions
    this.loadSocketExtensions(io, function() {
        debug('Socket Extensions loaded', 'success');
    });

    //Sockets
    io.on('connection', function(socket) {

        debug('Client Connected', 'success');

        loader.load('sockets', function(filePath, fileName) {
            //Require configs
            var sockets = require(filePath)({
                getConfig: carolayne.getConfig,
                getService: carolayne.getService,
                getModel: carolayne.getModel,
                getLib: carolayne.getLib
            }, carolayne.getConfig());
            //Load All Sockets
            _.each(sockets.prototype, function(s, key) {
                //Handle requests
                if (s.hasOwnProperty('on') && _.isFunction(s.on)) {
                    socket.on(path.join(fileName, key), s.on);
                }
                if (s.hasOwnProperty('emit')) {
                    socket.emit(path.join(fileName, key), s.emit);
                }
            });
        });

        socket.on('disconnect', function() {
            debug('Connection closed', 'error');
        });

    });

    //Run callback
    cb();
};

/**
 * Method responsible for loadding sockets
 *
 * @example
 *
 *     carolayne.loadSockets(App, function() {});
 *
 * @method loadSockets
 * @public
 * @param {Object} App Instance of express();
 * @param {Function} cb Callback
 */

Carolayne.prototype.loadControllers = function loadControllers(App, cb) {
    //carolayne instance
    var carolayne = new Carolayne();

    //Routes
    var Routes = require(join(__dirname, '..', '..', 'api', 'routes.js')),
        Policies = require(join(__dirname, '..', '..', 'api', 'policies.js')),
        CTRLSPath = join(__dirname, '..', '..', 'api', 'controllers'),
        PoliciesPath = join(__dirname, '..', '..', 'api', 'policies');

    //Load All Routes
    _.each(Routes, function(route, routePath) {
        //Handle requests
        if (exists(join(CTRLSPath, route.controller.replace(/\.js$/, '') + '.js'))) {

            var Ctrl = require(join(CTRLSPath, route.controller.replace(/\.js$/, '') + '.js'))({
                getConfig: carolayne.getConfig,
                getService: carolayne.getService,
                getModel: carolayne.getModel,
                getLib: carolayne.getLib
            }, carolayne.getConfig());
            //Load actions
            _.each(Ctrl.prototype, function() {

                if (Ctrl.prototype.hasOwnProperty(route.action) && _.isFunction(Ctrl.prototype[route.action])) {

                    if (Policies.hasOwnProperty(route.controller) && Policies[route.controller].hasOwnProperty(route.action) && _.isString(Policies[route.controller][route.action])) {
                        //Get policie
                        var policie = require(join(PoliciesPath, Policies[route.controller][route.action].replace(/\.js$/, '') + '.js'));
                        //Add policie
                        App[route.method.toLowerCase()](routePath, policie, Ctrl.prototype[route.action]);

                    } else if (Policies.hasOwnProperty(route.controller) && Policies[route.controller].hasOwnProperty('*') && Policies[route.controller]['*']) {
                        //Add policie
                        App[route.method.toLowerCase()](routePath, Ctrl.prototype[route.action]);

                    } else if (Policies.hasOwnProperty(route.controller) && Policies[route.controller].hasOwnProperty(route.action) && _.isFunction(Policies[route.controller][route.action])) {
                        //Add policie
                        App[route.method.toLowerCase()](routePath, Policies[route.controller][route.action], Ctrl.prototype[route.action]);

                    } else if (Policies.hasOwnProperty(route.controller) && Policies[route.controller].hasOwnProperty(route.action) && Policies[route.controller][route.action] === true) {
                        //Create route
                        App[route.method.toLowerCase()](routePath, Ctrl.prototype[route.action]);
                    }

                } else {
                    debug('Have a error on loading ' + route.controller + '@' + route.action, 'error');
                }

            });

        }

    });

    //Run callback
    cb();
};

/**
 * Method responsible for load socket extensions
 *
 * @example
 *
 *     carolayne.loadSocketExtensions(io, function(){});
 *
 * @method loadSocketExtensions
 * @public
 * @param {Object} io Instance of socket.io;
 * @param {Function} cb Callback
 */

Carolayne.prototype.loadSocketExtensions = function loadSocketExtensions(io, cb) {
    //Load Extensions
    this.load('../lib/extensions', function(filePath) {
        //Check if exists
        if (exists(filePath)) {
            //Require extension
            var ext = require(filePath);
            //Create extension
            if(ext.hasOwnProperty('core') && ext.core.hasOwnProperty('extends') && ext.core.extends.hasOwnProperty('socket') && typeof ext.core.extends.socket === 'function') {
                ext.core.extends.socket(io);
            }
        }
    });

    //Run callback
    cb();
};

/**
 * Method responsible for load extensions
 *
 * @example
 *
 *     carolayne.loadExtensions(App, function(){});
 *
 * @method loadExtensions
 * @public
 * @param {Object} App Instance of express();
 * @param {Function} cb Callback
 */

Carolayne.prototype.loadExtensions = function loadExtensions(App, cb) {
    //Load Extensions
    this.load('../lib/extensions', function(filePath) {
        //Check if exists
        if (exists(filePath)) {
            //Require extension
            var ext = require(filePath);
            //Create extension
            if(ext.hasOwnProperty('core') && ext.core.hasOwnProperty('extends') && typeof ext.core.extends === 'function') {
                ext.core.extends(App);
            }
        }
    });

    //Run callback
    cb();
};
