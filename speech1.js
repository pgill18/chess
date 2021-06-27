var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

// var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
// var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
// var grammar = `#JSGF V1.0; grammar commands; public <command> = ( hi there | whats up | how are you );`;

// var grammar = `#JSGF V1.0; grammar commands;
// public <command> = (/10/use king /10/move 1 forward)+;
// `.trim();

// var grammar = '#JSGF V1.0; grammar colors; public <color> = (use king to move forward) ;'
var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ਦੂਜਾ ਪਿਆਰਾ ਇਕ ਅੱਗੇ ਜਾਓ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = 'en-US';
// recognition.lang = 'hi-IN';
// recognition.lang = 'pa-IN';
// recognition.lang = 'pa-Guru-IN';
recognition.interimResults = false;
recognition.maxAlternatives = 10;
console.log( recognition )

var callback;

function startSpeech(language, cb) {
  callback = cb;
  recognition.lang = language;
  recognition.start();
  console.log('Ready to talk.');
}
function parseSpeech(transcript, confidence) {
  console.log('Transcript: ' + transcript);
  console.log('Confidence: ' + confidence);
  callback && callback(transcript);
}

recognition.onresult = function(event) {
  let results = Object.values(event.results[0]).map((a,i) => i+'.) Transcript: '+a.transcript+', Confidence: '+a.confidence );
  results.map(result => console.log ( result ) )
  // console.log( Object.values(event.results[0]) )
  // for(let result of event.results[0]) { console.log( result.transcript+' => '+result.confidence ) }
  // console.log(event.results[0])
  let transcript = event.results[0][0].transcript;
  let confidence = event.results[0][0].confidence;
  // console.log('Transcript: ' + transcript);
  // console.log('Confidence: ' + confidence);
  // parseSpeech(transcript, confidence)
  for(let a of Object.values(event.results[0])) {
    let retval = parseSpeech(a.transcript.toLowerCase(), a.confidence)
    if(retval) break;
  }

  if(recognition.abort) { recognition.abort(); }
  // recognition.abort();
  // recognition.stop();
  // recognition.start();
}

recognition.onend = function(event) {
    console.log(`recognition.onend() ... triggered`);
    if(recognition.abort) { recognition.abort(); }
    recognition.start();
}

recognition.onspeechend = function() {
  console.log( "Speech ended." );
  // recognition.stop();
}

recognition.onnomatch = function(event) {
  // diagnostic.textContent = "I didn't recognise that.";
  console.log( "I didn't recognise that." );
}

recognition.onerror = function(event) {
  // diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
  console.log( 'Error occurred in recognition: ' + event.error );
}

const speech = { startSpeech, parseSpeech };

export { speech }
