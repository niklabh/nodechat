'use strict';

var net = require('net');

var host = process.argv[2];
var port = Number(process.argv[3]);

process.stdin.setEncoding('utf8');

if (!host || !port) {
  return console.log('USAGE:node nodeclient [HOST] [PORT]')
}


var client = net.connect({host:host, port:port}, function() { //'connect' listener
  console.log('$Connected to ['+ host + ':' + port + ']');
  process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null) {
      client.write(chunk);
    }
  });

  process.stdin.on('end', function() {
    process.stdout.write('end');
  });
});

client.on('data', function(data) {
  console.log('#' + host + ':' + port + '# ' + data);
});

client.on('end', function() {
  console.log('client disconnected');
});


process.on('uncaughtException',function(e){
  console.log('$' + e);
});

