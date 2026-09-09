(function() {
  let combinedBuffer = null;

  async function getCombinedData() {
    if (combinedBuffer) return combinedBuffer;
    const [p1, p2] = await Promise.all([
      fetch('game.data.part1').then(r => r.arrayBuffer()),
      fetch('game.data.part2').then(r => r.arrayBuffer())
    ]);
    combinedBuffer = new Uint8Array(p1.byteLength + p2.byteLength);
    combinedBuffer.set(new Uint8Array(p1), 0);
    combinedBuffer.set(new Uint8Array(p2), p1.byteLength);
    return combinedBuffer;
  }

  const OriginalXHR = window.XMLHttpRequest;
  function PatchedXHR() {
    const xhr = new OriginalXHR();
    const origOpen = xhr.open;
    const origSend = xhr.send;
    let isGameData = false;

    xhr.open = function(method, url) {
      if (typeof url === 'string' && url.includes('game.data')) {
        isGameData = true;
      }
      return origOpen.apply(this, arguments);
    };

    xhr.send = function() {
      if (isGameData) {
        getCombinedData().then(buffer => {
          Object.defineProperty(xhr, 'response', { value: buffer.buffer, writable: false });
          Object.defineProperty(xhr, 'status', { value: 200, writable: false });
          Object.defineProperty(xhr, 'readyState', { value: 4, writable: false });
          if (typeof xhr.onload === 'function') xhr.onload();
          if (typeof xhr.onreadystatechange === 'function') xhr.onreadystatechange();
        }).catch(err => console.error("Error loading split game.data:", err));
        return;
      }
      return origSend.apply(this, arguments);
    };

    return xhr;
  }
  window.XMLHttpRequest = PatchedXHR;
})();
