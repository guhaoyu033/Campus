import localtunnel from 'localtunnel';

const tunnel = await localtunnel({
  port: 4173,
  subdomain: 'campusflow-' + Math.random().toString(36).substring(2, 8)
});

console.log('Your public URL:');
console.log('  ' + tunnel.url);
console.log('');
console.log('Tunnel is running. Press Ctrl+C to stop.');

tunnel.on('close', () => {
  console.log('Tunnel closed');
});

tunnel.on('error', (err) => {
  console.error('Tunnel error:', err);
});

process.on('SIGINT', () => {
  tunnel.close();
  process.exit(0);
});
