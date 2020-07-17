General
- Update documentation
    - Upload instructions, save options, exports

Known issues with workarounds
- Large audio files cause text-audio sync issues - recommended to compress large audio files (constant bit rate, 8kbps, 8k sample rate). E.g. use ffmpeg: 
- Export text removes paragraphs - for now use copy and paste

find ./ -name “*.mp3” -exec ffmpeg -i "{}" -codec:a libmp3lame -b:a 8k -ac 1 -ar 8000 '$(basename {} min)’.mp3 \;

Bugs
- Live demo loads transcript twice
- Haven’t tested with anything other than two speakers
- Speakers get messed up on long audio
- Play button disappears on some local deployments
- Annotations popup gets stuck when using ‘remove’
- Only some elements in annotation panel are saved

Priority features
- Optimise for deployment on local server
- Autosave indicator

Partially implemented
- Compatibility with Mozilla DeepSpeech
- User sets confidence level

Long-term features
- Call transcription APIs within app
- Google, MS, IBM compatibility (look up data standards)
- Audio processing within app (ffmpeg?)

Really long term features
- Train DeepSpeech model with your corrections
