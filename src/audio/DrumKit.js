import Tone from 'tone';

class DrumKit {
  constructor(buffers) {
    this.buffers = buffers;
    this.activeSources = new Set();
  }


  play(note, velocity) {
    if (!this.buffers.has(note)) {
      console.warn('no buffers for note. make sure to add it to the midi map', note);
      return;
    }

    const buffer = this.buffers.get(note);
    const source = new Tone.BufferSource({ buffer });
    source.note = note;
    source.toMaster();
    source.onended = () => {
      this.activeSources.delete(source);
    };
    source.start(undefined, undefined, undefined, velocity / 128);
  }

  stopNote(note) {
    for (const source of this.activeSources) {
      if (source.note === note) {
        source.stop();
      }
    }
  }


  stop() {
    for (const source in this.activeSources) {
      source.stop();
    }
    this.activeSources.clear();
  }


  static load(midiMap) {
    return new Promise((resolve) => {
      const buffers = new Tone.Buffers(midiMap, () => {
        resolve(new DrumKit(buffers));
      })
    });
  }
}


export default DrumKit;