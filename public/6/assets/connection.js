var peer;
var connection;

function create() {
  peer = new Peer(Math.floor((Math.random()*1000)+1), { key: 'ofs1nu2rh3t0529' });

  peer.on('open', function(id) {
    $('#dest_id').val('Share your session id: ' + id);
  });

  peer.on('connection', function(c) {
    connection = c;
    connection.on('data', play(data));
  });
}

function connect() {
  peer = new Peer({ key: 'ofs1nu2rh3t0529' });
  connection = peer.connect($('#dest_id').val());
  connection.on('data', play(data));
}

function send(data) {
  if(undefined != connection){
    connection.send(data);
  }
}
