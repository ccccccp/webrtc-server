const userNameInput = document.querySelector('input#username')
const roomIdInput = document.querySelector('input#room')
const connectBtn = document.querySelector('button#connect')
const disconnectBtn = document.querySelector('button#disconnect')
const statusDom = document.querySelector('#status')
const outputDom = document.querySelector('textarea#output')
const textarea = document.querySelector('textarea#send-content')
const sendBtn = document.querySelector('button#send')
let roomId = ''
let socket = null
disconnectBtn.onclick=function(){
  socket.emit('leave',roomId)
}
connectBtn.onclick = function(){
  roomId = roomIdInput.value
  if(!roomId){
    return alert('请输入房间ID')
  }
  //connect
  socket = io.connect('https://localhost')
  //recieve message
  socket.on('joined',(roomId,uid)=>{
    connectBtn.disabled = true
    textarea.disabled = false
    sendBtn.disabled = false
    disconnectBtn.disabled = false
  })
  socket.on('leaved',(roomId,uid)=>{
    connectBtn.disabled = false
    textarea.disabled = true
    sendBtn.disabled = true
    disconnectBtn.disabled = true
  })
  socket.on('message',(roomId,data)=>{
    outputDom.value =  outputDom.value + '\n' + data
  })
  //send message
  socket.emit('join',roomId)
}

//send-btn
sendBtn.onclick = function(){
  let data = textarea.value
  let sendVal = `${userNameInput.value}:${data}`
  socket.emit('message',roomId,sendVal)
}