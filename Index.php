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
	<meta name="keywords"			content="Schach, JUgend, Verein, Training, Tönning, Nordfriesland, Stellungen, Variantenanalyse">
	<meta name="viewport"			content="width=device-width, initial-scale=1.0">
	<meta name="author" 			content="Georg Klepp">

	<title>Georgs Schachstudio</title>

	<link rel="stylesheet"	href="css/jquery-ui.css">
	<link rel="stylesheet"	href="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/themes/default/style.min.css">
	<link rel="stylesheet"	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

	<script src="js/jquery-3.5.1.js"></script>
	<script src="js/jquery-ui.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/jstree.min.js"></script>

	<link rel="stylesheet" type="text/css" href="css/training.css">
	<link rel="stylesheet" type="text/css" href="css/trainingmedia.css">
	<link rel="stylesheet" type="text/css" href="css/Schachbrett.css">

	<script src="js/ready.js"></script>
	<script src="js/const.js"></script>
	<script src="js/Benutzertexte.js"></script>
	<script src="js/willkommentiptexte.js"></script>
	<script src="js/Definitionen.js"></script>
	<script src="js/common.js"></script>
	<script src="js/AppUtils.js"></script>
	<script src="js/ChessUtils.js"></script>
	<script src="js/developerutils.js"></script>
	<script src="js/showSections.js"></script>
	<script src="js/importData.js"></script>
	<script src="js/Notation.js"></script>
	<script src="js/svg.js"></script>
	<script src="js/varianten_events.js"></script>
	<script src="js/getData.js"></script>
	<script src="js/putData.js"></script>
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
			Georgs Schachstudio 2023 
		</div>
		<div id="sx_mitte" class="gc-mitte">
			<section id="sx_themensection" class="gc-mitte_themen">
				<section id="s1_Themenstarter" class="gc-themenstarter">
					<header class="ImportantCenterText importantbackgroundcolor">Themenauswahl</header>
					<div class="Startertext">
						Stellungen oder Aufgaben können nach vorhandenen oder auch nach eigenen Kriterien (ein taktisches Thema, ein Trainingsabend, ...) organisiert werden.
					</div>
				</section>
				<section id="s2_Themenanzeige" class="gc-themenanzeige">
					<header class="ImportantCenterText importantbackgroundcolor">Themenauswahl</header>
					<div id="Themenliste" class="gc-themenliste">
						<div id="ThemenlisteTree"></div>
						<div class="trainerfeatures hideMe">
							<div id="ThemenlisteButtons">
								<button id="btn_ThemaNeu"				type="button" onclick="NeuesThema()"		class="uebungenbutton"></button>
								<br>
								<button id="btn_ThemaEntfernen" type="button" onclick="EntferneThema()"	class="uebungenbutton"></button>
							</div>
						</div>
						<div class="developerfeatures hideMe">
							<button	type="button" onclick="showEnginedialog()"	class="uebungenbutton">Enginedialog</button>
							<button type="button" onclick="Aufgabenstatistik()"	class="uebungenbutton">Aufgaben aus allen Dateien</button>
						</div>
					</div>
				</section>
			</section>
			<section id="sx_aufgabensection" class="gc-mitte_aufgaben">
				<section id="s1_Aufgabenstarter" class="gc-aufgabenstarter">
					<header id="h_AufgabenStarter" class="ImportantCenterText importantbackgroundcolor">Stellungen dazu</header>
					<div class="Startertext">
						Eine alphabetische Liste aller oder der zu einem Thema gehörenden Aufgaben, sowie die Auswahl,
						wie eine Aufgabe gelöst werden soll (mit oder ohne Hilfe, mit Variantensuche, ...)
					</div>
				</section>
				<section id="s2_Aufgabenanzeige" class="gc-aufgabenanzeige">
					<header id="h_AufgabenAnzeige" class="ImportantCenterText importantbackgroundcolor">Stellungen dazu</header>
					<div class="gc-aufgabendetails">
						<div id="LoesungAuswahl">
							<fieldset>
								<legend id="legend_Stellung"></legend>
								<input type="radio" id="r_StellungOhne"	name="Spielinteraktion"	value="StellungOhne" onchange="manageSpielinteraktionSelection();">	<label id="l_StellungOhne" for="r_StellungOhne"></label><br>
								<input type="radio" id="r_StellungMit"	name="Spielinteraktion"	value="StellungMit" onchange="manageSpielinteraktionSelection();">		<label id="l_StellungMit" for="r_StellungMit"></label><br>
							</fieldset>
							<fieldset>
								<legend id="legend_Aufgabe"></legend>
								<input type="radio" id="r_AufgabeOhne"	name="Spielinteraktion"	value="AufgabeOhne" 				onchange="manageSpielinteraktionSelection();">	<label id="l_AufgabeOhne" for="r_AufgabeOhne"></label><br>
								<input type="radio" id="r_AufgabeMit"		name="Spielinteraktion"	value="AufgabeMit" checked 	onchange="manageSpielinteraktionSelection();">	<label id="l_AufgabeMit" for="r_AufgabeMit"></label><br>
							</fieldset>
						</div>
						<div id="Aufgabenliste">
							<ul id="ul_Aufgabenliste" class="scrollme"></ul>
						</div>
						<div id="Kapitelliste" class="hideMe">
							<ul id="ul_Kapitelliste" class="scrollme"></ul>
						</div>
						<div id="Aufgabenselektion">
							<!-- button id="btn_Aufgabeauswahl" type="button" onclick="Aufgabeauswahl()" class="uebungenbutton">Alle Aufgaben anzeigen</><br -->
							<div id="ZeigeAuswahl">
								<input type="radio" id="r_ZeigeAlle" 			name="AufgabenFilterAlle"	value="Selektion" checked>													<label for="r_ZeigeAlle">Alle Aufgaben anzeigen</label><br>
								<input type="radio" id="r_ZeigeAufgaben"	name="AufgabenFilterAlle"	value="Alle">																				<label for="r_ZeigeAufgaben">Aufgaben nur zur Themenauswahl anzeigen</label>
							</div>
							<div id="Filterauswahl">
									<input type="radio" id="r_ZeigeFilter"		name="AufgabenFilterAlle"	value="Filter"  class="entwicklerfeatures hideMe">	<label for="r_ZeigeFilter">Geplant: Aufgaben nur zum Filter anzeigen</label>
								<button id="btn_Aufgabefilter" type="button" onclick="Aufgabeauswahl()" disabled>Aufgabenfilter</button>
							</div>
						</div>
						<div id="AufgabelisteButtons">
							<div>
							<button id="btn_lichesskapitel"	type="button" onclick="DatenBereitstellen_Lichess('kapitel')"	class="uebungenbutton"></button>
							</div>
							<div class="trainerfeatures hideMe">
								<button id="btn_Import"						type="button" onclick="showImport()"			class="uebungenbutton"></button>
								<button id="btn_VerbindeAufgabe"	type="button" onclick="VerbindeAufgabe()"	class="uebungenbutton"></button>
								<button id="btn_TrenneAufgabe" 		type="button" onclick="TrenneAufgabe()"		class="uebungenbutton"></button>
								<button id="btn_EntferneAufgabe" 	type="button" onclick="EntferneAufgabe()"	class="uebungenbutton"></button>
							</div>
						</div>
					</div>
				</section>
			</section>
			<section id="sx_aktionensection" class="gc-mitte_aktionen">
				<section id="s_willkommen" class="gc-willkommen">
					<header class="ImportantCenterText importantbackgroundcolor">Willkommen</header>
					<div id="Welcome" class="gc-usertypes">
						<div class="usertypearea gc-interesse">
							<div class="padmeleft2vw interessetext"></div>
							<a class="video_interessetext1" target="_blank" href="https://youtu.be/I6xg-D_4blM"><img src="Grafiken/Youtube_icon_66802.png" alt="" class="youtubelink"></a>
						</div>
						<div class="usertypearea gc-spieler">
							<div class="spielertext leftmepad5vh"></div>
							<a class="video_spielertext1" target="_blank" href="https://youtu.be/sMGFUEhRQM8">Erklärungen<img src="Grafiken/Youtube_icon_66802.png" alt="" class="youtubelink"></a>
							<a class="video_spielertext2 inactiveanchor" target="_blank" href="https://youtu.be/7UtvrRqZ9nI">Musterlösungen<img src="Grafiken/Youtube_icon_65487.png" alt="" class="youtubelink"></a>
							<a class="video_spielertext3 inactiveanchor" target="_blank" href="https://youtu.be/7UtvrRqZ9nI">Vergleich mit lichess.org<img src="Grafiken/Youtube_icon_65487.png" alt="" class="youtubelink"></a>
							<button class="spielerweiter uebungenbutton" id="btn_Spieler" type="button" onclick="showSpielerinfo()"></button>
						</div>
						<div class="usertypearea gc-trainer">
							<div class="leftmepad5vh trainertext"></div>
							<a class="video_trainertext1" target="_blank" href="https://youtu.be/3LIYBxYjlpk">Aufgaben importieren <img src="Grafiken/Youtube_icon_66802.png" alt="" class="youtubelink"></a>
							<a class="video_trainertext2 inactiveanchor" target="_blank" href="https://youtu.be/7UtvrRqZ9nI">Themen und Aufgaben verwalten<img src="Grafiken/Youtube_icon_65487.png" alt="" class="youtubelink"></a>
							<button class="trainerweiter uebungenbutton" id="btn_Trainer" type="button" onclick="showTrainerinfo()"></button>
						</div>
						<div class="usertypearea gc-entwickler">
							<div class="leftmepad5vh entwicklertext"></div>
							<a class="inactiveanchor" target="_blank" href="https://youtu.be/sOCT6bayKUg">Programmierung<img src="Grafiken/Youtube_icon_65487.png" alt="" class="youtubelink"></a>
							<div>
								<button class="entwicklerweiter uebungenbutton" id="btn_Entwickler" type="button" onclick="showEntwicklerinfo()"></button>
							</div>
						</div>
						<div class="usertypearea gc-Willkommentip">
							<div><img src="Grafiken/idee.png" class="Willkommentipicon" alt=""></div>
							<div>
								<div class="Willkommentiptitleclass"></div>
								<div class="Willkommentiptextclass"></div>
							</div>
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
								<li><label for="KurztextImport">Kurztext</label>					<input type="text" 	name="Kurztext"				id = "KurztextImport">							</li>
								<li><label for="LangtextImport">Langtext</label>					<input type="text" 	name="Langtext"				id = "LangtextImport">							</li>
								<li><label for="DatumImport">Datum</label>								<input type="text" 	name="Datum"					id = "DatumImport">									</li>
								<li><label for="QuelleImport">Quelle</label>							<input type="text" 	name="Quelle"					id = "QuelleImport">								</li>
								<li><label for="AnnotatortextImport">Annotator</label>		<input type="text" 	name="Annotatortext"	id = "AnnotatortextImport">					</li>
								<li><label for="WeissNameImport">Weiß</label>							<input type="text" 	name="WeissName"			id = "WeissNameImport">							</li>
								<li><label for="SchwarzNameImport">Schwarz</label>				<input type="text" 	name="SchwarzName"		id = "SchwarzNameImport">						</li>
								<li><label for="QuelledetailImport">Importdetails</label>	<input type="text"	name="Quelledetail"		id = "QuelledetailImport">					</li>
								<li><label for="ImportQuelleImport">ImportQuelle</label>	<input type="text" 	name="ImportQuelle"		id = "ImportQuelleImport"	disabled>	</li>
								<li><label for="AmZugImport">Am Zug</label>								<input type="text"	name="AmZug"					id = "AmZugImport"				disabled>	</li>
								<li><label for="FENImport">FEN</label>										<input type="text"	name="FENImport"			id = "FENImport"					disabled>	</li>
								<li><label for="ScopeImport">Scope</label>								<input type="text" 	name="Scope"					id = "ScopeImport">									</li>
								<li><label for="SkillImport">Skill</label>								<input type="text"	name="SkillImport"		id = "SkillImport">									</li>
							</ul>
						</fieldset>
						<div id="importaufgabePGN" class="gc-importaufgabepgn">
							<label id="importaufgabelabel" for="importaufgabetext">Text der Aufgabe</label>
							<textarea id="importaufgabetext"></textarea>
						</div>
						<div id="importchessboardId" class="cb_import">
						</div>
						<div id="importTreeNotationWrapperId" class="importtreenotationwrapper">
						</div>
						<div id="importactionbuttons" class="importactionbuttons">
							<button type="button" onclick="ZuegePruefen()"			class="uebungenbutton">Züge prüfen</button>
							<button type="button" onclick="AufgabeSpeichern()"	class="uebungenbutton">Aufgabe speichern</button>
						</div>
					</div>
				</section>
				<section id="s_spielen" class="gc-spielen">
					<header id="h_spielen" class="ImportantCenterText importantbackgroundcolor">Aufgabe spielen</header>
					<fieldset id="f_spielenaufgabedetails">
						<legend>Details der Aufgabe</legend>
						<ul>
						<li><label for="kurztextspiel">Kurztext</label>	<input type="text" name="Kurztext"	id = "kurztextspiel"	disabled>	</li>
						<li><label for="quellespiel">Quelle</label>			<input type="text" name="Quelle"		id = "quellespiel"		disabled>	</li>
						<!-- <li><label for="LangtextSpiel">Langtext</label>					<input type="text"	name="Langtext"			id = "LangtextSpiel"			disabled>	</li>	-->
						<!-- <li><label for="QuelledetailSpiel">Quelledetail</label>	<input type="text"	name="Quelledetail"	id = "QuelledetailSpiel"	disabled>	</li>	-->
						<!-- <li><label for="ScopeSpiel">Scope</label>								<input type="text"	name="Scope"				id = "ScopeSpiel"					disabled>	</li> -->
						<!-- <li><label for="AmZugSpiel">Am Zug</label>								<input type="text"	name="AmZug"				id = "AmZugSpiel"					disabled>	</li> -->
						<!-- <li><label for="SkillSpiel">Skill</label>								<input type="text"	name="SkillSpiel" 	id = "SkillSpiel"					disabled>	</li> -->
						<!-- <li><label for="FENSpiel">FEN</label>										<input type="text"	name="FENSpiel"			id = "FENSpiel"						disabled>	</li> -->
						<!-- <li><label for="importquellespiel">Importquelle</label>	<input type="text"	name="Importquelle" id = "importquellespiel"	disabled>	</li> -->
						<!-- <li><label for="pgntextspiel">PGN:</label>								<textarea						name="PGNText"			id = "pgntextspiel"				disabled>	</textarea>	</li> -->
						</ul>
					</fieldset>
					<div id="challengeboardandnotation" class="gc-challengeboardandnotation">
						<div id="challengevarianten" class="gc-challengevarianten">
							<div id="VariantetextId" class="centertext"></div>
							<!-- <div id="VariantemarkerId" class="variantemarker" onclick="handleVarianteClick()"></div> -->
							<div id="VariantemarkerrejectId" class="variantemarker"></div>
							<div id="VariantemarkerresolveId" class="variantemarker"></div>
							<div id="ZugergebnismarkerId" class="zugergebnismarker" onclick="handleZugergebnisClick()"></div>
							<div id="ChallengezugmarkerId" class="challengezugmarker">
							</div>
						</div>
						<div id="challengechessboard" class="cb_challenge">
						</div> 
						<div id="challengechesstips" class="gc-challengechesstips">
							<div id="aidicon"></div>
							<div id="aidtext"></div>
						</div>
						<div id="challengenotationwrapper" class="challengenotationwrapper"> <!-- id ist Anker für Dialoge -->
							<div id="challengenotation"></div>
						</div>
						<div id="challengetips" class="challengetips"></div>
						<div id="challengenavigation" class='challengenavigation'>
							<p>&#9664; &nbsp; &#9654; sollen noch kommen</p>
							<!-- <label for="Mausersatz">Mausersatz (debugger erkennt die Maus nicht):</label><input type="text" id = "Mausersatz">
							<button onclick="startMouseUp()">Mouse up starten</button> -->
						</div>
						<div class="trainerfeatures hideMe pgn">
							<!-- <label for="pgntextspiel">PGN:</label> -->
							<textarea name="PGNText" id = "pgntextspiel" rows="5" disabled> </textarea>
						</div>
					</div>
				</section>
				<section id="s_EngineDialog" class="gc-enginedialog">
					<header class="ImportantCenterText importantbackgroundcolor">Enginedialog</header>
					<div id="enginekommandos" class="gc-enginekommandos">
						<div id="LogKonfigurationDialog" class="LogKonfig">
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
							<label for="Kommandostart" style="float: left;">Nächstes</label>
							<input type="text" id = "Kommandostart">
							<button type="button" onclick="KommandoAbschicken()">Ab damit</button>
						</div>
						<div>
							<label for="Regexstart" style="float: left;">Regex</label>
							<input type="text" id = "Regexstart">
							<button type="button" onclick="RegexAbschicken()">Ab damit Regex</button>
						</div>
					</div>
				</section>
				<section id="s_Spielerinfo" class="gc-spielerinfo">
					<header class="ImportantCenterText importantbackgroundcolor">Hinweise für Spieler</header>
					<div id="Spielerinfo_div" class="gc-rolleninfo"></div>
				</section>
				<section id="s_Trainerinfo" class="gc-trainerinfo">
					<header class="ImportantCenterText importantbackgroundcolor">Hinweise für Trainer</header>
					<div id="Trainerinfo_div" class="gc-rolleninfo"></div>
				</section>
				<section id="s_Entwicklerinfo" class="gc-entwicklerinfo">
					<header class="ImportantCenterText importantbackgroundcolor">Hinweise für Entwickler</header>
					<div id="Entwicklerinfo_div" class="gc-rolleninfo"></div>
				</section>
			</section>
		</div>
		<div class="importantbackgroundcolor">
			<span id="VisitorCounterSpan"></span>
			<span class="CopyRight">&copy; Georg Klepp 2022</span>
			<div class="hiddendialog">
				<div id="Nodetext"></div>
				<div id="tooltips"></div>
				<div id="TriggerTag"></div> <!-- Um die Nachrichten an die Engine auszulösen -->
			</div>
			<article id="ModaleFenster" class="hiddendialog">
				<div id=fileimport></div>
				<div id="dialog_neuesthema"				class="hiddendialog gc-neuesthema">
					<img src="Grafiken/WhiteQueen.png" alt="" class="dialogfigur">
					<div class="dialogtext">
						<span class="dialogvariable" id="NeuesThemaParent"></span>
						ergänzen mit
						<input type="text" class="dialoginput" name="Themaname" id = "Themaname">
					</div>
				</div>
				<div id="dialog_themaentfernen" 	class="hiddendialog gc-themaentfernen">
					<img src="Grafiken/WhiteQueen.png" alt="" class="dialogfigur">
					<div class="dialogtext">
						<span class="dialogvariable" id="Themanodename"></span>
						<span>wirklich entfernen?</span>
					</div>
				</div>
				<div id="dialog_AufgabeVerbinden"	class="hiddendialog gc-AufgabeVerbinden">
					<img src="Grafiken/WhiteQueen.png" alt="" class="dialogfigur">
					<div class="dialogtext">
						<span class="dialogvariable" id="VerbindeAufgabe"></span>
						<br>und<br>
						<span class="dialogvariable" id="VerbindeThema"></span>
						<br>werden kombiniert<br>
					</div>
				</div>
				<div id="dialog_AufgabeTrennen" 	class="hiddendialog gc-AufgabeTrennen">
					<img src="Grafiken/WhiteQueen.png" alt="" class="dialogfigur">
					<div class="dialogtext">
						<span class="dialogvariable" id="TrenneAufgabe"></span>
						<br>und<br>
						<span class="dialogvariable" id="TrenneThema"></span>
						<br>werden getrennt<br>
					</div>
				</div>
				<div id="dialog_AufgabeEntfernen"	class="hiddendialog gc-AufgabeEntfernen">
					<img src="Grafiken/WhiteQueen.png" alt="" class="dialogfigur">
					<div class="dialogtext">
						<span class="dialogvariable" id="Aufgabenodename"></span>
						wirklich entfernen?
					</div>
				</div>
				<div id="dialog_StopScriptTest" 	class="hiddendialog">
				</div>
				<div id="dialog_Zugdifferenz" 		class="hiddendialog gc-Zugdifferenz">
					<p>Es gibt einen stärkeren Zug als <span id="RatingSpielerzug"></span></p>
					<p id="Zugalternative"><span id="Zugvorschlag"></span>&nbsp;<span id="Zugbewertung"></span></p>
				</div>
				<div id="dialog_BessererZug" 		class="hiddendialog gc-BessererZug">
					<p>Entweder gibt es gibt einen stärkeren Zug als <span id="VariantenSpielerzug"></span> oder der Zug ist nicht erlaubt</p>
					<p id="EngineZugalternative"><span id="VariantenZugvorschlag"></span></p>
				</div>
				<div id="dialog_ChallengeVarianteStart" 	class="hiddendialog gc-ChallengeVarianteStart">
					<img src="Grafiken/VarianteStartAufgabe.png" alt="" class="dialogfigur ">
					<div class="dialogtext">
						<div id="startaufgabehauptzugid"></div>
						<div id="startaufgabevariantezugid"></div>
					</div>
				</div>
				<div id="dialog_ChallengeVarianteWechsel"	class="hiddendialog gc-ChallengeVarianteWechsel">
					<img src="Grafiken/VarianteWechselAufgabe.png"	alt="" class="dialogfigur">
					<span class="dialogtext" id="ChallengeVarianteWechselText"></span>
				</div>
				<div id="dialog_ChallengeHauptzug" 				class="hiddendialog gc-ChallengeHauptzug">
					<img src="Grafiken/VarianteWechselAufgabe.png"	alt="" class="dialogfigur">
					<span class="dialogtext">Alle Varianten abgewählt. Weiter mit dem Hauptzug</span>
				</div>
				<div id="dialog_ChallengeVarianteEnde" 		class="hiddendialog gc-ChallengeVarianteEnde">
					<img src="Grafiken/VarianteEndeAufgabe.png" 		alt="" class="dialogfigur">
					<span class="dialogtext" id="ChallengeVarianteEndeText"></span>
				</div>
				<div id="dialog_PlayerVarianteStart" 			class="hiddendialog gc-PlayerVarianteStart">
					<img src="Grafiken/VarianteStartSpieler.png" 		alt="" class="dialogfigur">
					<span class="dialogtext" id="PlayerVarianteStartText"></span>
				</div>
				<div id="dialog_PlayerVarianteWechsel" 		class="hiddendialog gc-PlayerVarianteWechsel">
					<img src="Grafiken/VarianteWechselAufgabe.png"	alt="" class="dialogfigur">
					<span class="dialogtext" id="PlayerVarianteStartWechsel"></span>
				</div>
				<div id="dialog_PlayerHauptzug" 					class="hiddendialog gc-PlayerHauptzug">
					<img src="Grafiken/VarianteWechselSpieler.png"	alt="" class="dialogfigur">
					<span class="dialogtext">Alle Varianten abgewählt. Weiter mit dem Hauptzug</span>
				</div>
				<div id="dialog_PlayerVarianteEnde" 			class="hiddendialog gc-PlayerVarianteEnde">
					<img src="Grafiken/VarianteEndeSpieler.png" 		alt="" class="dialogfigur">
					<span class="dialogtext" id="PlayerVarianteEndeText"></span>
				</div>
				<div id="dialog_LichessUser" 						class="hiddendialog gc-LichessImport">
					<img src="Grafiken/lichesslogo.jpeg" alt="" class="dialogfigur">
					<div class="dialogtext">
						<label for="lichessuser">Bitte die Benutzerkennung eintragen</label>
						<input type="text" name="lichessuser" id = "lichessuser">
					</div>
					<div id='studienanzeige'>
						<ul id='studienliste' class='scrollme hideMe'></ul>
					</div>
				</div>
				<div id="dialog_Miniboard"							class="hiddendialog">
				</div>
				<div id="dialog_DBErrorMessages"				class="hiddendialog gc-DBErrorMessages">
					<img src="Grafiken/fehler.png" alt="" class="dialogfigur">
					<div class="dialogtext">
						Der Auftrag konnte nicht erfolgreich durchgeführt werden:
						<span class="dialogvariable" id="DBErrorMessage"></span>
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
				<div id="dialog_Enginelog" class="hiddendialog">
					<div id="logliste"></div>
				</div>
			</article>
		</div>
	</div>
</body>
</html>