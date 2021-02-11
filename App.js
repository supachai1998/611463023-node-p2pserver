import React, { useState, useEffect } from 'react';
import './App.css';
import Peer from 'peerjs';
var peer = new Peer({ host: 'localhost', port: 9000, path: '/myapp', secure: false });

// ค่า default สำหรับ conn
var conn = peer.connect();

function App() {

  const [id, setId] = useState(0);
  const [dest, setDest] = useState('dest-peer-id');
  const [connect, setConnect] = useState(false);

  const [sendMessage, setSendMessage] = useState('send something');

  const [receiveMessage, setReceiveMessage] = useState('');


  useEffect(() => {
    // เชื่อมต่อกับ server เพื่อรับ ข้อมูล id ของตัวเอง
    peer.on('open', function (id) {
      console.log('My peer ID is: ' + id);
      setId(id);
    });

    // for Client Receive Connection
    // เรียกเมื่อ ได้รับแจ้งจากเซิฟเวอร์ว่า มีการเชื่อมต่อเข้ามา
    peer.on('connection', function (newConn) {
      setConnect(true);
      // สำหรับปุ่ม send จะได้กดส่งได้
      conn = newConn;
      setDest(newConn.peer);
      newConn.on('open', function () {
        // Send messages when open connection
        newConn.send('Hello!');
      });
      // Receive messages
      newConn.on('data', function (data) {
        setReceiveMessage(data);
      });
    });

  });


  function startConnection() {
    conn = peer.connect(dest);
    //for Client Establish Connection
    conn.on('open', function () {
      // Receive messages
      setConnect(true);
      conn.on('data', function (data) {
        setReceiveMessage(data);
      });
    });
  }

  function send() {
    // Send messages
    conn.send(sendMessage);
  }


  return (
    <div className="App">
      <header className="App-header">
        <h3>Simple P2P Web App with PeerJS</h3>
        <h4>Peer ID: {id}</h4>
        {
          connect ?
            <h6 style={{ color: "green" }}>Connected</h6>
            :
            <h6 style={{ color: "red" }}>Not Connected</h6>
        }
        <input type="text" placeholder={dest} name="dest" onChange={e => setDest(e.target.value)} />
        <button type="submit" onClick={startConnection}>Connect</button>
        <br />
        <input type="text" placeholder={sendMessage} name="sendMessage" onChange={e => setSendMessage(e.target.value)} />
        <button type="submit" onClick={send}>Send Message</button>
        <h5>Receive Message: {receiveMessage}</h5>
      </header>
    </div>
  );
}

export default App;
