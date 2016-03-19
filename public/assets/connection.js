var peer;
var connection;

function create() {
  peer = new Peer(3, { key: 'ofs1nu2rh3t0529' });

  peer.on('connection', function(c) {
    connection = c;
    connection.on('open', function() {
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
  peer = new Peer(4, { key: 'ofs1nu2rh3t0529' });
  connection = peer.connect(3);
  connection.on('data', function(data) {
    $('#connection_status').html(data.name);
    key_lookup(data);
  });
}

function send(data) {
  if(undefined != connection){
    connection.send(data);
  }
}
