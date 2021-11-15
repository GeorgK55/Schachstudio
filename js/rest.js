function testrest() {
    // Create a request variable and assign a new XMLHttpRequest object to it.
    //   //
    var request = new XMLHttpRequest()

    // Open a new connection, using the GET request on the URL endpoint
    //request.open('GET', 'https://lichess.org/api/user/Georgk', true)
    request.open('GET', 'https://lichess.org/study/KM0ArJNt.pgn', true)
    
    request.onload = function () {
        // Begin accessing JSON data here
       var data = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {
            console.log('done')
        } else {
            console.log('error')
        }
    }

    // Send request
    request.send()
}

function kapitelimport(lichesskennung) {

    var request = new XMLHttpRequest()

    // Open a new connection, using the GET request on the URL endpoint
    //request.open('GET', 'https://lichess.org/api/user/Georgk', true)
    request.open('GET', lichesskennung, true)
    
    request.onload = function () {
        // Begin accessing JSON data here
       var data = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {
            console.log('done')
        } else {
            console.log('error')
        }
    }

    // Send request. Was macht das jetzt noch???
    request.send()

}

function TheIndexExperimentFunction() {

var i = 19;

/* // Aufruf für stockfish
var stockfish = new Worker("js/stockfish.js");
stockfish = STOCKFISH();
stockfish.postMessage("uci");
stockfish.onmessage = function(event) {
  //NOTE: Web Workers wrap the response in an object.
 console.log(event.data ? event.data : event);
}; */

// Aufruf für stockfish.js
//var wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
//wasmSupported = false;
//var stockfish = new Worker(wasmSupported ? 'js/stockfish.wasm.js' : 'js/stockfish.js');
//stockfish.addEventListener('message', function (e) {
//  console.log(e.data);
//});
//stockfish.postMessage('uci');

/* // Aufruf für stockfish.wasm
Stockfish().then((sf) => {
    sf.addMessageListener((line) => {
      console.log(line);
    });

    sf.postMessage("uci");
  }); */
  
}
