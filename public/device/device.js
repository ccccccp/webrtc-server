window.navigator.mediaDevices.enumerateDevices().then(onDevice)

function onDevice(devices){
  console.log('devices:',devices)
  let inputSelectDom = document.getElementById('inputSource')
  let outputSelectDom = document.getElementById('outputSource')
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