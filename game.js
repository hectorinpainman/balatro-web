var Module = typeof Module !== 'undefined' ? Module : {};

if (!Module.expectedDataFileDownloads) {
  Module.expectedDataFileDownloads = 0;
  Module.finishedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;

(function() {
  function loadPackage() {
    console.log('Fetching game.data.part1 and game.data.part2...');
    
    Promise.all([
      fetch('game.data.part1').then(function(r) {
        if (!r.ok) throw new Error('Part 1 HTTP ' + r.status);
        return r.arrayBuffer();
      }),
      fetch('game.data.part2').then(function(r) {
        if (!r.ok) throw new Error('Part 2 HTTP ' + r.status);
        return r.arrayBuffer();
      })
    ]).then(function(buffers) {
      var p1 = new Uint8Array(buffers[0]);
      var p2 = new Uint8Array(buffers[1]);
      var combined = new Uint8Array(p1.byteLength + p2.byteLength);
      combined.set(p1, 0);
      combined.set(p2, p1.byteLength);
      
      console.log('Stitch complete! Total bytes:', combined.byteLength);
      
      Module['FS_createDataFile']('/', 'game.data', combined, true, true, true);
      Module.finishedDataFileDownloads++;
      if (typeof removeRunDependency === 'function') {
        removeRunDependency('datafile_game.data');
      }
    }).catch(function(err) {
      console.error('Failed to load split assets:', err);
    });
  }

  if (Module['calledRun']) {
    loadPackage();
  } else {
    Module.preRun = Module.preRun || [];
    Module.preRun.push(function() {
      if (typeof addRunDependency === 'function') {
        addRunDependency('datafile_game.data');
      }
    });
    Module.postRun = Module.postRun || [];
    Module.postRun.push(loadPackage);
  }
})();
