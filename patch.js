const originalFetch = window.fetch;
window.fetch = async function(url, ...args) {
  if (typeof url === 'string' && url.includes('game.data')) {
    const [p1, p2] = await Promise.all([
      originalFetch('game.data.part1').then(r => r.arrayBuffer()),
      originalFetch('game.data.part2').then(r => r.arrayBuffer())
    ]);
    const combined = new Uint8Array(p1.byteLength + p2.byteLength);
    combined.set(new Uint8Array(p1), 0);
    combined.set(new Uint8Array(p2), p1.byteLength);
    return new Response(combined);
  }
  return originalFetch(url, ...args);
};
