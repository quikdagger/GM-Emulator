import { useEffect } from 'react';

function MIDIPlayer() {
  useEffect(() => {
    const audioElement = document.getElementById('background-audio');
    audioElement.volume = 0.2;
    audioElement.play();
  }, []);

  return (
    <audio id="background-audio" loop>
      <source src={`${process.env.PUBLIC_URL}/creepy.mp3`} type="audio/mpeg" />
    </audio>
  );
}

export default MIDIPlayer;
