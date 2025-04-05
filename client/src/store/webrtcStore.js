import {create} from 'zustand';

const useWebRTCStore = create((set, get) => ({
  localStream: null,
  remoteStream: null,
  peerConnection: null,
  callStatus: 'idle', // 'idle', 'calling', 'in-progress', 'ended'
  callType: null, // 'video' or 'audio'
  isCaller: false,
  callData: null,

  // Initialize peer connection
  initPeerConnection: () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // Add your TURN servers here if needed
      ]
    };
    const pc = new RTCPeerConnection(configuration);
    set({ peerConnection: pc });
    return pc;
  },

  // Start local stream
  startLocalStream: async (type = 'video') => {
    try {
      const constraints = {
        video: type === 'video' ? true : false,
        audio: true
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      set({ localStream: stream, callType: type });
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  },

  // Setup call as caller
  setupCaller: async (chatId, recipientId) => {
    const pc = get().peerConnection || get().initPeerConnection();
    const localStream = get().localStream || await get().startLocalStream(get().callType);

    // Add local stream tracks to peer connection
    localStream.getTracks().forEach(track => {
      pc.addTrack(track, localStream);
    });

    // ICE candidate handler
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // Send the candidate to the other peer via signaling
        const socket = useChatStore.getState().getSocket();
        socket.emit('webrtc-candidate', {
          chatId,
          to: recipientId,
          candidate: event.candidate
        });
      }
    };

    // Track remote stream
    pc.ontrack = (event) => {
      const remoteStream = new MediaStream();
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
      set({ remoteStream });
    };

    // Create offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Send offer via signaling
    const socket = useChatStore.getState().getSocket();
    socket.emit('webrtc-offer', {
      chatId,
      to: recipientId,
      offer,
      callType: get().callType
    });

    set({ 
      callStatus: 'calling',
      isCaller: true,
      callData: { chatId, recipientId }
    });
  },

  // Setup call as receiver
  setupReceiver: async (offer, chatId, callerId, callType) => {
    const pc = get().peerConnection || get().initPeerConnection();
    const localStream = get().localStream || await get().startLocalStream(callType);

    // Add local stream tracks to peer connection
    localStream.getTracks().forEach(track => {
      pc.addTrack(track, localStream);
    });

    // ICE candidate handler
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // Send the candidate to the other peer via signaling
        const socket = useChatStore.getState().getSocket();
        socket.emit('webrtc-candidate', {
          chatId,
          to: callerId,
          candidate: event.candidate
        });
      }
    };

    // Track remote stream
    pc.ontrack = (event) => {
      const remoteStream = new MediaStream();
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
      set({ remoteStream });
    };

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    // Send answer via signaling
    const socket = useChatStore.getState().getSocket();
    socket.emit('webrtc-answer', {
      chatId,
      to: callerId,
      answer
    });

    set({ 
      callStatus: 'in-progress',
      isCaller: false,
      callData: { chatId, callerId }
    });
  },

  // Handle received answer
  handleAnswer: async (answer) => {
    const pc = get().peerConnection;
    if (!pc) return;

    await pc.setRemoteDescription(new RTCSessionDescription(answer));
    set({ callStatus: 'in-progress' });
  },

  // Handle received ICE candidate
  handleCandidate: async (candidate) => {
    const pc = get().peerConnection;
    if (!pc || !candidate) return;

    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  },

  // End the call
  endCall: () => {
    const { peerConnection, localStream } = get();
    
    if (peerConnection) {
      peerConnection.close();
    }
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    // Notify the other peer if call was active
    if (get().callStatus === 'in-progress' || get().callStatus === 'calling') {
      const socket = useChatStore.getState().getSocket();
      const { callData, isCaller } = get();
      
      if (callData) {
        socket.emit('webrtc-end', {
          chatId: callData.chatId,
          to: isCaller ? callData.recipientId : callData.callerId
        });
      }
    }
    
    set({ 
      localStream: null,
      remoteStream: null,
      peerConnection: null,
      callStatus: 'idle',
      callType: null,
      isCaller: false,
      callData: null
    });
  },

  // Handle call ended by remote
  handleCallEnded: () => {
    const { peerConnection, localStream } = get();
    
    if (peerConnection) {
      peerConnection.close();
    }
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    set({ 
      localStream: null,
      remoteStream: null,
      peerConnection: null,
      callStatus: 'idle',
      callType: null,
      isCaller: false,
      callData: null
    });
  }
}));

export default useWebRTCStore;