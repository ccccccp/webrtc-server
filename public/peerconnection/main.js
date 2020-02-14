const localVideo = document.querySelector('video#localvideo')
const remoteVideo = document.querySelector('video#remotevideo')
const startBtn = document.querySelector('button#start')
const callBtn = document.querySelector('button#call')
const hangUpBtn = document.querySelector('button#hangup')
const localSdp = document.querySelector('textarea#local-sdp')
const remoteSdp = document.querySelector('textarea#remote-sdp')

let localStream = null
let pc1 = null,pc2 = null


function onMediaStream(mediaStream){
  localVideo.srcObject = mediaStream
  localStream = mediaStream
}
function start(){
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    return console.error('getUserMedia is not supported!')
  }
  const constraints = {
    video:true,
    audio:true
  }
  navigator.mediaDevices.getUserMedia(constraints).then(onMediaStream)
  .catch((err)=>{
    console.error('getUserMedia failed!',err)
  })
}
function onRemoteStream(e){
  remoteVideo.srcObject = e.streams[0]
}
function onGetAnswer(desc){
  pc2.setLocalDescription(desc)
  remoteSdp.value = desc.sdp
  //send desc to signal
  //pc1 recive desc from signal

  pc1.setRemoteDescription(desc)
}
function onGetOffer(desc){
  pc1.setLocalDescription(desc)//调用完收集candidate
  localSdp.value = desc.sdp
  //send desc to singnal
  //receive desc from signal

  pc2.setRemoteDescription(desc)
  const answer = pc2.createAnswer()//不需要传入参数
  answer.then(onGetAnswer).catch((err)=>{
    console.error('create answer failed!')
  })

}
function call(){
  pc1 = new RTCPeerConnection({})
  pc2 = new RTCPeerConnection({})
  pc1.onicecandidate = (e)=>{
    pc2.addIceCandidate(e.candidate).then(()=>{
      console.log('pc2 add pc1 candidate success')
    }).catch((err)=>{
      console.error('pc2 add pc1 candidate failed!',err)
    })
  }
  pc2.onicecandidate = (e)=>{
    pc1.addIceCandidate(e.candidate).then(()=>{
      console.log('pc1 add pc2 candidate success')
    }).catch((err)=>{
      console.error('pc1 add pc2 candidate failed!',err)
    })
  }
  pc2.ontrack = onRemoteStream
  localStream.getTracks().forEach((track)=>{
    pc1.addTrack(track,localStream)
  })
  const offerOptions = {
    offerToRecieveAudio:true,
    offerToReceiveVideo:true
  }
  pc1.createOffer(offerOptions)
  .then(onGetOffer)
  .catch(()=>{
    console.error('create offer failed!')
  })
  
}
function hangUp(){
  pc1 && pc1.close()
  pc2 && pc2.close()
  pc1 = null
  pc2 = null
}
startBtn.onclick = start
callBtn.onclick = call
hangUpBtn.onclick = hangUp