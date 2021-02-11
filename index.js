const { PeerServer } = require("peer");
const fs = require('fs');
const port = 9000;
const path = "/myapp";

const peerServer = PeerServer({ port: port, path: path });
peerServer.on("connection", (client) => {
  console.log(`:N:--->> id: ${client.id} | token: ${client.token}`);
});
peerServer.on("disconnect", (client) => {
  console.log(`<<---:E: id: ${client.id} | token: ${client.token}`);
});


console.log(`peer server running on localhost:${port}${path}`);
