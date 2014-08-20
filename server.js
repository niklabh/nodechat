#!/usr/bin/env node

'use strict';

var net = require('net');
var os = require('os');

process.stdin.setEncoding('utf8');

var port = Number(process.argv[2]);

if (!port) {
  return console.log('USAGE:node nodechat [PORT]')
}

var addresses = [];
var ifaces=os.networkInterfaces();
for (var dev in ifaces) {
  var alias=0;
  ifaces[dev].forEach(function(details){
    if (details.family=='IPv4' && details.address !== '127.0.0.1') {
      addresses.push(dev + (alias ? ':' + alias : ' ') + details.address);
      ++alias;
    }
  });
}

var server = net.createServer(function (c) { //'connection' listener
  var addr = c.address();
  console.log('$Connected [' + addr.address + ':' + addr.port + ']');
  c.on('data', function (data){
    console.log('#' + addr.address + ':' + addr.port + '# ' + data);
  });
  c.on('end', function() {
    console.log('server disconnected');
  });
  process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null) {
      c.write(chunk);
    }
  });
  process.stdin.on('end', function() {
    process.stdout.write('end');
  });
});


server.listen(port, function() { //'listening' listener
  console.log('$Started on: ' + addresses + ' : ' + port);
});

process.on('uncaughtException',function(e){
  console.log('$' + e);
});

