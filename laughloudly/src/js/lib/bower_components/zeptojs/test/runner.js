(function() {
  var args, fs, loadNextSuite, modules, page, prefix, suites, system, waitFor;

  system = require('system');

  fs = require('fs');

  args = system.args.slice(1);

  prefix = args.shift() || ("file://" + fs.workingDirectory + "/");

  if (args.length > 0) {
    suites = args;
  } else {
    modules = 'zepto ajax callbacks data deferred ajax_deferred detect touch event form fx selector stack'.split(/\s+/);
    suites = modules.map(function(name) {
      return "test/" + name + ".html";
    });
  }

  page = require('webpage').create();

  page.onConsoleMessage = function(msg) {
    return console.log(msg);
  };

  page.onError = function(msg, trace) {
    return console.log('ERROR: ' + msg);
  };

  waitFor = function(testFn, onReady, timeout) {
    var interval, start;
    if (timeout == null) {
      timeout = 30000;
    }
    start = new Date();
    return interval = setInterval(function() {
      if (testFn()) {
        clearInterval(interval);
        return onReady();
      } else if (new Date() - start > timeout) {
        console.log("timed out.");
        return phantom.exit(1);
      }
    }, 100);
  };

  loadNextSuite = function() {
    var url;
    if (!suites.length) {
      return phantom.exit();
    } else {
      url = suites.shift() + "?verbosity=WARN";
      if (!/:\/\//.test(url)) {
        url = prefix + url;
      }
      return page.open(url, function(status) {
        if (status !== "success") {
          console.log("failed opening " + url);
          phantom.exit(1);
        }
        return waitFor(function() {
          return page.evaluate(function() {
            var res;
            res = document.getElementById('results');
            if (res) {
              return /finished/.test(res.className);
            }
          });
        }, function() {
          var passed;
          passed = page.evaluate(function() {
            var paths, res;
            res = document.getElementById('results');
            paths = location.pathname.split('/');
            console.log(("" + paths[paths.length - 1] + " - ") + res.textContent);
            return /passed/.test(res.className);
          });
          if (passed) {
            return loadNextSuite();
          } else {
            return phantom.exit(1);
          }
        });
      });
    }
  };

  loadNextSuite();

}).call(this);
