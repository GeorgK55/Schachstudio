<?php

	// Ist auch in .htaccess enthalten. Fehlt es hier, kommt der Fehler mit sharedArrayBuffer
	// Noch prüfen, ob es in der .htaccess weggelassen werden kann.
	header("Cross-Origin-Opener-Policy: same-origin");
	header("Cross-Origin-Embedder-Policy: require-corp");

?>
<!DOCTYPE html>
<html lang="de">
<head>

	<meta charset="utf-8">
	<meta name="description"	content="Schach Aufgabenanalyse mit Varianten">
	<meta name="keywords"			content="Schach, Jugend, Verein, Training, Tönning, Nordfriesland, Stellungen, Variantenanalyse">
	<meta name="viewport"			content="width=device-width, initial-scale=1.0">
	<meta name="author" 			content="Georg Klepp">

	<title>Georgs Variantenstudio</title>

	<link rel="stylesheet"	href="css/jquery-ui.css">
	<link rel="stylesheet"	href="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/themes/default/style.min.css">
	<link rel="stylesheet"	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

	<script src="js/jquery-3.5.1.js"></script>
	<script src="js/jquery-ui.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/jstree.min.js"></script>

	<link rel="stylesheet" type="text/css" href="css/training.css">
	<link rel="stylesheet" type="text/css" href="css/trainingmedia.css">
	<link rel="stylesheet" type="text/css" href="css/schachbrett.css">

	<script src="js/ready.js"></script>
	<script src="js/const.js"></script>
	<script src="js/benutzertexte.js"></script>
	<script src="js/willkommentiptexte.js"></script>
	<script src="js/definitionen.js"></script>
	<script src="js/common.js"></script>
	<script src="js/apputils.js"></script>
	<script src="js/chessutils.js"></script>
	<script src="js/developerutils.js"></script>
	<script src="js/showsections.js"></script>
	<script src="js/importdata.js"></script>
	<script src="js/notation.js"></script>
	<script src="js/svg.js"></script>
	<script src="js/varianten_events.js"></script>
	<script src="js/getdata.js"></script>
	<script src="js/putdata.js"></script>
	<script src="js/varianten.js"></script>
	<script src="js/varianten_aufgabe.js"></script>
	<script src="js/varianten_spieler.js"></script>
	<script src="js/stockfish.js"></script>
	<script src="js/xbtooltip.js"></script>
	<script src="js/stockfish_common.js"></script>
	<script src="js/stockfish_georg.js"></script>
	<script src="js/lichess.js"></script>
	<script src="js/accounts.js"></script>

	<link rel="apple-touch-icon" 			sizes="57x57" 	href="favicons/apple-icon-57x57.png">
	<link rel="apple-touch-icon" 			sizes="60x60" 	href="favicons/apple-icon-60x60.png">
	<link rel="apple-touch-icon" 			sizes="72x72"		href="favicons/apple-icon-72x72.png">
	<link rel="apple-touch-icon" 			sizes="76x76" 	href="favicons/apple-icon-76x76.png">
	<link rel="apple-touch-icon" 			sizes="114x114" href="favicons/apple-icon-114x114.png">
	<link rel="apple-touch-icon" 			sizes="120x120" href="favicons/apple-icon-120x120.png">
	<link rel="apple-touch-icon" 			sizes="144x144" href="favicons/apple-icon-144x144.png">
	<link rel="apple-touch-icon" 			sizes="152x152" href="favicons/apple-icon-152x152.png">
	<link rel="apple-touch-icon" 			sizes="180x180" href="favicons/apple-icon-180x180.png">
	<link rel="icon" type="image/png" sizes="192x192"	href="favicons/android-icon-192x192.png">
	<link rel="icon" type="image/png" sizes="32x32" 	href="favicons/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="96x96" 	href="favicons/favicon-96x96.png">
	<link rel="icon" type="image/png" sizes="16x16" 	href="favicons/favicon-16x16.png">

</head>
<body>
	<div id="seite" class="gc-seite">
		<div class="VeryImportantText importantbackgroundcolor">
			Georgs Variantenstudio
		</div>
		<div id="sx_mitte" class="gc-mitte">
			<section id="sx_themensection" class="gc-mitte_themen">
				<section id="s1_themenstarter" class="gc-themenstarter">
					<header class="ImportantCenterText importantbackgroundcolor">Themenauswahl</header>
					<div class="Startertext">
						Stellungen oder Aufgaben können nach vorhandenen oder auch nach eigenen Kriterien (ein taktisches Thema, ein Trainingsabend, ...) organisiert werden.
					</div>
				</section>
				<section id="s2_themenanzeige" class="gc-themenanzeige">
					<header class="ImportantCenterText importantbackgroundcolor">Themenauswahl</header>
					<div id="themenliste" class="gc-themenliste">
						<div id="themenlistetree"></div>
						<div class="trainerfeatures hideMe">
							<div id="themenlistebuttons">
								<button id="btn-themaneu"				type="button" onclick="NeuesThema()"		class="uebungenbutton"></button>
								<br>
								<button id="btn-themaentfernen" type="button" onclick="EntferneThema()"	class="uebungenbutton"></button>
							</div>
						</div>
						<div class="developerfeatures hideMe">
							<button	type="button" onclick="showEnginedialog()"	class="uebungenbutton">Enginedialog</button>
							<button type="button" onclick="Aufgabenstatistik()"	class="uebungenbutton">Aufgaben aus allen Dateien</button>
						</div>
					</div>
				</section>
			</section>
			<section id="sx_situationensection" class="gc-mitte_situationen">
				<section id="s1_situationenstarter" class="gc-situationenstarter">
					<header id="h_situationenstarter" class="ImportantCenterText importantbackgroundcolor">Stellungen dazu</header>
					<div class="Startertext">
						Eine alphabetische Liste aller oder der zu einem Thema gehörenden Aufgaben, sowie die Auswahl,
						wie eine Aufgabe gelöst werden soll (mit oder ohne Hilfe, mit Variantensuche, ...)
					</div>
				</section>
				<section id="s2_situationenanzeige" class="gc-situationenanzeige">
					<header id="h_situationenanzeige" class="ImportantCenterText importantbackgroundcolor">Stellungen dazu</header>
					<div id="loesungauswahl">
						<fieldset>
							<legend id="legend-stellung"></legend>
							<input type="radio" id="r-stellungohne"	name="Spielinteraktion"	value="StellungOhne" onchange="manageSpielinteraktionSelection();">	<label id="l_StellungOhne" for="r-stellungohne"></label><br>
							<input type="radio" id="r-stellungmit"	name="Spielinteraktion"	value="StellungMit" onchange="manageSpielinteraktionSelection();">		<label id="l_StellungMit" for="r-stellungmit"></label><br>
						</fieldset>
						<fieldset>
							<legend id="legend-aufgabe"></legend>
							<input type="radio" id="r-aufgabeohne"	name="Spielinteraktion"	value="AufgabeOhne" 				onchange="manageSpielinteraktionSelection();">	<label id="l-aufgabeohne" for="r-aufgabeohne"></label><br>
							<input type="radio" id="r-aufgabemit"		name="Spielinteraktion"	value="AufgabeMit" checked 	onchange="manageSpielinteraktionSelection();">	<label id="l-aufgabemit" for="r-aufgabemit"></label><br>
						</fieldset>
					</div>
					<div>
						<div id="aufgabendetails" class="gc-aufgabendetails">
							<div id="aufgabenliste">
								<ul id="ul_aufgabenliste" class="scrollme"></ul>
							</div>
							<div id="aufgabenselektion">
								<div id="zeigeauswahl">
									<input type="radio" id="r-zeigealle" 			name="AufgabenFilterAlle"	value="Selektion" checked>													<label for="r-zeigealle">Alle Aufgaben anzeigen</label><br>
									<input type="radio" id="r-zeigeaufgaben"	name="AufgabenFilterAlle"	value="Alle">																				<label for="r-zeigeaufgaben">Aufgaben nur zur Themenauswahl anzeigen</label>
								</div>
							</div>
							<!-- <div id="filterauswahl">
									<input type="radio" id="r-zeigefilter"		name="AufgabenFilterAlle"	value="Filter"  class="entwicklerfeatures">	<label for="r-zeigefilter">Geplant: Aufgaben nur zum Filter anzeigen</label>
								<button id="btn-aufgabefilter" type="button" onclick="Aufgabeauswahl()" disabled>Aufgabenfilter</button>
							</div> -->
							<div id="aufgabelistebuttons">
								<button id="btn-kapitelliste"	type="button" onclick="KapitelAnzeigen()"				class="uebungenbutton"></button>
							</div>
							<div class="trainerfeatures hideMe">
								<button id="btn-import"						type="button" onclick="showImport()"			class="uebungenbutton"></button>
								<button id="btn-verbindeaufgabe"	type="button" onclick="VerbindeAufgabe()"	class="uebungenbutton"></button>
								<button id="btn-trenneaufgabe" 		type="button" onclick="TrenneAufgabe()"		class="uebungenbutton"></button>
								<button id="btn-entferneaufgabe" 	type="button" onclick="EntferneAufgabe()"	class="uebungenbutton"></button>
							</div>
						</div>
						<div id="kapiteldetails" class="gc-kapiteldetails hideMe">
							<div id="kapitelliste">
							<ul id="ul_kapitelliste" class="scrollme"></ul>
							</div>
							<div id="kapitellistebuttons">
								<button id="btn-aufgabenliste"	type="button" onclick="AufgabenAnzeigen()"	class="uebungenbutton"></button>
							</div>
						</div>
					</div>
				</section>
			</section>
			<section id="sx_aktionensection" class="gc-mitte_aktionen">
				<section id="s_willkommen" class="gc-willkommen">
					<header class="ImportantCenterText importantbackgroundcolor">Willkommen</header>
					<div id="welcome" class="gc-usertypes">
						<div class="usertypearea gc-interesse">
							<div class="padmeleft2vw interessetext"></div>
							<a class="video_interessetext1 inactiveanchor" target="_blank" href="https://youtu.be/I6xg-D_4blM"><img src="grafiken/youtube_icon_65487.png" alt="" class="youtubelink"></a>
						</div>
						<div class="usertypearea gc-spieler">
							<div class="spielertext leftmepad5vh"></div>
							<a class="video_spielertext1 inactiveanchor" target="_blank" href="https://youtu.be/sMGFUEhRQM8">Erklärungen<img src="grafiken/youtube_icon_65487.png" alt="" class="youtubelink"></a>
							<a class="video_spielertext2 inactiveanchor" target="_blank" href="https://youtu.be/7UtvrRqZ9nI">Musterlösungen<img src="grafiken/youtube_icon_65487.png" alt="" class="youtubelink"></a>
							<a class="video_spielertext3 inactiveanchor" target="_blank" href="https://youtu.be/7UtvrRqZ9nI">Vergleich mit lichess.org<img src="grafiken/youtube_icon_65487.png" alt="" class="youtubelink"></a>
							<button class="spielerweiter uebungenbutton" id="btn-spieler" type="button" onclick="showSpielerinfo()"></button>
						</div>
						<div class="usertypearea gc-trainer">
							<div class="leftmepad5vh trainertext"></div>
							<a class="video_trainertext1 inactiveanchor" target="_blank" href="https://youtu.be/3LIYBxYjlpk">Aufgaben importieren <img src="grafiken/youtube_icon_65487.png" alt="" class="youtubelink"></a>
							<a class="video_trainertext2 inactiveanchor" target="_blank" href="https://youtu.be/7UtvrRqZ9nI">Themen und Aufgaben verwalten<img src="grafiken/youtube_icon_65487.png" alt="" class="youtubelink"></a>
							<button class="trainerweiter uebungenbutton" id="btn-trainer" type="button" onclick="showTrainerinfo()"></button>
						</div>
						<div class="usertypearea gc-entwickler">
							<div class="leftmepad5vh entwicklertext"></div>
							<a class="inactiveanchor" target="_blank" href="https://youtu.be/sOCT6bayKUg">Programmierung<img src="grafiken/youtube_icon_65487.png" alt="" class="youtubelink"></a>
							<button class="entwicklerweiter uebungenbutton" id="btn-entwickler" type="button" onclick="showEntwicklerinfo()"></button>
						</div>
						<div class="usertypearea gc-willkommentip">
							<img src="grafiken/idee.png" class="willkommentipicon" alt="">
							<div class="willkommentiptitel"></div>
							<div class="willkommentiptext"></div>
						</div>
					</div>
				</section>
				<section id="s_import" class="gc-import">
					<header id="h_import" class="ImportantCenterText importantbackgroundcolor">Aufgaben importieren</header>
					<div id="importarea" class="gc-importarea">
						<div id="importselectarea" class="importselectarea">
							<div id="importselectbuttons">
								<button type="button" onclick="DatenBereitstellen_Datei()"						class="uebungenbutton">Aus Datei (*.pgn)<br>übernehmen</button>
								<button type="button" onclick="DatenBereitstellen_Lichess('import')"	class="uebungenbutton">Direkt aus lichess<br>übernehmen</button>
							</div>
							<div id="importselectfilename"></div>
						</div>
						<ul id="ul_importaufgaben" class="ul_importaufgaben"></ul>
						<fieldset id="f_importaufgabedaten" class="f_importaufgabedaten">
							<legend>Die gewählte Aufgabe</legend>
							<ul id="ul_importaufgabedetails">
								<li><label for="kurztextimport">Kurztext</label>					<input type="text" 	name="Kurztext"					id = "kurztextimport">									</li>
								<li><label for="langtextimport">Langtext</label>					<input type="text" 	name="Langtext"					id = "langtextimport">									</li>
								<li><label for="datumimport">Datum</label>								<input type="text" 	name="Datum"						id = "datumimport"						disabled>	</li>
								<li><label for="quelleimport">Quelle</label>							<input type="text" 	name="Quelle"						id = "quelleimport"						disabled>	</li>
								<li><label for="youtubeimportname">Youtubename</label>		<input type="text" 	name="youtubename"			id = "youtubeimportname">								</li>
								<li><label for="youtubeimportlink">Youtubelink</label>		<input type="text" 	name="youtubelink"			id = "youtubeimportlink">								</li>
								<li><label for="pgnannotatortextimport">Annotator</label>	<input type="text" 	name="pgnannotatortext"	id = "pgnannotatortextimport"	disabled>	</li>
								<li><label for="weissnameimport">Weiß</label>							<input type="text" 	name="WeissName"				id = "weissnameimport">									</li>
								<li><label for="schwarznameimport">Schwarz</label>				<input type="text" 	name="SchwarzName"			id = "schwarznameimport">								</li>
								<!-- <li><label for="quelledetailimport">Importdetails</label>	<input type="text"	name="Quelledetail"		id = "quelledetailimport">	</li> -->
								<li><label for="amzugimport">Am Zug</label>								<input type="text"	name="amzug"						id = "amzugimport"						disabled>	</li>
								<li><label for="fenimport">FEN</label>										<input type="text"	name="fenimport"				id = "fenimport"							disabled>	</li>
								<li><label for="scopeimport">Scope</label>								<input type="text" 	name="Scope"						id = "scopeimport">											</li>
								<li><label for="skillimport">Skill</label>								<input type="text"	name="skillimport"			id = "skillimport">											</li>
							</ul>
						</fieldset>
						<div id="importaufgabePGN" class="gc-importaufgabepgn">
							<label id="importaufgabelabel" for="importaufgabetext">Text der Aufgabe</label>
							<textarea id="importaufgabetext"></textarea>
						</div>
						<div id="importchessboard" class="cb_import">
						</div>
						<div id="importTreeNotationWrapperId" class="importtreenotationwrapper">
						</div>
						<div id="importactionbuttons" class="importactionbuttons">
							<button type="button" onclick="ZuegePruefen('Notationvisible')"			class="uebungenbutton">Züge prüfen</button>
							<button type="button" onclick="AufgabeSpeichern()"	class="uebungenbutton">Aufgabe speichern</button>
						</div>
					</div>
				</section>
				<section id="s_kapitel" class="gc-kapitel">
					<header id="h_kapitel" class="ImportantCenterText importantbackgroundcolor">Kapitel spielen</header>
					<div id="kapitelarea" class="gc-kapitelarea">
						<img src="grafiken/lichesslogo.png" alt="" class="dialogfigur lichesslogo">
						<div class="dialogtext lichessuserarea">
							<label for="lichessuser">Bitte die Benutzerkennung eintragen</label>
							<input type="text" name="lichessuser" id = "lichessuser">
						</div>
						<button type="button" onclick="studieauswahl('kapitel')"						class="uebungenbutton studienbutton">Studien anzeigen</button>
						<div id='studienanzeige' class="studienanzeigeliste">
							<ul id='studienliste' class='scrollme hideMe'></ul>
						</div>
					</div>
				</section>
				<section id="s_spielen" class="gc-spielen">
					<header id="h_spielen" class="ImportantCenterText importantbackgroundcolor">Aufgabe spielen</header>
					<fieldset id="f_spielenaufgabedetails">
						<legend>Details der Aufgabe</legend>
						<ul>
						<li><label for="kurztextspiel">Aufgabe oder Kapitel</label>	<input type="text"	name="Kurztext"	id = "kurztextspiel"	disabled>	</li>
						<li><label for="langtextspiel">Datei oder Studie</label>		<input type="text"	name="Langtext"	id = "langtextspiel"	disabled>	</li>	
						<!-- <li><label for="youtubespiel">Youtubevideo</label>			<input type="text"	name="youtube"	id = "youtubespiel"		disabled>	</li>	 -->
						<li><label for="youtubespielancorid">Youtubevideo</label>			<a id="youtubespielanchorid" target="_blank"></a>	</li>	
						<!-- <li><label for="quellespiel">Quelle</label>			<input type="text" name="Quelle"		id = "quellespiel"		disabled>	</li> -->
						<!-- <li><label for="quelledetailspiel">Quelledetail</label>	<input type="text"	name="Quelledetail"	id = "quelledetailspiel"	disabled>	</li>	-->
						<!-- <li><label for="scopespiel">Scope</label>								<input type="text"	name="Scope"				id = "scopespiel"					disabled>	</li> -->
						<!-- <li><label for="amzugspiel">Am Zug</label>								<input type="text"	name="AmZug"				id = "amzugspiel"					disabled>	</li> -->
						<!-- <li><label for="skillspiel">Skill</label>								<input type="text"	name="skillspiel" 	id = "skillspiel"					disabled>	</li> -->
						<!-- <li><label for="fenspiel">FEN</label>										<input type="text"	name="fenspiel"			id = "fenspiel"						disabled>	</li> -->
						<!-- <li><label for="pgntextspiel">PGN:</label>								<textarea						name="PGNText"			id = "pgntextspiel"				disabled>	</textarea>	</li> -->
						</ul>
					</fieldset>
					<div id="challengeboardandnotation" class="gc-challengeboardandnotation">
						<div id="movenotes" class="gc-movenotes">
							<div id="movenotestext" class="centertext"></div>
							<!-- <div id="movenotesmarkerid" class="movenotesmarker" onclick="handleVarianteClick()"></div>
							<div id="movenotesrejectid" class="movenotesmarker"></div>
							<div id="movenotesresolveid" class="movenotesmarker"></div> -->
							<div id="movenotesresultmarkerid" class="movenotesresultmarker"></div>
						</div>
						<div id="challengechessboard" class="cb_challenge svgboard">
						</div> 
						<div id="challengechesstips" class="gc-challengechesstips">
							<div id="challengezugmarkerid" class="challengezugmarker"></div>
							<div id="aidicon"></div>
							<div id="aidtext"></div>
						</div>
						<div id="challengenotationwrapper" class="challengenotationwrapper"> <!-- id ist Anker für Dialoge -->
							<div id="challengenotation"></div>
						</div>
						<div id="challengetips" class="challengetips"></div>
						<div id="challengenavigation" class='challengenavigation'>
							<!-- <p>&#9664; &nbsp; &#9654; sollen noch kommen</p> -->
							<!-- <label for="mausersatz">mausersatz (debugger erkennt die Maus nicht):</label><input type="text" id = "mausersatz">
							<button onclick="startMouseUp()">Mouse up starten</button> -->
						</div>
						<div class="trainerfeatures hideMe pgn">
							<!-- <label for="pgntextspiel">PGN:</label> -->
							<textarea name="PGNText" id = "pgntextspiel" rows="5" disabled> </textarea>
						</div>
					</div>
				</section>
				<section id="s_enginedialog" class="gc-enginedialog">
					<header class="ImportantCenterText importantbackgroundcolor">Enginedialog</header>
					<div id="enginekommandos" class="gc-enginekommandos">
						<div id="konfigurationdialoglog" class="LogKonfig">
							<fieldset id="debugLogKonfiguration">
								<legend>Protokollierung</legend>
								<input type="checkbox" id="cb_Enginelogdebug" name="Enginelog" value="Enginelog_on" onclick="toggleEnginelog('cb_Enginelogdebug');">
								<label for="cb_Enginelogdebug">Enginekommunikation</label><br>
								<input type="checkbox" id="cb_EngineEindebug" name="EngineEin" value="EngineEin" checked class="shift1vw" onclick="toggleEnginelogEin();">
								<label for="cb_EngineEindebug">zur Engine</label><br>
								<input type="checkbox" id="cb_EngineAusdebug" name="EngineAus" value="EngineAus" checked class="shift1vw" onclick="toggleEnginelogAus();">
								<label for="cb_EngineAusdebug">von der Engine</label>
							</fieldset>
						</div>
						<div id="usedcommands">
							<select name="frequentlyused"  size="10">
								<option value="ucinewgame">ucinewgame</option>
								<option value="isready">isready</option>
								<option value="eval">evaluation</option>
								<option value="setoption name">setoption name</option>
								<option value="go depth">go depth</option>
								<option value="position fen">position fen</option>
								<option value="go depth 8">go depth 4</option>
								<option value="go depth 8 searchmoves">go depth 4 searchmoves</option>
								<option value="setoption name clear hash">setoption name clear hash</option>
								<!-- <option value="setoption name Debug Log File value p:/schach/programmierung/datum.log">setoption name Debug Log File</option> -->
							</select>
							<label>Oft gebraucht</label>
						</div>
						<div>
							<label for="kommandostart" style="float: left;">Nächstes</label>
							<input type="text" id = "kommandostart">
							<button type="button" onclick="KommandoAbschicken()">Ab damit</button>
						</div>
						<div>
							<label for="regexstart" style="float: left;">Regex</label>
							<input type="text" id = "regexstart">
							<button type="button" onclick="RegexAbschicken()">Ab damit Regex</button>
						</div>
					</div>
				</section>
				<section id="s_spielerinfo" class="gc-spielerinfo">
					<header class="ImportantCenterText importantbackgroundcolor">Hinweise für Spieler</header>
					<div id="spielerinfo_div" class="gc-rolleninfo"></div>
				</section>
				<section id="s_trainerinfo" class="gc-trainerinfo">
					<header class="ImportantCenterText importantbackgroundcolor">Hinweise für Trainer</header>
					<div id="trainerinfo_div" class="gc-rolleninfo"></div>
				</section>
				<section id="s_entwicklerinfo" class="gc-entwicklerinfo">
					<header class="ImportantCenterText importantbackgroundcolor">Hinweise für Entwickler</header>
					<div id="entwicklerinfo_div" class="gc-rolleninfo"></div>
				</section>
			</section>
		</div>
		<div class="importantbackgroundcolor gc-baseline">
			<span id="visitorcounterspan"></span>
			<button id="btn-messageshistory"	type="button" onclick="showMessageHistory()"	>Nachrichtenhistorie</button>
			<span id="messageline"><span id="messagetext"></span></span>
			<span>&copy; Georg Klepp 2022</span>
		</div>
		<div class="hiddendialog">
			<div id="nodetext"></div>
			<div id="tooltips"></div>
			<div id="triggertag"></div> <!-- Um die Nachrichten an die Engine auszulösen -->
		</div>
		<article id="modalefenster" class="hiddendialog">
			<div id=fileimport></div>
			<div id="dialog_neuesthema"				class="hiddendialog gc-neuesthema">
				<img src="grafiken/whitequeen.png" alt="" class="dialogfigur">
				<div class="dialogtext">
					<span class="dialogvariable" id="neuesthemaparent"></span>
					ergänzen mit
					<input type="text" class="dialoginput" name="themaname" id = "themaname">
				</div>
			</div>
			<div id="dialog_themaentfernen" 	class="hiddendialog gc-themaentfernen">
				<img src="grafiken/whitequeen.png" alt="" class="dialogfigur">
				<div class="dialogtext">
					<span class="dialogvariable" id="themanodename"></span>
					<span>wirklich entfernen?</span>
				</div>
			</div>
			<div id="dialog-aufgabeverbinden"	class="hiddendialog gc-AufgabeVerbinden">
				<img src="grafiken/whitequeen.png" alt="" class="dialogfigur">
				<div class="dialogtext">
					<span class="dialogvariable" id="verbindeaufgabe"></span>
					<br>und<br>
					<span class="dialogvariable" id="verbindethema"></span>
					<br>werden kombiniert<br>
				</div>
			</div>
			<div id="dialog-aufgabetrennen" 	class="hiddendialog gc-AufgabeTrennen">
				<img src="grafiken/whitequeen.png" alt="" class="dialogfigur">
				<div class="dialogtext">
					<span class="dialogvariable" id="trenneaufgabe"></span>
					<br>und<br>
					<span class="dialogvariable" id="trennethema"></span>
					<br>werden getrennt<br>
				</div>
			</div>
			<div id="dialog-aufgabeentfernen"	class="hiddendialog gc-AufgabeEntfernen">
				<img src="grafiken/whitequeen.png" alt="" class="dialogfigur">
				<div class="dialogtext">
					<span class="dialogvariable" id="aufgabenodename"></span>
					wirklich entfernen?
				</div>
			</div>
			<div id="dialog-zugdifferenz" 		class="hiddendialog gc-Zugdifferenz">
				<p>Es gibt einen stärkeren Zug als <span id="ratingspielerzug"></span></p>
				<p id="zugalternative"><span id="zugvorschlag"></span>&nbsp;<span id="zugbewertung"></span></p>
			</div>
			<div id="dialog-bessererzug" 		class="hiddendialog gc-BessererZug">
				<p>Entweder gibt es gibt einen stärkeren Zug als <span id="variantenspielerzug"></span> oder der Zug ist nicht erlaubt</p>
				<p id="enginezugalternative"><span id="variantenzugvorschlag"></span></p>
			</div>
			<div id="dialog-challengevariantestart" 	class="hiddendialog gc-ChallengeVarianteStart">
				<img src="grafiken/VarianteStartAufgabe.png" alt="" class="dialogfigur ">
				<div class="dialogtext">
					<div id="startaufgabehauptzugid"></div>
					<div id="startaufgabevariantezugid"></div>
				</div>
			</div>
			<div id="dialog-challengevariantewechsel"	class="hiddendialog gc-ChallengeVarianteWechsel">
				<img src="grafiken/VarianteWechselAufgabe.png"	alt="" class="dialogfigur">
				<span class="dialogtext" id="challengevariantewechseltext"></span>
			</div>
			<div id="dialog-challengehauptzug" 				class="hiddendialog gc-ChallengeHauptzug">
				<img src="grafiken/VarianteWechselAufgabe.png"	alt="" class="dialogfigur">
				<span class="dialogtext">Alle Varianten abgewählt. Weiter mit dem Hauptzug</span>
			</div>
			<div id="dialog-challengevarianteende" 		class="hiddendialog gc-ChallengeVarianteEnde">
				<img src="grafiken/VarianteEndeAufgabe.png" 		alt="" class="dialogfigur">
				<span class="dialogtext" id="challengevarianteendetext"></span>
			</div>
			<div id="dialog-playervariantestart" 			class="hiddendialog gc-PlayerVarianteStart">
				<img src="grafiken/VarianteStartSpieler.png" 		alt="" class="dialogfigur">
				<span class="dialogtext" id="playervariantestarttext"></span>
			</div>
			<div id="dialog-playervariantewechsel" 		class="hiddendialog gc-PlayerVarianteWechsel">
				<img src="grafiken/VarianteWechselAufgabe.png"	alt="" class="dialogfigur">
				<span class="dialogtext" id="playervariantestartwechsel"></span>
			</div>
			<div id="dialog-playerhauptzug" 					class="hiddendialog gc-PlayerHauptzug">
				<img src="grafiken/VarianteWechselSpieler.png"	alt="" class="dialogfigur">
				<span class="dialogtext">Alle Varianten abgewählt. Weiter mit dem Hauptzug</span>
			</div>
			<div id="dialog-playervarianteende" 			class="hiddendialog gc-PlayerVarianteEnde">
				<img src="grafiken/VarianteEndeSpieler.png" 		alt="" class="dialogfigur">
				<span class="dialogtext" id="playervarianteendetext"></span>
			</div>
			<div id="dialog-lichessuser" 						class="hiddendialog gc-LichessImport">
				<img src="grafiken/lichesslogo.png" alt="" class="dialogfigur">
				<div class="dialogtext">
					<label for="lichessdialoguser">Bitte die Benutzerkennung eintragen</label>
					<input type="text" name="lichessdialoguser" id = "lichessdialoguser">
				</div>
				<div id='dialogstudienanzeige'>
					<ul id='dialogstudienliste' class='scrollme hideMe'></ul>
				</div>
			</div>
			<div id="dialog-commonmessages"				class="hiddendialog gc-commonmessages">
				<img id="commonmessageimg" alt="" class="dialogfigur">
				<div class="dialogtext">
				<div class="dialogvariable"></div>
					<div class="dialogvariable" id="commonmessagenote"></div>
					<div class="dialogvariable" id="commonmessagetext"></div>
				</div>
			</div>
			<div id="dialog_DBErrorMessages"				class="hiddendialog gc-commonmessages">
				<img src="grafiken/fehler.png" alt="" class="dialogfigur">
				<div class="dialogtext">
					Der Auftrag konnte nicht erfolgreich durchgeführt werden:
					<span class="dialogvariable" id="dberrormessage"></span>
				</div>
			</div>
			<div id="dialog_fragefullscreen" class="hiddendialog">
				<p>
					Die Darstellung der Seite kann verbessert werden:<br>
					Vollbild und Queranzeige.
				</p>
			</div>
			<div id="dialog_promotion"	class="hiddendialog PromotionButtonList">
			</div>
			<div id="dialog-enginelog" class="hiddendialog">
				<div id="logliste"></div>
			</div>
			<div id="dialog-messagelog" class="hiddendialog">
				<div id="messageliste"></div>
			</div>
		</article>
	</div>
</body>
</html>