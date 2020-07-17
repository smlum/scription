General:
- Update documentation
    - Upload instructions, save options, exports

Known issues with workarounds:
- Export text removes paragraphs - for now use copy and paste
- Large audio files cause text-audio sync issues - recommended to compress large audio files (constant bit rate, 8kbps, 8k sample rate). E.g. use Audacity for single files or ffmpeg for multiple: 
`find ./ -name “*.mp3” -exec ffmpeg -i "{}" -codec:a libmp3lame -b:a 8k -ac 1 -ar 8000 '$(basename {} min)’.mp3 \;`

Bugs:
- Live demo loads transcript over autosaved one
- Speakers get messed up on long audio
- Play button disappears on local deployment
- Annotations popup gets stuck when using ‘remove’
- Only some elements in annotation panel are saved

Priority features:
- Optimise for deployment on local server
- Autosave indicator
- Compatability with anything other than two speakers (untested)

Partially implemented:
- Compatibility with Mozilla DeepSpeech

- User sets confidence level

Long-term features:
- Call transcription APIs within app
- Google, MS, IBM compatibility (look up data standards)
- Audio processing within app (ffmpeg?)

Really long term features:
- Train a custom DeepSpeech model with user corrections
- Natural language understanding
