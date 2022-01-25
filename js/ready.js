$(document).ready(function(){
	
	(function () {
		var zähler = 0;
		document.getElementById("btn_Trainer")
				.addEventListener("click", function() {
				   zähler++;
				   alert("Das war Klick Nr. " + zähler);
				});
	}());

	//$('.developerfeatures').addClass('vanishMe');

	GlobalActionContext = AC_CHALLENGE_Varianten;
	//GlobalActionContext = AC_CHALLENGE_RATING;
	//GlobalActionContext = AC_CHALLENGE_PLAY
	GlobalActionStep  	= ""; 

	GlobalThemaId 		= ALLEAUFGABENANZEIGEN; 
	GlobalAufgabeId 	= 0;

	GlobalEnginelogActive = false;

	$( "[id^='s_']" ).hide();
	$('#s_Willkommen').show(); //  s_lichess

	getThemes();
	getChallenges(GlobalThemaId);

	$( "button" ).button();

	$('#usedcommands').click(function() {
		$('#Kommandostart').val($( "select option:selected" )[0].value + ' ');		
	});

});


// Test aus Mediaevent.com
const delay = seconds => {
	return new Promise (
		resolve => setTimeout (resolve, seconds * 1000)
	)
};

const countToFive = async () => {
	console.log ("0 Sekunden");
	$('#asynccount').html("0");
	await delay (1);
	console.log ("1 Sekunde");
	$('#asynccount').html("1");
	await delay (1);
	console.log ("2 Sekunden");
	$('#asynccount').html("2");
	await delay (1);
	console.log ("3 Sekunden");
	$('#asynccount').html("3");
}

function countdouble() {

	for (var i = 0; i <= 10; i++) {
		countToFive();
	}
	console.log('a');
	console.log('b');
	console.log('c');
	console.log('d');
}

function ZeigeTouchDaten() { 
	console.dir(touchstart);
	console.table(touchstart);
	console.log(JSON.stringify(touchstart));

	TouchdatenArray = [];
	$.each(touchstart, function(k, v) {
		console.log(v);
		TouchdatenArray.push( {
			id: 		v.target.id,
			clientX:	v.clientX.toFixed(2),
			clientY:	v.clientY.toFixed(2),
			pageX:		v.pageX.toFixed(2),
			pageY:		v.pageY.toFixed(2),
			screenX:	v.screenX.toFixed(2),
			screenY:	v.screenY.toFixed(2),
			radiusX:	v.radiusX.toFixed(2),
			radiusY:	v.radiusY.toFixed(2),
		});
	});
	console.table(TouchdatenArray);
	console.log('xxxxxxxxxxxxx');
}

