var peer;
var connection;

function create() {
  peer = new Peer(1, { key: 'ofs1nu2rh3t0529' });

  peer.on('open', function(id) {
    $('#dest_id').val('Share your session id: ' + id);
  });

  peer.on('connection', function(c) {
    connection = c;
    connection.on('open', function(id) {
      data = {name: 'Succefully connected.', action: 'connect'};
      $('#connection_status').html(data.name);
      connection.send(data);
    });
    connection.on('data', function(data) {
      $('#connection_status').html(data.name);
      key_lookup(data);
    });
  });
}

function connect() {
  peer = new Peer({ key: 'ofs1nu2rh3t0529' });
  connection = peer.connect($('#dest_id').val());
  connection.on('data', function(data) {
    $('#connection_status').html(data.name);
    key_lookup(data);
  });
}

function close() {
  peer.disconnect();
}

function send(data) {
  if(undefined != connection){
    connection.send(data);
  }
}
