var peer;
var connection;

function create() {
  my_id = Math.floor((Math.random() * 100000) + 1);
  peer = new Peer(my_id, { key: 'ofs1nu2rh3t0529' });
  $('#dest_id').val('Share your session id: ' + my_id);

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
  peer = new Peer({ key: 'ofs1nu2rh3t0529' });
  connection = peer.connect($('#dest_id').val());
  $('#dest_id').attr('disabled', true);
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
