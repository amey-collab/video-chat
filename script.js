
document.addEventListener('DOMContentLoaded', function() {
  const roomSelection = document.getElementById('roomSelection');
  const createRoomBtn = document.getElementById('createRoomBtn');
  const joinRoomBtn = document.getElementById('joinRoomBtn');
  const exitBtn = document.getElementById('exitBtn');
  const joinRoomSection = document.getElementById('joinRoomSection');
  const joinWithLinkBtn = document.getElementById('joinWithLinkBtn');
  const roomLinkInput = document.getElementById('roomLinkInput');


  const videoChatWindow = document.querySelector('your-video-chat-container-selector');
  if (videoChatWindow) videoChatWindow.style.display = 'none';

  
  createRoomBtn.addEventListener('click', function() {
      roomSelection.style.display = 'none';
      if (videoChatWindow) videoChatWindow.style.display = 'block';
     
  });


  joinRoomBtn.addEventListener('click', function() {
      joinRoomSection.style.display = 'block';
  });


  joinWithLinkBtn.addEventListener('click', function() {
      const roomLink = roomLinkInput.value.trim();
      if (roomLink) {
          roomSelection.style.display = 'none';
          if (videoChatWindow) videoChatWindow.style.display = 'block';
          joinRoom(roomLink);  
      } else {
          alert('Please enter a valid room link');
      }
  });

  
  exitBtn.addEventListener('click', function() {
      window.close(); 
      window.location.href = 'about:blank';
  });
});


function joinRoom(roomLink) {
  console.log(`Joining room with link: ${roomLink}`);
  

  const videoChatWindow = document.querySelector('your-video-chat-container-selector');
  if (videoChatWindow) videoChatWindow.style.display = 'block';


}


document.addEventListener('DOMContentLoaded', function () {
  const chatToggleBtn = document.getElementById('chatToggleBtn');
  const chatSection = document.getElementById('chat-section');

  chatToggleBtn.addEventListener('click', function () {
    if (chatSection.style.display === 'none' || chatSection.style.display === '') {
      chatSection.style.display = 'flex'; 
    } else {
      chatSection.style.display = 'none';
    }
  });
});
document.addEventListener('DOMContentLoaded', function () {

  const sendMessageBtn = document.getElementById('send-message');
  const messageInput = document.getElementById('message-input');
  const messagesContainer = document.getElementById('messages');


  sendMessageBtn.addEventListener('click', function () {
    const message = messageInput.value.trim();

    if (message) {
      
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message');
      messageDiv.textContent = message;

   
      messagesContainer.appendChild(messageDiv);

     
      messageInput.value = '';
      messageInput.focus(); 
    }
  });


  messageInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      sendMessageBtn.click();
    }
  });
});

let myStream;
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.classList.add('user-video'); 


document.getElementById('createRoomBtn').addEventListener('click', () => {
  currentRoomId = Math.random().toString(36).substr(2, 9);
  window.history.pushState({}, '', `?room=${currentRoomId}`);
  document.getElementById('roomSelection').style.display = 'none';

 
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {
    myStream = stream;
    addVideoStream(myVideo, stream);
    muteUserAudio(stream);

    document.querySelector('.app-container').style.display = 'flex';

    

  }).catch(err => {
    console.error('Access denied:', err);
    alert("Please allow camera & mic access to start the call.");
  });
});



function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.appendChild(video);
}
function muteUserAudio(stream) {
  const audioTracks = stream.getAudioTracks();

  audioTracks.forEach(track => {
    track.enabled = false; 
  });
  

  stream.getAudioTracks().forEach(track => {
    track.enabled = true; 
  });
}


const videoToggleBtn = document.getElementById('video-btn');

videoToggleBtn.addEventListener('click', () => {
  if (!myStream) return; 

  const videoTrack = myStream.getVideoTracks()[0];
  videoTrack.enabled = !videoTrack.enabled;

 
  const icon = videoToggleBtn.querySelector('i');
  icon.classList.toggle('fa-video-slash');
  icon.classList.toggle('fa-video');
});

const audioToggleBtn = document.getElementById('mute-btn');
audioToggleBtn.addEventListener('click', () => {
  if (!myStream) return; 

  const audioTrack = myStream.getAudioTracks()[0];
  audioTrack.enabled = !audioTrack.enabled; 

  const icon = audioToggleBtn.querySelector('i');
  icon.classList.toggle('fa-microphone-slash');
  icon.classList.toggle('fa-microphone');
});
const screenBtn = document.getElementById('screen-btn');
let isScreenSharing = false;
let originalVideoTrack;
let screenVideoElement;

screenBtn.addEventListener('click', async () => {
  if (!isScreenSharing) {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];


      originalVideoTrack = localStream.getVideoTracks()[0];

      
      localStream.removeTrack(originalVideoTrack);
      localStream.addTrack(screenTrack);

     
      for (let conn of Object.values(peers)) {
        const sender = conn.peerConnection.getSenders().find(s => s.track.kind === 'video');
        if (sender) sender.replaceTrack(screenTrack);
      }

      
      screenVideoElement = document.createElement('video');
      screenVideoElement.srcObject = screenStream;
      screenVideoElement.autoplay = true;
      screenVideoElement.muted = true;
      screenVideoElement.classList.add('screen-preview');
      document.getElementById('video-grid').appendChild(screenVideoElement);

      isScreenSharing = true;

      screenTrack.onended = () => {
        stopScreenShare();
      };

    } catch (err) {
      console.error('Screen share error:', err);
    }
  } else {
    stopScreenShare();
  }
});

function stopScreenShare() {
  if (!originalVideoTrack) return;

  const screenTrack = localStream.getVideoTracks()[0];
  localStream.removeTrack(screenTrack);
  localStream.addTrack(originalVideoTrack);

  for (let conn of Object.values(peers)) {
    const sender = conn.peerConnection.getSenders().find(s => s.track.kind === 'video');
    if (sender) sender.replaceTrack(originalVideoTrack);
  }

 
  if (screenVideoElement) {
    screenVideoElement.remove();
    screenVideoElement = null;
  }

  isScreenSharing = false;
}
function makeDraggableResizable(container) {
  let isDragging = false;
  let offsetX, offsetY;

  container.addEventListener('mousedown', (e) => {
    if (e.target.tagName !== 'VIDEO') {
      isDragging = true;
      offsetX = e.clientX - container.offsetLeft;
      offsetY = e.clientY - container.offsetTop;
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      container.style.left = `${e.clientX - offsetX}px`;
      container.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}


document.querySelectorAll('.video-container').forEach(container => {
  makeDraggableResizable(container);
});
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });

  const container = document.createElement('div');
  container.classList.add('video-container');
  container.appendChild(video);
  document.getElementById('video-grid').appendChild(container);

  makeDraggableResizable(container); 
}
// Get elements
const inviteBtn = document.getElementById('invite-btn');
const linkModal = document.getElementById('link-modal');
const inviteLinkInput = document.getElementById('invite-link');
const copyLinkBtn = document.getElementById('copy-link');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const joinRoomSection = document.getElementById('joinRoomSection');
const roomLinkInput = document.getElementById('roomLinkInput');
const joinWithLinkBtn = document.getElementById('joinWithLinkBtn');


let currentRoomId = "";


document.getElementById('createRoomBtn').addEventListener('click', () => {
  currentRoomId = Math.random().toString(36).substr(2, 9); 
  window.history.pushState({}, '', `?room=${currentRoomId}`);
  document.getElementById('roomSelection').style.display = 'none';
  document.querySelector('.app-container').style.display = 'flex';
});


inviteBtn.addEventListener('click', () => {
  if (!currentRoomId) {
    alert("Create or join a room first!");
    return;
  }
  const link = `${window.location.origin}${window.location.pathname}?room=${currentRoomId}`;
  inviteLinkInput.value = link;
  linkModal.style.display = 'block';
});


copyLinkBtn.addEventListener('click', () => {
  inviteLinkInput.select();
  document.execCommand('copy');
  alert("Link copied!");
});

joinRoomBtn.addEventListener('click', () => {
  joinRoomSection.style.display = 'block';
});


joinWithLinkBtn.addEventListener('click', () => {
  const link = roomLinkInput.value.trim();
  const url = new URL(link);
  const roomId = url.searchParams.get('room');
  if (roomId) {
    currentRoomId = roomId;
    window.history.pushState({}, '', `?room=${roomId}`);
    document.getElementById('roomSelection').style.display = 'none';
    document.querySelector('.app-container').style.display = 'flex';
  } else {
    alert("Invalid link.");
  }
});


window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const roomId = params.get('room');
  
  if (roomId) {
    currentRoomId = roomId;
    document.getElementById('roomSelection').style.display = 'none';
    document.querySelector('.app-container').style.display = 'flex';
    
   
    navigator.mediaDevices.getUserMedia({
      video: true,  
      audio: true   
    }).then(stream => {
      myStream = stream;
      addVideoStream(myVideo, stream);  
      muteUserAudio(stream);            
    }).catch(err => {
      console.error('Media access error:', err); 
      alert("Please allow camera and mic access.");
    });
  }
});



window.addEventListener('click', (e) => {
  if (e.target === linkModal) {
    linkModal.style.display = 'none';
  }
});
document.getElementById("end-call").addEventListener("click", () => {
  document.body.innerHTML = "<h1 style='text-align:center; margin-top: 40vh;'>Call Ended. Goodbye! 👋</h1>";
});
