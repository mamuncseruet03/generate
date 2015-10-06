require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var rimraf = require('rimraf');
var Generate = require('..');
var app;

var fixtures = path.join(__dirname, 'fixtures/*.txt');
var outpath = path.join(__dirname, 'actual');

function fixture(name) {
  return path.join(__dirname, 'fixtures', name);
}

function exists(name) {
  var fp = path.join(__dirname, 'actual', name);
  return fs.existsSync(fp);
}

describe('copy()', function() {
  beforeEach(function (done) {
    rimraf(outpath, done);
    app = new Generate();
  });

  afterEach(function (done) {
    rimraf(outpath, done);
  });

  describe('streams', function () {
    it('should use the cwd passed on the app options', function (done) {
      app = new Generate({cwd: 'test/fixtures'});

      var dest = path.join(__dirname, 'actual');
      app.copy('c.txt', dest)
        .on('data', function (file) {
          assert.equal(typeof file, 'object');
          assert.equal(file.contents.toString(), 'CCC');
        })
        .on('end', function () {
          assert(exists('c.txt'));
          done();
        });
    });

    it('should use the cwd passed on the copy options', function (done) {
      var dest = path.join(__dirname, 'actual');
      app.copy('b.txt', dest, {cwd: 'test/fixtures'})
        .on('data', function (file) {
          assert.equal(typeof file, 'object');
          assert.equal(file.contents.toString(), 'BBB');
        })
        .on('end', function () {
          assert(exists('b.txt'));
          done();
        });
    });

    it('should copy a single file', function (done) {
      app.copy(fixture('a.txt'), path.join(__dirname, 'actual'))
        .on('data', function (file) {
          assert.equal(typeof file, 'object');
          assert.equal(file.contents.toString(), 'AAA');
        })
        .on('end', function () {
          assert(exists('a.txt'));
          done();
        });
    });

    it('should copy a glob of files', function (done) {
      app.copy(fixtures, path.join(__dirname, 'actual'))
        .on('data', function (file) {
          assert.equal(typeof file, 'object');
        })
        .on('end', function () {
          assert(exists('a.txt'));
          assert(exists('b.txt'));
          assert(exists('c.txt'));
          done();
        });
    });
  });
});
