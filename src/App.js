import React, { useEffect, useState } from 'react';
import { Midi } from '@tonejs/midi';
import MidiPlayer from 'midi-player-js';
import './App.css';
import DrumKit from './audio/DrumKit';
import NsaMidiMap from './audio/midiMaps/nsa';

const filenames = [
  "sounds/loops/rock/POP1.mid",
  "sounds/loops/rock/EDGE1.mid",
  "sounds/loops/rock/BEAT1R.mid",
  "sounds/loops/rock/099 Groove Jam 003 (16).mid",
  "sounds/loops/rock/086 Chorus 005 (8).mid",
  "sounds/loops/rock/076 Verse 001 Hihat (16).mid",
  "sounds/loops/rock/059 Verse 1 (16).mid",
  "sounds/loops/rock/059 Chorus 1 Bell.mid",
  "sounds/loops/rock/6ROCKBR.mid",
  "sounds/loops/rock/6ROCK.mid",
  "sounds/loops/rock/2ROCK.mid",
];

function App() {
  const [drumKit, setDrumKit] = useState(null);
  const [player, setPlayer] = useState(null);
  const [selectedFilename, setSelectedFilename] = useState(null);

  async function play(filename) {
    stop();
    const midi = await Midi.fromUrl(filename);
    const midiPlayer = new MidiPlayer.Player(function (event) {
      if (event.name === "Note on") {
        drumKit.play(event.noteNumber, event.velocity);
      } else if (event.name === "Note off") {
        drumKit.stopNote(event.noteNumber);
      } else if (!midiPlayer.isPlaying()) {
        midiPlayer.play();
      }
    });

    midiPlayer.loadArrayBuffer(midi.toArray());
    midiPlayer.play();
    setPlayer(midiPlayer);
  }

  function stop() {
    if (player && player.isPlaying()) {
      player.stop();
    }
  }


  useEffect(() => {
    async function loadDrumKit() {
      const drumKit = await DrumKit.load(NsaMidiMap);
      setDrumKit(drumKit);
    }

    loadDrumKit();
  }, []);

  function filenameClicked(filename) {
    return function () {
      if (selectedFilename === filename) {
        stop();
        setSelectedFilename(null);
      } else {
        setSelectedFilename(filename);
        play(filename);
      }
    };
  }

  return (
    <div className="App">
      {!drumKit && <div>Loading drum kit...</div>}

      {/* <button onClick={playClicked} disabled={!drumKit}>
        {(player && player.isPlaying()) ? "Stop" : "Play"}
      </button> */}

      <div className="filenameContainer">
        {filenames.map(filename => (
          <div
            key={filename}
            className={`filenameRow ${selectedFilename === filename ? 'highlighted' : ""}`}
            onClick={filenameClicked(filename)}>
            {filename}
          </div>
        ))}

      </div>


    </div>
  );
}

export default App;
