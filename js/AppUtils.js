
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
