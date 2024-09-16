import React, { useState, useEffect, useRef } from 'react';

const Interview = (props) => {
    const { token } = props;
    const [isRecording, setIsRecording] = useState(false);
    const [audioLoaded, setAudioLoaded] = useState(false);
    
    const [isInterviewStarted, setIsInterviewStarted] = useState(false);
    const webSocket = useRef(null);
    const audioContext = useRef(new AudioContext());
    const analyser = useRef(null);
    const mediaStream = useRef(null);
    const lastSoundTime = useRef(Date.now());
    const audioRef = useRef(null); 
    const wsUrl = `${process.env.REACT_APP_WEB_SOCKET}/${token}`; 
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Initialize WebSocket
        // Request access to the microphone
        async function setupWebSocketAndMic() {
            try {
                
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                console.log('Microphone access granted');

            } catch (err) {
                console.error('Error accessing the microphone:', err);
            }
        }
        setupWebSocketAndMic();

        webSocket.current = new WebSocket(wsUrl);
        webSocket.current.onopen = () => console.log('WebSocket Connected');
       
        webSocket.current.onmessage = (event) => {
            if (typeof event.data === 'string') {
                // Handle text message
                console.log('Interview Started:', event.data);
                setMessage(event.data);
            } else {
                // Handle binary data (audio)
                console.log('Binary data received');
                const audioBlob = new Blob([event.data], { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);

                // Speaking... before playing the audio
                stopRecording();

                audioRef.current.src = audioUrl;
                
                 // Ensure the audio is loaded before playing
                 audioRef.current.onloadedmetadata = () => {
                    console.log('Audio loaded, playing...');
                    setAudioLoaded(true)
                    audioRef.current.play();
                };

                // ReListening... after the audio finishes playing
                audioRef.current.onended = () => {
                    startRecording();
                    setAudioLoaded(false)
                };
            }
        };

        webSocket.current.onclose = () => console.log('WebSocket Disconnected');

        // Clean up WebSocket connection
        return () => {
            if (webSocket.current) {
                webSocket.current.close();
            }
        };
    }, []);

    const startInterview = async () => {

            setIsInterviewStarted(true) 
            // if (webSocket.current) {
            //     webSocket.current.close();
            // }

            if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN ) {
                webSocket.current.send('next_question'); 
            } else {
                console.log('WebSocket is not open or no data to send.');
            }
       
    }
    const stopInterview = async () => {

        setIsInterviewStarted(false) 
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0;
            audioRef.current.src = "";
        }
        if (webSocket.current) {
            webSocket.current.close();
        }
   
}

    const startRecording = async () => {
        try {
            mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            analyser.current = audioContext.current.createAnalyser();
            const source = audioContext.current.createMediaStreamSource(mediaStream.current);
            source.connect(analyser.current);

            const mimeType = 'audio/webm';

             // Check if the mimeType is supported
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                console.error(`${mimeType} is not supported on this browser.`);
                return;
            }

            const recorder = new MediaRecorder(mediaStream.current, { mimeType });

        
            recorder.ondataavailable = (e) => {
                console.log(`Data size: ${e.data.size} bytes`);
                if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN && e.data.size > 0) {
                    webSocket.current.send(e.data); // Send binary data (voice message) to WebSocket
                } else {
                    console.log('WebSocket is not open or no data to send.');
                }
            };
            recorder.start(); // Get data every 5000ms (5 seconds)
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing the microphone:', error);
        }
    };

    const stopRecording = () => {
        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach(track => track.stop()); // Stop all tracks
            setIsRecording(false);
        }
    };

    return (
            <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                    {isInterviewStarted && (
                        <div className="mb-3">
                            <button 
                                className={`btn ${isRecording ? 'btn-danger' : 'btn-success'}`} 
                                onClick={isRecording ? stopRecording : startRecording}
                            >
                                {isRecording ? 'Submit answer when ready' : (audioLoaded ? 'Playing Question' : 
                                <>
                                    Preparing Next Question &nbsp;
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    
                                </>)}
                            </button>
                        </div>
                    )}
                    <div className="mb-3">
                        <button 
                            className={`btn ${isInterviewStarted ? 'btn-danger' : 'btn-success'}`}
                            onClick={isInterviewStarted ? stopInterview : startInterview} 
                            aria-label={isInterviewStarted ? 'Stop interview' : 'Start interview'}
                        >
                            {isInterviewStarted ? 'Stop Interview' : 'Start Interview'}
                        </button>
                    </div>
                    <audio ref={audioRef} controls />
                </div>
            </div>
    );
};

export default Interview;
