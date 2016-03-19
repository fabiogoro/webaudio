$(document).ready(function() {
  peer = new Peer({ key: 'lwjd5qra8257b9', debug: 3});

  peer.on('open', function(id){
    $('#my_id').html('My peer ID is: ' + id);

    $('#connect_button').attr('disabled',false);
  });

  peer.on('connection', function(connection) {
    connection.on('open', function() {
      data = 'Hello, peer'
      $('#helloworld').append(data);
      connection.send(data);
    });
    connection.on('data', function(data) {
      $('#helloworld').append(data);
    });
  });
});

function connect() {
  var c = peer.connect($('#dest_id').val());
  c.on('data', function(data) {
    $('#helloworld').append(data);
  });
}
