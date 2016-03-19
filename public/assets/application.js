var peer = new Peer({key: 'ofs1nu2rh3t0529'});

peer.on('open', function(id) {
  $("#my_id").html('My peer ID is: ' + id);
});

function connect() {
  var conn = peer.connect($("#dest_id").val());
  conn.on('open', function() {
    // Receive messages
    conn.on('data', function(data) {
      console.log('Received', data);
    });

    conn.send('Hello!');
  });
}
