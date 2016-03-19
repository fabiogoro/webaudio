var peer = new Peer({key: 'lwjd5qra8257b9'});

peer.on('open', function(id) {
  console.log('My peer ID is: ' + id);
});

var conn = peer.connect('dest-peer-id');

conn.on('open', function() {
  // Receive messages
  conn.on('data', function(data) {
    console.log('Received', data);
  });

  // Send messages
  conn.send('Hello!');
});
