
function postit(mess) {
    console.log('postit ' + mess);
    $('<p class="LogEin">' + mess + '</p>').appendTo('#logliste');
    stockFish.postMessage(mess);     
};

function postitdebug(mess) {
    console.log('postitdebug ' + mess);
    $('<p class="LogEin">' + mess + '</p>').prependTo('#logliste');
    stockFish.postMessage(mess);     
};

function compressline(line) {

    var line0 = line.replace("info depth", "id");
    var line1 = line0.replace("seldepth", "sd");
    var line2 = line1.replace("multipv 1 ", "");
    var line3 = line2.replace("score ", "");
    var line4 = line3.replace(/nodes \d* /, '');
    var line5 = line4.replace(/nps \d* /, '');
    var line6 = line5.replace(/time \d* /, '');

    return line6;
}