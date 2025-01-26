import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onError?: (error: string) => void;
  language?: string;
  continuous?: boolean;
}

export function VoiceInput({
  onTranscript,
  onError,
  language = 'fr-FR',
  continuous = true
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    let recognition: any = null;
    let animationFrame: number;

    const updateVolume = (analyser: AnalyserNode, dataArray: Uint8Array) => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setVolume(average);
      animationFrame = requestAnimationFrame(() => updateVolume(analyser, dataArray));
    };

    const startListening = async () => {
      try {
        // Configurer l'analyse audio
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        source.connect(analyser);
        
        // Démarrer l'analyse du volume
        updateVolume(analyser, dataArray);

        // Configurer la reconnaissance vocale
        recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
        recognition.continuous = continuous;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join(' ');
          onTranscript(transcript);
        };

        recognition.onerror = (event: any) => {
          onError?.(event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          if (isListening) {
            recognition.start();
          }
        };

        recognition.start();
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la reconnaissance vocale:', error);
        onError?.(error as string);
        setIsListening(false);
      }
    };

    if (isListening) {
      startListening();
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isListening, language, continuous, onTranscript, onError]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleListening}
        className={`relative p-3 rounded-full transition-colors ${
          isListening 
            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
        }`}
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        {isListening && (
          <span 
            className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-25"
            style={{ 
              transform: `scale(${1 + volume / 255})`,
              transformOrigin: 'center'
            }}
          />
        )}
      </button>
      
      {isListening && (
        <div className="flex items-center gap-2">
          <Volume2 size={16} className="text-gray-400" />
          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-100"
              style={{ width: `${(volume / 255) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}