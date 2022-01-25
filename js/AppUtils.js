
function ConfigureEngine(context) {

    // Grundsätzliche Initialisierung der Engine
	postit('setoption name UCI_AnalyseMode value true');
	postit('setoption name UCI_ShowWDL value true');

	// Initialisierung des Analyseverhaltens
	postit('setoption name Skill level value 20');
	postit('setoption name UCI_Elo value 1900');
	postit('setoption name Contempt value 0');
	postit('setoption name Threads value 1');
	postit('setoption name Ponder value true');
	postit('setoption name MultiPV value ' + MultiPV);
	postit('setoption name Move Overhead value 30');
	postit('setoption name Slow Mover value 80');
	//postit('setoption name UCI_Chess960 value False');
	postit('ucinewgame');
	postit('isready');
}

function showFirstAid() {

	var Hilfekandidaten = $.grep(ChallengeMoves, function(PMI, i) { 
		return PMI['PreMoveId'] == Stellungsdaten.CurMoveId;
	});

	$.each(Hilfekandidaten, function(i, HK) {
		//$('span[id$=' + HK.ZugVon + ']')[0].classList.remove("erstehilfe");
		//$('span[id$=' + HK.ZugVon + ']')[0].classList.add('erstehilfe'); // Achtung: nach span darf kein Leerzeichen kommen
		//console.log('showFirstAid');
		//$('span[id$=' + HK.ZugVon + ']').animate({opacity: 0.1}, 100, function() {console.log('XXXXX');});
		//$('span[id$=' + HK.ZugVon + ']').fadeTo( "fast", 0.2 ).fadeTo( "slow", 1.0 ).fadeTo( "fast", 0.2 ).fadeTo( "slow", 1.0 );
		$('span[id$=' + HK.ZugVon + ']').removeClass('erstehilfe');
		$('span[id$=' + HK.ZugVon + ']').width();
		$('span[id$=' + HK.ZugVon + ']').addClass('erstehilfe'); // Achtung: nach span darf kein Leerzeichen kommen

	});	
}
