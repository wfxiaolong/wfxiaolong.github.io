(function() {
  var app, browser, cleanTrace, dump, express, mime, path, port, project_root;

  express = require('express');

  app = express();

  path = require('path');

  module.exports = app;

  project_root = path.resolve(__dirname, '..');

  app.use(express["static"](project_root));

  app.use(express["static"](project_root + 'node_modules/mocha'));

  app.use(express["static"](project_root + 'node_modules/chai'));

  app.use(express.bodyParser());

  mime = function(req) {
    var type;
    type = req.headers['content-type'] || '';
    return type.split(';')[0];
  };

  dump = function(obj) {
    if (!obj) {
      obj = '';
    }
    if (obj && typeof obj !== "string") {
      obj = JSON.stringify(obj);
    }
    return obj;
  };

  cleanTrace = function(traceStr) {
    var filtered, line, trace, _i, _len;
    trace = traceStr.split("\n");
    filtered = [];
    for (_i = 0, _len = trace.length; _i < _len; _i++) {
      line = trace[_i];
      if (/\.html:/.test(line)) {
        line = line.replace(/^.+?@/, '');
        line = line.replace(/http:\/\/.+?\//, '');
        line = line.replace(/(:\d+):\d+$/, '$1');
        filtered.push(line);
      }
    }
    return filtered;
  };

  browser = function(ua) {
    var m;
    if (m = ua.match(/(Android .+?);/)) {
      return m[1];
    } else if (m = ua.match(/(iPhone|iPad|iPod).*?OS ([\d_]+)/)) {
      return 'iOS ' + m[2].replace(/_/g, '.');
    } else if (m = ua.match(/(Chrome\/[\d.]+)/)) {
      return m[1].replace('/', ' ');
    } else if (m = ua.match(/(Safari\/[\d.]+)/)) {
      return m[1].replace('/', ' ');
    } else if (m = ua.match(/(Firefox\/[\d.]+)/)) {
      return m[1].replace('/', ' ');
    } else if (m = ua.match(/\bMS(IE [\d.]+)/)) {
      return m[1];
    } else {
      return ua;
    }
  };

  app.all('/', function(req, res) {
    return res.redirect('/test');
  });

  app.all('/test/echo=?', function(req, res) {
    res.set('Cache-Control', 'no-cache');
    return res.send("" + req.method + " ?" + (dump(req.query)) + "\ncontent-type: " + (mime(req)) + "\naccept: " + req.headers['accept'] + "\n" + (dump(req.body)));
  });

  app.get('/test/jsonp', function(req, res) {
    return res.jsonp({
      query: req.query,
      hello: 'world'
    });
  });

  app.get('/test/jsonpBlah', function(req, res) {
    res.set('Content-Type', 'text/javascript');
    return res.send('blah()');
  });

  app.get('/test/json', function(req, res) {
    var expectedType;
    res.set('Cache-Control', 'no-cache');
    expectedType = req.headers['accept'];
    if (expectedType === '*/*' || /json/.test(expectedType)) {
      if (req.query.invalid) {
        res.set('Content-Type', 'application/json');
        return res.send('invalidJSON');
      } else {
        return res.json({
          query: req.query,
          hello: 'world'
        });
      }
    } else {
      return res.send(400, 'FAIL');
    }
  });

  app.post('/test/create', function(req, res) {
    return res.json({
      action: 'created',
      query: req.query,
      payload: req.body
    });
  });

  app.all('/test/slow', function(req, res) {
    return setTimeout(function() {
      return res.send('DONE');
    }, 200);
  });

  app.get('/test/cached', function(req, res) {
    var now;
    res.set('Cache-Control', 'max-age=2');
    res.set('Expires', new Date(Date.now() + 2000).toUTCString());
    now = new Date();
    return res.send(now.getTime().toString());
  });

  app.get('/test/auth', function(req, res) {
    if (req.headers.authorization === 'Basic emVwdG86ZG9nZQ==') {
      return res.send(200);
    } else {
      res.set('WWW-Authenticate', "Basic realm=\"" + req.query.realm + "\"");
      return res.send(401);
    }
  });

  app.post('/test/log', function(req, res) {
    var params, trace;
    params = req.body;
    trace = cleanTrace(params.trace);
    console.log("[%s] %s: %s", browser(req.headers['user-agent']), params.name, params.message);
    if (trace.length) {
      console.log(trace.join("\n").replace(/^/mg, '  '));
    }
    return res.send(200);
  });

  app.all('/test/error', function(req, res) {
    return res.send(500, 'BOOM');
  });

  if (process.argv[1] === __filename) {
    port = process.argv[2];
    if (!port) {
      port = 3000;
      console.log("Listening on port " + port);
    }
    app.listen(port);
  }

}).call(this);
