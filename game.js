
var Module;

if (typeof Module === 'undefined') Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');

if (!Module.expectedDataFileDownloads) {
  Module.expectedDataFileDownloads = 0;
  Module.finishedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;
(function() {
 var loadPackage = function(metadata) {

  var PACKAGE_PATH;
  if (typeof window === 'object') {
    PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
  } else if (typeof location !== 'undefined') {
      // worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
    } else {
      throw 'using preloaded data can only be done on a web page or in a web worker';
    }
    var PACKAGE_NAME = 'game.data';
    var REMOTE_PACKAGE_BASE = 'game.data';
    if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
      Module['locateFile'] = Module['locateFilePackage'];
      Module.printErr('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
    }
    var REMOTE_PACKAGE_NAME = typeof Module['locateFile'] === 'function' ?
    Module['locateFile'](REMOTE_PACKAGE_BASE) :
    ((Module['filePackagePrefixURL'] || '') + REMOTE_PACKAGE_BASE);

    var REMOTE_PACKAGE_SIZE = metadata.remote_package_size;
    var PACKAGE_UUID = metadata.package_uuid;

    function fetchRemotePackage(packageName, packageSize, callback, errback) {
  console.log('Stitching split game.data assets...');
  Promise.all([
    fetch('game.data.part1').then(r => r.arrayBuffer()),
    fetch('game.data.part2').then(r => r.arrayBuffer())
  ]).then(([p1, p2]) => {
    const combined = new Uint8Array(p1.byteLength + p2.byteLength);
    combined.set(new Uint8Array(p1), 0);
    combined.set(new Uint8Array(p2), p1.byteLength);
    console.log('game.data successfully stitched in memory:', combined.byteLength, 'bytes');
    callback(combined.buffer);
  }).catch(err => {
    console.error('Failed to load split assets:', err);
    if (errback) errback(err);
  });
})();








// --- OVERRIDE EMBEDDED PACKAGE LOADER ---
window.fetchRemotePackage = function(packageName, packageSize, callback, errback) {
  console.log('Stitching split game.data assets in memory...');
  Promise.all([
    fetch('game.data.part1').then(r => {
      if (!r.ok) throw new Error('Failed to fetch part1: ' + r.statusText);
      return r.arrayBuffer();
    }),
    fetch('game.data.part2').then(r => {
      if (!r.ok) throw new Error('Failed to fetch part2: ' + r.statusText);
      return r.arrayBuffer();
    })
  ]).then(([p1, p2]) => {
    const combined = new Uint8Array(p1.byteLength + p2.byteLength);
    combined.set(new Uint8Array(p1), 0);
    combined.set(new Uint8Array(p2), p1.byteLength);
    console.log('game.data successfully stitched:', combined.byteLength, 'bytes');
    callback(combined.buffer);
  }).catch(err => {
    console.error('Failed to load split assets:', err);
    if (errback) errback(err);
  });
};

