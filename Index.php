<?php 

	header("Cross-Origin-Opener-Policy: same-origin");
	header("Cross-Origin-Embedder-Policy: require-corp");

?>
<!DOCTYPE html>
<html lang="de"> 
<head>

	<title>Georgs Schachstudio</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<meta name="application-name"   content="Georgs Schachtraining">
	<meta name="description"        content="Training für Jugendliche in Schachvereinen">
	<meta name="author"             content="Georg">

	<link rel="stylesheet"	href="css/jquery-ui.css">
	<link rel="stylesheet"	href="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/themes/default/style.min.css" />
	<link rel="stylesheet"	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

	<script src="js/jquery-3.5.1.js"></script>
	<script src = "js/jquery-ui.js"></script>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/jstree.min.js"></script>

	<link rel="stylesheet" type="text/css" href="css/common.css">
	<link rel="stylesheet" type="text/css" href="css/media.css">
	<link rel="stylesheet" type="text/css" href="css/Schachbrett.css">

	<script src="js/ready.js"></script>
	<script src="js/const.js"></script>
	<script src="js/Benutzertexte.js"></script>
	<script src="js/Definitionen.js"></script>
	<script src="js/commonFunctions.js"></script>
	<script src="js/AppUtils.js"></script>
	<script src="js/ChessUtils.js"></script>
	<script src="js/ShowFunctions.js"></script>
	<script src="js/NotationFunctions.js"></script>
	<script src="js/DialogFunctions.js"></script>
	<script src="js/importDataFunctions.js"></script>
	<script src="js/getDataFunctions.js"></script>
	<script src="js/putDataFunctions.js"></script>
	<script src="js/approachGeorg.js"></script>	
	<script src="js/approachGeorg_EngineUtils.js"></script>	
	<script src="js/approachGeorg_PlayerUtils.js"></script>	
	<script src="js/rest.js"></script>
	<script src="js/stockfish.js"></script>
	<script src="js/xbtooltip.js"></script>
	<script src="js/sf_messagelistener_functions.js"></script>
	<!-- <script src="js/sf_messagelistener.js"></script> -->
	<script src="js/sf_messagelistener_georg.js"></script>
	<!-- <script src="js/sf_Experiment.js"></script> -->

	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
	
</head>

<body>
<div id="seite">
	<header>
		<h1>Georgs Schachstudio</h1>
		<div class="hiddendialog">
			<div id="Nodetext"></div>
			<div id="tooltips"></div>
		</div>
    </header>
	<section id="sx_Mitte">
		<section id="sx_Themensection">
			<header class="CenterMe"><p>Themenauswahl</p></header>
			<div id="a_Themenliste">
				<div id="ThemenlisteTree">
					<ul id="ul_Themenliste">
					</ul>
				</div>
				<div id="ThemenlisteButtons">
					<button id="btn_NeuesThema" 	type="button" onclick="NeuesThema()"	class="KomfortButton">Neues Thema</button>
					<button id="btn_ThemaEntfernen" type="button" onclick="EntferneThema()"	class="KomfortButton">Thema entfernen</button>
				</div>
			</div>
			<article id="a_Sonderfunktionen" class='developerfeatures'>
				<!-- <span id="asynccount">000</span>
				<button id="btn_async" type="button" onclick="countdouble()">async Verhalten testen</button> -->
				<button onclick="showPartieSpielen()"		class="EntwicklerButton">Partie spielen</button>
				<button onclick="showEnginedialog()"	class="EntwicklerButton">Enginedialog</button>
				<!-- <button onclick="testrest()" 		class="EntwicklerButton">Test Rest</button> -->
			</article>
		</section>
		<section id="sx_Aufgabensection">
			<header class="CenterMe"><p>Stellungen dazu</p></header>
			<div id="a_Aufgabenliste">
				<div id="AufgabenlisteTree">
					<ul id="ul_Aufgabenliste"></ul>
					<button id="btn_Aufgabeauswahl" type="button" onclick="Aufgabeauswahl()" class="vanishMe KomfortButton">Alle Aufgaben anzeigen</button>
				</div>
				<div id="AufgabelisteButtons">
					<button id="btn_NeueAufgabe" 		type="button" onclick="showNeueAufgabe()" 	class="KomfortButton"></button>
					<button id="btn_VerbindeAufgabe"	type="button" onclick="VerbindeAufgabe()" 	class="KomfortButton"></button>
					<button id="btn_TrenneAufgabe" 		type="button" onclick="TrenneAufgabe()" 	class="KomfortButton"></button>
					<button id="btn_EntferneAufgabe" 	type="button" onclick="EntferneAufgabe()" 	class="KomfortButton"></button>
				</div>
			</div>
			<div id="a_Aufgabedetails">
				<fieldset id="f_Aufgabedetails">
					<legend>Details der Aufgabe</legend>
					<ul>
						<li><label for="KurztextSpiel"		class="ShowSmall ShowMedium ShowLarge"	>Kurztext</label>			<input type="text" class="ShowSmall ShowMedium ShowLarge"	name="Kurztext" 	id = "KurztextSpiel" 		disabled>				</li>
						<li><label for="LangtextSpiel"		class="ShowLarge"						>Langtext</label>			<input type="text" class="ShowLarge"						name="Langtext" 	id = "LangtextSpiel" 		disabled>				</li>
						<li><label for="QuelleSpiel"		class="ShowSmall ShowMedium ShowLarge"	>Quelle</label>				<input type="text" class="ShowSmall ShowMedium ShowLarge"	name="Quelle" 		id = "QuelleSpiel" 			disabled>				</li>
						<li><label for="QuelledetailSpiel"	class="ShowLarge"						>Quelledetail</label>		<input type="text" class="ShowLarge"						name="Quelledetail" id = "QuelledetailSpiel" 	disabled>				</li>
						<li><label for="ScopeSpiel"			class="ShowLarge"						>Scope</label>				<input type="text" class="ShowLarge"						name="Scope" 		id = "ScopeSpiel" 			disabled>				</li>
						<li><label for="AmZugSpiel"			class="ShowSmall ShowMedium ShowLarge"	>Am Zug</label>				<input type="text" class="ShowSmall ShowMedium ShowLarge"	name="AmZug" 		id = "AmZugSpiel" 			disabled>				</li>
						<li><label for="SkillSpiel"			class="ShowLarge"						>Skill</label>				<input type="text" class="ShowLarge"						name="SkillSpiel" 	id = "SkillSpiel" 			disabled>				</li>
						<li><label for="FENSpiel"			class="ShowLarge"						>FEN</label>				<input type="text" class="ShowLarge"						name="FENSpiel" 	id = "FENSpiel"				disabled>				</li>
						<li><label for="ImportquelleSpiel"	class="ShowLarge"						>Importquelle</label>		<input type="text" class="ShowLarge"						name="Importquelle" id = "ImportquelleSpiel"	disabled>				</li>
						<li><label for="PGNTextSpiel"												>PGN:</label>				<textarea													name="PGNText"		id = "PGNTextSpiel"			disabled>	</textarea>	</li>
					</ul>
				</fieldset>
			</div>
		</section>
		<section id="sx_Aktionensection">
			<section id="s_PartieSpielen">
				<header class="CenterMe "><p>Eine Partie spielen</p></header>
				<article>
					<pre id="ChessState"></pre>
				</article>
			</section>
			<section id="s_AufgabenSpielen">
				<header id="h_AufgabenSpielen" class="CenterMe"><p>Spielen</p></header>
				<div id="AufgabeUndKonfiguration">
					<article id="a_Aufgabe_KonfUndMeta" class="ShowMedium ShowLarge">
						<fieldset>
							<legend>Bitte auswählen</legend>
							<input type="radio" id="r_Spiel" 		name="Spielinteraktion" onclick="setSpielinteraktion('AC_CHALLENGE_PLAY');" 		value="Spiel">				<label for="r_Spiel">Spiel ohne Hinweise</label><br>
							<input type="radio" id="r_Hinweise" 	name="Spielinteraktion" onclick="setSpielinteraktion('AC_CHALLENGE_RATING');" 		value="Hinweise">	<label for="r_Hinweise">Mit Bewertungshinweisen</label><br>
							<input type="radio" id="r_Varianten" 	name="Spielinteraktion" onclick="setSpielinteraktion('AC_CHALLENGE_Varianten');" 	value="Varianten" checked>			<label for="r_Varianten">Mit Varianten</label><br>
						</fieldset>
					</article>
					<article id="a_LogKonfigurationSpielen" class="LogKonfig ShowMedium ShowLarge">
						<fieldset>
							<legend>Protokollierung</legend>
							<input type="checkbox" id="cb_Enginelog" name="Enginelog" value="Enginelog_on" onclick="toggleEnginelog('cb_Enginelog');">
							<label for="cb_Enginelog">Enginekommunikation</label><br>
							<input type="checkbox" id="cb_EngineEin" name="EngineEin" value="EngineEin" checked class="shift1vw" onclick="toggleEnginelogEin();">
							<label for="cb_EngineEin">zur Engine</label><br>
							<input type="checkbox" id="cb_EngineAus" name="EngineAus" value="EngineAus" checked class="shift1vw" onclick="toggleEnginelogAus();">
							<label for="cb_EngineAus">von der Engine</label>
							</fieldset>
					</article>
				</div>
				<article id="a_BrettUndZug" class="AufgabeBrettUndZug">
					<div id="Brett_SpieleAufgabe" class="SpieleAufgabe">
						<div id="BrettUndMarker">
							<div class="chessboardGeorg">
								<div class="Brett_Koordinaten"> </div>
								<div class="Brett_Koordinaten">a</div>
								<div class="Brett_Koordinaten">b</div>
								<div class="Brett_Koordinaten">c</div>
								<div class="Brett_Koordinaten">d</div>
								<div class="Brett_Koordinaten">e</div>
								<div class="Brett_Koordinaten">f</div>
								<div class="Brett_Koordinaten">g</div>
								<div class="Brett_Koordinaten">h</div>
								<div class="Brett_Koordinaten"> </div>
								<div class="Brett_Koordinaten">8</div>
								<div id="Brett_SpieleAufgabe_a8" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_b8" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_c8" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_d8" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_e8" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_f8" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_g8" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_h8" class="Brett_s"></div>
								<div class="Brett_Koordinaten">8</div>
								<div class="Brett_Koordinaten">7</div>
								<div id="Brett_SpieleAufgabe_a7" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_b7" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_c7" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_d7" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_e7" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_f7" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_g7" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_h7" class="Brett_w"></div>
								<div class="Brett_Koordinaten">7</div>
								<div class="Brett_Koordinaten">6</div>
								<div id="Brett_SpieleAufgabe_a6" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_b6" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_c6" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_d6" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_e6" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_f6" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_g6" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_h6" class="Brett_s"></div>
								<div class="Brett_Koordinaten">6</div>
								<div class="Brett_Koordinaten">5</div>
								<div id="Brett_SpieleAufgabe_a5" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_b5" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_c5" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_d5" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_e5" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_f5" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_g5" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_h5" class="Brett_w"></div>
								<div class="Brett_Koordinaten">5</div>
								<div class="Brett_Koordinaten">4</div>
								<div id="Brett_SpieleAufgabe_a4" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_b4" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_c4" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_d4" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_e4" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_f4" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_g4" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_h4" class="Brett_s"></div>
								<div class="Brett_Koordinaten">4</div>
								<div class="Brett_Koordinaten">3</div>
								<div id="Brett_SpieleAufgabe_a3" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_b3" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_c3" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_d3" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_e3" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_f3" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_g3" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_h3" class="Brett_w"></div>
								<div class="Brett_Koordinaten">3</div>
								<div class="Brett_Koordinaten">2</div>
								<div id="Brett_SpieleAufgabe_a2" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_b2" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_c2" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_d2" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_e2" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_f2" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_g2" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_h2" class="Brett_s"></div>
								<div class="Brett_Koordinaten">2</div>
								<div class="Brett_Koordinaten">1</div>
								<div id="Brett_SpieleAufgabe_a1" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_b1" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_c1" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_d1" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_e1" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_f1" class="Brett_w"></div>
								<div id="Brett_SpieleAufgabe_g1" class="Brett_s"></div>
								<div id="Brett_SpieleAufgabe_h1" class="Brett_w"></div>
								<div class="Brett_Koordinaten">1</div>
								<div class="Brett_Koordinaten"> </div>
								<div class="Brett_Koordinaten">a</div>
								<div class="Brett_Koordinaten">b</div>
								<div class="Brett_Koordinaten">c</div>
								<div class="Brett_Koordinaten">d</div>
								<div class="Brett_Koordinaten">e</div>
								<div class="Brett_Koordinaten">f</div>
								<div class="Brett_Koordinaten">g</div>
								<div class="Brett_Koordinaten">h</div>
								<div class="Brett_Koordinaten"> </div>
							</div>
							<div id="zugmarkeraufgabe" class="zugmarkercolumn">
								<span class="zugmarker" id="zugmarkeraufgabeweiss">&#11036;</span>
								<span class="zugmarker" id="zugmarkeraufgabeschwarz">&#11035;</span>
							</div>
						</div>
						<div id="ChallengeMoves" class='developerfeatures'>
							<p>vor und zurück</p>
							<label for="Mausersatz">Mausersatz (debugger erkennt die Maus nicht):</label><input type="text" id = "Mausersatz">
							<button onclick="startMouseUp()">Mouse up starten</button>
						</div>
					</div>
					<div id="div_TreeNotationPlayChallenge" class="flexnotation">
						<div id="ChessTips"><i style="font-size:24px;color:blue" class="fa" onclick="showFirstAid()">&#xf059;</i></div>
						<div id="ScrollWrapperPlay" class="ScrollMe"> 
							<div id="TreeNotationslistePlayChallenge"></div>
						</div>						
						<div id="ChallengeTips"></div>						
					</div>
				</article>
			</section>
			<section id="s_lichess">
				<header class="CenterMe"><p>Lichess iframe</p></header>
				<div id="iframeframe">
					<!-- <iframe width=900 height=551 src="https://lichess.org/study/embed/G2g1VNWP/jPg9NS8y#0" frameborder=0></iframe> -->
					<iframe width=600 height=371 src="https://lichess.org/study/embed/E06MI1XV/Cv4blOr1" frameborder=0></iframe>
				</div>
			</section>
			<section id="s_NeueAufgabe">
				<header class="CenterMe"><p>Neue Aufgabe</p></header>
				<article id="a_ImportAufgabe">
					<div id="filearea" class="halfspace">
						<div id="fileareabuttons">
							<button type="button" onclick="DatenBereitstellen_Zwischenablage()"	class="ImportButton">Aus Zwischenablage<br>übernehmen</button>
							<button type="button" onclick="DatenBereitstellen_Datei()"			class="ImportButton">Aus Datei<br>übernehmen</button>
							<!-- <button type="button" onclick="DatenBereitstellen_Lichess()"		class="ImportButton">Kapitel aus lichess<br>kopieren</button> -->
						</div>
						<div id="filename">
							<p id="filenametext"></p>
						</div>
						<fieldset id="f_Aufgabedaten">
							<legend>Alle Daten der Aufgabe</legend>
							<ul id="ImportAufgabedetails">
								<li><label for="KurztextImport">Kurztext</label>		<input type="text" 	name="Kurztext" 	id = "KurztextImport">			</li>
								<li><label for="LangtextImport">Langtext</label>		<input type="text" 	name="Langtext" 	id = "LangtextImport">			</li>
								<li><label for="QuelleImport">Quelle</label>			<input type="text" 	name="Quelle" 		id = "QuelleImport">			</li>
								<li><label for="QuelledetailImport">Quelledetail</label><input type="text" 	name="Quelledetail" id = "QuelledetailImport">		</li>
								<li><label for="ImportQuelleImport">ImportQuelle</label><input type="text" 	name="ImportQuelle" id = "ImportQuelleImport" disabled></li>
								<li><label for="AmZugImport">Am Zug</label>				<input type="text"	name="AmZug" 		id = "AmZugImport" 	disabled>	</li>
								<li><label for="FENImport">FEN</label>					<input type="text"	name="FENImport" 	id = "FENImport" 	disabled>	</li>
								<li><label for="ScopeImport">Scope</label>				<input type="text" 	name="Scope" 		id = "ScopeImport">				</li>
								<li><label for="SkillImport">Skill</label>				<input type="text"	name="SkillImport" 	id = "SkillImport">				</li>
							</ul>
						</fieldset>
					</div>
					<div id=challengearea class="halfspace">
						<ul id="ul_importaufgaben"></ul>
						<label for="ImportAreaText">Erkannter Text:</label> 
						<textarea id="ImportAreaText"></textarea>
					</div>
				</article>
				<article id="a_BrettUndImport" class="ImportBrett">
					<div id="Brett_ImportAufgabe">
						<div class="chessboardGeorgImport">
							<div class="Brett_KoordinatenImport"> </div>
							<div class="Brett_KoordinatenImport">a</div>
							<div class="Brett_KoordinatenImport">b</div>
							<div class="Brett_KoordinatenImport">c</div>
							<div class="Brett_KoordinatenImport">d</div>
							<div class="Brett_KoordinatenImport">e</div>
							<div class="Brett_KoordinatenImport">f</div>
							<div class="Brett_KoordinatenImport">g</div>
							<div class="Brett_KoordinatenImport">h</div>
							<div class="Brett_KoordinatenImport"> </div>
							<div class="Brett_KoordinatenImport">8</div>
							<div id="Brett_ImportAufgabe_a8" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_b8" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_c8" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_d8" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_e8" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_f8" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_g8" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_h8" class=" Brett_sImport"></div>
							<div class="Brett_KoordinatenImport">8</div>
							<div class="Brett_KoordinatenImport">7</div>
							<div id="Brett_ImportAufgabe_a7" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_b7" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_c7" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_d7" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_e7" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_f7" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_g7" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_h7" class=" Brett_wImport"></div>
							<div class="Brett_KoordinatenImport">7</div>
							<div class="Brett_KoordinatenImport">6</div>
							<div id="Brett_ImportAufgabe_a6" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_b6" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_c6" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_d6" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_e6" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_f6" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_g6" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_h6" class=" Brett_sImport"></div>
							<div class="Brett_KoordinatenImport">6</div>
							<div class="Brett_KoordinatenImport">5</div>
							<div id="Brett_ImportAufgabe_a5" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_b5" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_c5" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_d5" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_e5" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_f5" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_g5" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_h5" class=" Brett_wImport"></div>
							<div class="Brett_KoordinatenImport">5</div>
							<div class="Brett_KoordinatenImport">4</div>
							<div id="Brett_ImportAufgabe_a4" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_b4" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_c4" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_d4" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_e4" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_f4" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_g4" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_h4" class=" Brett_sImport"></div>
							<div class="Brett_KoordinatenImport">4</div>
							<div class="Brett_KoordinatenImport">3</div>
							<div id="Brett_ImportAufgabe_a3" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_b3" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_c3" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_d3" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_e3" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_f3" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_g3" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_h3" class=" Brett_wImport"></div>
							<div class="Brett_KoordinatenImport">3</div>
							<div class="Brett_KoordinatenImport">2</div>
							<div id="Brett_ImportAufgabe_a2" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_b2" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_c2" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_d2" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_e2" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_f2" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_g2" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_h2" class=" Brett_sImport"></div>
							<div class="Brett_KoordinatenImport">2</div>
							<div class="Brett_KoordinatenImport">1</div>
							<div id="Brett_ImportAufgabe_a1" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_b1" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_c1" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_d1" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_e1" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_f1" class=" Brett_wImport"></div>
							<div id="Brett_ImportAufgabe_g1" class=" Brett_sImport"></div>
							<div id="Brett_ImportAufgabe_h1" class=" Brett_wImport"></div>
							<div class="Brett_KoordinatenImport">1</div>
							<div class="Brett_KoordinatenImport"> </div>
							<div class="Brett_KoordinatenImport">a</div>
							<div class="Brett_KoordinatenImport">b</div>
							<div class="Brett_KoordinatenImport">c</div>
							<div class="Brett_KoordinatenImport">d</div>
							<div class="Brett_KoordinatenImport">e</div>
							<div class="Brett_KoordinatenImport">f</div>
							<div class="Brett_KoordinatenImport">g</div>
							<div class="Brett_KoordinatenImport">h</div>
							<div class="Brett_KoordinatenImport"> </div>
						</div>
					</div>
					<div id="div_TreeNotationImport" class="flexnotation">
						<div id="ScrollWrapperImport" class="ScrollMe">
							<!-- <div id="TreeNotationslisteImport"></div> -->
						</div>
					</div>
					<div>
						<div id="ImportAreaButtons">
							<button type="button" onclick="AufgabeImportieren()"				class="ImportButton">Aufgabe<br>prüfen</button>
							<button type="button" onclick="AufgabeSpeichern()"					class="ImportButton">Aufgabe<br>speichern</button>
						</div>
						<article id="a_LogKonfigurationAufgabe" class="LogKonfig">
							<fieldset>
								<legend>Protokollierung</legend>
								<input type="checkbox" id="cb_EnginelogImport" name="Enginelog" value="Enginelog_on" onclick="toggleEnginelog('cb_EnginelogImport');">
								<label for="cb_EnginelogImport">Enginekommunikation</label><br>
								<input type="checkbox" id="cb_EngineImportEin" name="EngineEin" value="EngineEin" checked class="shift1vw" onclick="toggleEnginelogEin();">
								<label for="cb_EngineImportEin">zur Engine</label><br>
								<input type="checkbox" id="cb_EngineImportAus" name="EngineAus" value="EngineAus" checked class="shift1vw" onclick="toggleEnginelogAus();">
								<label for="cb_EngineImportAus">von der Engine</label>
								</fieldset>
						</article>
					</div>
				</article>
			</section>
			<section id="s_EngineDialog">
				<header class="CenterMe"><p>Enginedialog</p></header>
				<article id="a_Kommandos">
					<div>
						<article id="a_usedcommands">
							<label id="usedcommands">Oft gebraucht
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
							</label>
						</article>
						<article id="a_LogKonfigurationDialog" class="LogKonfig">
							<fieldset id="debugLogKonfiguration">
								<legend>Protokollierung</legend>
								<input type="checkbox" id="cb_Enginelogdebug" name="Enginelog" value="Enginelog_on" onclick="toggleEnginelog('cb_Enginelogdebug');">
								<label for="cb_Enginelogdebug">Enginekommunikation</label><br>
								<input type="checkbox" id="cb_EngineEindebug" name="EngineEin" value="EngineEin" checked class="shift1vw" onclick="toggleEnginelogEin();">
								<label for="cb_EngineEindebug">zur Engine</label><br>
								<input type="checkbox" id="cb_EngineAusdebug" name="EngineAus" value="EngineAus" checked class="shift1vw" onclick="toggleEnginelogAus();">
								<label for="cb_EngineAusdebug">von der Engine</label>
								</fieldset>
						</article>
						</div>
					<div>
						<label for="Regexstart" style="float: left;">Regex</label>
						<input type="text" id = "Regexstart">
						<button type="button" onclick="RegexAbschicken()">Ab damit Regex</button>
					</div>
					<div>
						<label for="Kommandostart" style="float: left;">Nächstes</label>
						<input type="text" id = "Kommandostart">
						<button type="button" onclick="KommandoAbschicken()">Ab damit</button>
					</div>
				</article>
			</section>
			<section id="s_Willkommen">
				<header class="CenterMe"><p>Willkommen</p></header>
				<article id="a_Welcome">
					<button id="btn_Spieler" type="button" class="WelcomeButton" onclick="showSpielerinfo()">Als Spieler weiter</button>
					<button id="btn_Trainer" type="button" class="WelcomeButton" onclick="showTrainerinfo()">Als Trainer weiter</button>
				</article>
			</section>
			<section id="s_Spielerinfo">
				<header class="CenterMe"><p>Hinweise für Spieler</p></header>
				<div id="Spielerinfo_div"></div>
			</section>
			<section id="s_Trainerinfo">
				<header class="CenterMe"><p>Hinweise für Trainer</p></header>
				<div id="Trainerinfo_div"></div>
			</section>
		</section>
    </section>
    <footer>
		<article>
			<div id="TriggerTag"></div>
		</article>
		<article id="ModaleFenster">
			<input type="file" id="file-input" />
			<div id="dialog_neuesthema" 		class="hiddendialog">&nbsp;</div>
			<div id="dialog_themaentfernen" 	class="hiddendialog">&nbsp;</div>
			<div id="dialog_AufgabeVerbinden" 	class="hiddendialog">&nbsp;</div>
			<div id="dialog_AufgabeTrennen" 	class="hiddendialog">&nbsp;</div>
			<div id="dialog_AufgabeEntfernen" 	class="hiddendialog">&nbsp;</div>
			<div id="dialog_StopScriptTest" 	class="hiddendialog">&nbsp;</div>
			<div id="dialog_Zugdifferenz" 		class="hiddendialog">
				<p>Es gibt einen stärkeren Zug als <span id="RatingSpielerzug"></span></p>
				<p id="Zugalternative"><span id="Zugvorschlag"></span>&nbsp;<span id="Zugbewertung"></span></p>
			</div>
			<div id="dialog_BessererZug" 		class="hiddendialog">
				<p>Entweder gibt es gibt einen stärkeren Zug als <span id="VariantenSpielerzug"></span> oder der Zug ist nicht erlaubt</p>
				<p id="EngineZugalternative"><span id="VariantenZugvorschlag"></span></p>
			</div>
			<div id="dialog_ChallengeVarianteStart" 		class="hiddendialog"> 
				<p id="ChallengeVarianteStartText"></p> 
			</div>
			<div id="dialog_ChallengeHauptzug" 		class="hiddendialog">
				<p>Alle Varianten abgewählt. Weiter mit dem Hauptzug</p> 
			</div>
			<div id="dialog_ChallengeVarianteWechsel" 		class="hiddendialog"> 
				<p id="ChallengeVarianteWechselText"></p> 
			</div>
			<div id="dialog_ChallengeVarianteEnde" 		class="hiddendialog">
				<p id="ChallengeVarianteEndeText"></p> 
			</div>
			<div id="dialog_PlayerVarianteStart" 		class="hiddendialog">
				<p id="PlayerVarianteStartText"></p> 
			</div>
			<div id="dialog_PlayerHauptzug" 		class="hiddendialog">
				<p>Alle Varianten abgewählt. Weiter mit dem Hauptzug</p> 
			</div>
			<div id="dialog_PlayerVarianteWechsel" 		class="hiddendialog">
				<p id="PlayerVarianteStartWechsel"></p> 
			</div>
			<div id="dialog_PlayerVarianteEnde" 		class="hiddendialog">
				<p id="PlayerVarianteEndeText"></p> 
			</div>
			<div id="dialog_PlayerVarianteEnde" 		class="hiddendialog">
				<p id="PlayerVarianteEndeText"></p> 
			</div>
			<div id="dialog_LichessImport" 		class="hiddendialog">
				<p>Bitte die Kennung der Studie und des Kapitels eintragen (siehe Beispiel)</p>
				<p><img src="Bilder/lichesskapitel.png" alt="" class="imgkapitel"></p>
				<label for="lichesskapitel">Kapitelname:</label> 
				<p id="lichessdata"><input type="text" name="lichesskapitel" id = "lichesskapitel"></p>
			</div>
			<div id="dialog_Miniboard"			class="hiddendialog">
			</div>
		</article>
		<article id="InterneLogs">
			<div id="dialog_Enginelog" class="hiddendialog">
				<div id="logliste"></div>
			</div>
		</article>
	</footer>
</div>
 </body>
</html>