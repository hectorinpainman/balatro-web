window.loadBalatroData = async function() {
  const [p1, p2] = await Promise.all([
    fetch('game.data.part1').then(r => r.arrayBuffer()),
    fetch('game.data.part2').then(r => r.arrayBuffer())
  ]);
  const combined = new Uint8Array(p1.byteLength + p2.byteLength);
  combined.set(new Uint8Array(p1), 0);
  combined.set(new Uint8Array(p2), p1.byteLength);
  return combined;
};
