if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
  console.error('getUserMedia is not supported!')
}
window.navigator.mediaDevices.enumerateDevices().then(onDevice)
let deviceId = ''
function onDevice(devices){
  console.log('devices:',devices)
  
  devices.forEach((device)=>{
    if(device.kind === 'audioinput'){
      let option = document.createElement('option')
      option.value = device.deviceId
      option.innerHTML = device.deviceId
      inputSelectDom.appendChild(option)
    }else if(device.kind === 'audiooutput'){
      let option = document.createElement('option')
      option.value = device.deviceId
      option.innerHTML = device.deviceId
      outputSelectDom.appendChild(option)
    }
  })
}
var videoDom = document.querySelector('video#player')
var openBtn = document.querySelector('button#open')
var closeBtn = document.querySelector('button#close')
let inputSelectDom = document.getElementById('inputSource')
let outputSelectDom = document.getElementById('outputSource')

inputSelectDom.onchange = function(e){
  let deviceId = e.target.value
  console.log(deviceId)
  start()
}
function start(){
  openBtn.disabled = true
  let constrant = {
    video:true,
    audio:true,
    deviceId
  }
  navigator.mediaDevices.getUserMedia(constrant).then(onGetMediaStream).catch(onFailed)
}
function close(){

}
function onGetMediaStream(stream){
  videoDom.srcObject = stream
}
function onFailed(err){
  console.error(err)
}
openBtn.addEventListener('click',start)
closeBtn.addEventListener('click',close)