// WebRTC configuration
const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };
  
  // Initialize local media stream
  export const initializeLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  };
  
  // Create a new peer connection
  export const createPeerConnection = (setRemoteStream) => {
    const peerConnection = new RTCPeerConnection(configuration);
    
    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send the candidate to the remote peer via your signaling server
        // signallingService.sendIceCandidate(event.candidate);
        console.log('New ICE candidate:', event.candidate);
      }
    };
    
    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.connectionState);
    };
    
    // Handle receiving remote stream
    peerConnection.ontrack = (event) => {
      console.log('Received remote track');
      setRemoteStream(event.streams[0]);
    };
    
    return peerConnection;
  };
  
  // Add local tracks to peer connection
  export const addLocalTracks = (peerConnection, localStream) => {
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });
  };
  
  // Create and send offer (for initiating a call)
  export const createOffer = async (peerConnection) => {
    try {
      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      await peerConnection.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  };
  
  // Process received offer and create answer
  export const handleOffer = async (peerConnection, offer) => {
    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      return answer;
    } catch (error) {
      console.error('Error handling offer:', error);
      throw error;
    }
  };
  
  // Process received answer
  export const handleAnswer = async (peerConnection, answer) => {
    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error handling answer:', error);
      throw error;
    }
  };
  
  // Add ICE candidate received from remote peer
  export const addIceCandidate = async (peerConnection, candidate) => {
    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
      throw error;
    }
  };
  