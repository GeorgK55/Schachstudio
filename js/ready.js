$(document).ready(function(){

	GlobalActionContext = AC_CHALLENGE_RATING;
	//GlobalActionContext = AC_CHALLENGE_PLAY
	GlobalActionStep  	= ""; 

	GlobalThemaId 		= ALLEAUFGABENANZEIGEN; 
	GlobalAufgabeId 	= 0;

	GlobalEnginelogActive = false;

	$( "[id^='s_']" ).hide();
	$('#s_Willkommen').show();

	getThemes();
	$('#cb_Aufgabeauswahl').prop( "checked", true );
	getChallenges(GlobalThemaId);

	$( "button" ).button();

	$('#usedcommands').click(function() {
		$('#Kommandostart').val($( "select option:selected" )[0].value + ' ');		
	});

	//TheIndexGeorgFunction();
	//TheIndexExperimentFunction();
	//
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

