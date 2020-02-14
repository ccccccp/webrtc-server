const http = require('http')
const https = require('https')
const express = require('express')
const fs = require('fs')
const socketIo = require('socket.io')
const serveIndex = require('serve-index')
const log4js = require('log4js')


log4js.configure({
  appenders: { file: { type: 'file', filename: 'app.log' } },
  categories: { default: { appenders: ['file'], level: 'debug' } }
});
const logger = log4js.getLogger();

const app = express()
app.use(serveIndex('./public'))
app.use(express.static('./public'))

const http_server = http.createServer(app)
http_server.listen(80,'0.0.0.0')

const options = {
  key:fs.readFileSync('./certs/key.pem'),
  cert:fs.readFileSync('./certs/key-cert.pem')
}
const https_server = https.createServer(options,app)

const io = socketIo.listen(https_server)
io.sockets.on('connection',(socket)=>{
  socket.on('join',(room)=>{//room是个标识
    socket.join(room)
    let myRoom = io.sockets.adapter.rooms[room]
    let users = Object.keys(myRoom.sockets).length
    logger.info(`[on join]房间:${room},当前人数:${users}`)

    // socket.emit('joined',room,socket.id)//给自己回
    // socket.to(room).emit('joined',room,socket.id)//给这个房间其他人回（不包括自己）
    io.in(room).emit('joined',room,socket.id)//给这个房间所有人回
    // socket.broadcast.emit('joined',room,socket.id)//给除自己的整个站点所有人发
  })

  socket.on('leave',(room)=>{//room是个标识
    socket.leave(room)
    let myRoom = io.sockets.adapter.rooms[room]
    let users = Object.keys(myRoom.sockets).length
    logger.info(`[on leave]房间:${room},当前人数:${users}`)
    
    // socket.emit('joined',room,socket.id)//给自己回
    socket.to(room).emit('joined',room,socket.id)//给这个房间其他人回（不包括自己）
    // io.in(room).emit('joined',room,socket.id)//给这个房间所有人回
    // socket.broadcast.emit('joined',room,socket.id)//给除自己的整个站点所有人发
  })

  socket.on('message',(room,data)=>{//room是个标识
    logger.info(`[on message]房间:${room},数据:${data}`)
    
    io.in(room).emit('message',room,data)//给这个房间所有人回
  })
})


https_server.listen(443,'0.0.0.0')