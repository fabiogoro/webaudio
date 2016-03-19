var peer;
var connection;

function create() {
  peer = new Peer(1, { key: 'ofs1nu2rh3t0529' });

  peer.on('connection', function(c) {
    connection = c;
    connection.on('open', function() {
      data = {name: 'Succefully connected.', action: 'connect'};
      $('#connection_status').html(data.name);
      connection.send(data);
    });
    connection.on('data', function(data) {
      $('#connection_status').html(data.name);
      if(data.action==='play') {
        switch (data.name) {
          case 'C4': play(c4); break;
          case 'D4': play(d4); break;
          case 'E4': play(e4); break;
          case 'F4': play(f4); break;
          case 'G4': play(g4); break;
          case 'A4': play(a4); break;
          case 'B4': play(b4); break;
          case 'C5': play(c5); break;
        }
      }
      if(data.action==='stop') {
        switch (data.name) {
          case 'C4': stop(c4); break;
          case 'D4': stop(d4); break;
          case 'E4': stop(e4); break;
          case 'F4': stop(f4); break;
          case 'G4': stop(g4); break;
          case 'A4': stop(a4); break;
          case 'B4': stop(b4); break;
          case 'C5': stop(c5); break;
        }
      }
    });
  });
}

function connect() {
  peer = new Peer(2, { key: 'ofs1nu2rh3t0529' });
  connection = peer.connect(1);
  connection.on('data', function(data) {
    $('#connection_status').html(data.name);
  });
}
