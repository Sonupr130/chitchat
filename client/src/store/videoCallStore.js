import { create } from 'zustand';

const useVideoCallStore = create((set, get) => ({
  // User data
  currentUser: null,
  targetUser: null,
  
  // Media streams
  localStream: null,
  remoteStream: null,
  
  // Call states
  isCallModalOpen: false,
  isCallInProgress: false,
  isIncomingCall: false,
  
  // Connection data
  peerConnection: null,
  
  // Set current user (the caller)
  setCurrentUser: (user) => set({ currentUser: user }),
  
  // Set target user (the person being called)
  setTargetUser: (user) => set({ targetUser: user }),
  
  // Open call modal and initialize call to specific user
  initiateCall: (targetUser) => {
    set({ 
      targetUser,
      isCallModalOpen: true,
      isCallInProgress: true,
      isIncomingCall: false 
    });
  },
  
  // Set local media stream
  setLocalStream: (stream) => set({ localStream: stream }),
  
  // Set remote media stream
  setRemoteStream: (stream) => set({ remoteStream: stream }),
  
  // Set peer connection
  setPeerConnection: (connection) => set({ peerConnection: connection }),
  
  // Handle incoming call
  handleIncomingCall: (callerUser) => set({ 
    targetUser: callerUser,
    isCallModalOpen: true,
    isIncomingCall: true 
  }),
  
  // Accept call
  acceptCall: () => set({ 
    isCallInProgress: true,
    isIncomingCall: false 
  }),
  
  // Reject call
  rejectCall: () => {
    const { localStream } = get();
    
    // Stop local media tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    set({ 
      isCallModalOpen: false,
      isCallInProgress: false,
      isIncomingCall: false,
      localStream: null,
      targetUser: null 
    });
  },
  
  // End ongoing call
  endCall: () => {
    const { localStream, peerConnection, remoteStream } = get();
    
    // Stop local media tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    // Close peer connection
    if (peerConnection) {
      peerConnection.close();
    }
    
    set({ 
      isCallModalOpen: false,
      isCallInProgress: false,
      localStream: null,
      remoteStream: null,
      peerConnection: null,
      targetUser: null 
    });
  }
}));

export default useVideoCallStore;