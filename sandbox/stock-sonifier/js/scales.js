// Snaps a raw frequency to the nearest note in a musical scale. Used by the
// sonic-candlestick instrument so price-mapped pitch reads as a toy instrument
// instead of a continuous siren.
(function () {
  const SCALES = {
    majorPentatonic: [0, 2, 4, 7, 9],
    minorPentatonic: [0, 3, 5, 7, 10],
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
  };

  function freqToMidi(freq) {
    return 69 + 12 * Math.log2(freq / 440);
  }

  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // rootPc: pitch class of the scale root (9 = A), matching the 110-880Hz (A2-A5)
  // range used elsewhere so the scale lines up with that mapping.
  function quantize(freq, scaleName = 'majorPentatonic', rootPc = 9) {
    const scale = SCALES[scaleName] || SCALES.majorPentatonic;
    const midi = freqToMidi(freq);
    const centerMidi = Math.round(midi);
    let best = centerMidi;
    let bestDist = Infinity;
    for (let m = centerMidi - 12; m <= centerMidi + 12; m++) {
      const pc = (((m - rootPc) % 12) + 12) % 12;
      if (scale.includes(pc)) {
        const d = Math.abs(m - midi);
        if (d < bestDist) {
          bestDist = d;
          best = m;
        }
      }
    }
    return midiToFreq(best);
  }

  window.MusicalScales = { quantize, SCALES };
})();
