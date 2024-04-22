$(document).ready(function () {

	// Steuerung der Logausgaben
	curLoglevel = LOGLEVEL_SLIGHT;
	//curLoglevel = LOGLEVEL_NICE;
	//curLoglevel = LOGLEVEL_IMPORTANT;
	curLogthemes	= [LOGTHEME_DATA, LOGTHEME_SITUATION];
	//curLogthemes	= [LOGTHEME_DATA]; 
	//curLogthemes	= [LOGTHEME_SITUATION];
	//curLogthemes		= [];

	TriggerMoveToStackCounter = 0; // Ohne Funktion, nur zwecks Debug

	headers = {};

	if (window.location.search != "") {
		countVisitor("get"); // Nur anzeigen
		let activemode = location.search.split("=").pop();
		if (activemode == "georg") { headers = { 'Authorization': 'Bearer ' + lichessToken }; }
	} else {
		countVisitor("increment"); // hochzählen und anzeigen
		logVisitor("Besucher");
	}

	zeigeWillkommentip();

	// Werden eventuell in openFullScreen überschrieben
	DeterminedWidth	= $(window).width();
	DialogWidth			= Math.floor($(window).width() / 4);

	GlobalFullscreenflag = false;
	if (window.matchMedia("(orientation: portrait)").matches) {
		FullscreenDialog();
	}

	$("input[type=radio][name=AufgabenFilterAlle]").on("click", function () {
		switch ($(this).val()) {
			case "Selektion":
				getChallenges([]);
				break;
			case "Alle":
				getChallenges($("#themenlistetree").jstree(true).get_selected());
				break;
		}
	});

	$("#btn-themaneu").prop("disabled", true);
	$("#btn-ehemaentfernen").prop("disabled", true);

	$("button").button();

	$("[id^='s_']").hide();		// Alle sections innerhalb der sx_aktionensection
	$("#s_willkommen").show();
	$("[id^='s1_']").show();	// Alle Startersections
	$("[id^='s2_']").hide();	// Alle Anzeigesections

	Stellungsdaten = new CStellungsdaten(); // Hier ???
	getThemes();
	getChallenges([]);

	GlobalActionContext						= AC_CHALLENGE_VARIANTENDIREKT;
	GlobalActionStep							= ""; 
	GlobalSpielinteraktion				= SPIELINTERAKTION_AUFGABEMIT;
	Stellungsdaten.CreateNewNode	= true;
	MitVarianten									= PHPTRUE;
	GLOBALNOTATIONMODE 						= NOTATIONMODE_VISIBLE;

	// Wird die Engine nur hier aktiviert. Je nach Spielinteraktion nicht nötig, aber es entstehen auch keine Mehrfachaktivierungen
	TheIndexGeorgFunction();
	//TheIndexExperimentFunction();
});

function FullscreenDialog() {
	FrageFullscreenDialog = $("#dialog_fragefullscreen").dialog({
		title: "Zum Training",
		modal: true,
		draggable: false,
		resizable: false,
		//position: { my: "left top", at: "left top", of: "#h_spielen" },
		show: "blind",
		hide: "blind",
		height: 350,
		width: 250,
		buttons: {
			Ja: function () {
				openFullscreen();
				$(this).dialog("close");
			},
			Nein: function () {
				$(this).dialog("close");
			},
		},
	});
}

function openFullscreen() {
	document.getElementById("seite").requestFullscreen();

	GlobalFullscreenflag = true;

	screen.orientation.lock("landscape-primary").then(
		function (answer) {
			//alert("then: " + answer);
			DeterminedWidth = $(window).width();
			DialogWidth = Math.ceil($(window).width() / 4);
		},
		function (answer) {
			//alert("else: " + answer);
		}
	);
}

function countVisitor(CounterAction) {
	$.get({
		url: "php/get_dbdata.php",
		data: { dataContext: "VisitorCounter", CounterAction: CounterAction },
		dataType: "json",
	})
		.done(function (responseData) {
			//let Antwort = jQuery.parseJSON(responseData);

			//	if (Antwort.ergebnisflag) {
			if (responseData["ergebnisflag"]) {
				$("#visitorcounterspan").html(
					"Besucher: " + responseData["ergebnisdaten"]
				);
			} else {
				showDBErrorMessagesDialog(Antwort);
			}
		})
		.fail(function (xhr, textStatus, error) {
			alert("fail with: " + xhr);
		});
}

function logVisitor(Role) {
	let DBDate								= moment().format("YYYY-MM-DD H:mm:ss");
	let CurrentBrowserName		= navigator.userAgent.split(" ").slice(-1)[0];
	let CurrentBrowserDetails	= navigator.userAgent;
	let Orientation						= ""; /*screen.orientation.type*/ // safari kann das nicht
	let myWidth								= window.innerWidth;
	let myHeight							= window.innerHeight;
	let devicePixelRatio			= window.devicePixelRatio;
	let pixelDepth						= screen.pixelDepth;
	let colorDepth						= screen.colorDepth;

	let ReturnText = "";

	$.post({
		url: "php/put_dbdata.php",
		dataType: "json",
		data: {
			dataContext:		"LogVisitor",
			Benutzer:				"",
			Besuchszeit:		DBDate,
			Betriebssystem:	navigator.platform,
			BrowserName:		CurrentBrowserName,
			BrowserDetails:	CurrentBrowserDetails,
			Cookies:				navigator.cookieEnabled,
			Fensterbreite:	myWidth,
			Orientation:		Orientation,
			Fensterhoehe:		myHeight,
			PixelRatio:			devicePixelRatio,
			pixelDepth:			pixelDepth,
			colorDepth:			colorDepth,
			Aktion:					Role,
		},
	})
		.done(function (responseData) {
			/*alert("done");*/
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			AjaxError(jqXHR, textStatus, errorThrown);
		});
}

function zeigeWillkommentip() {
	let Zufallsindex = Math.floor(Math.random() * Willkommentip.length);
	$(".Willkommentiptitleclass").append(
		"<span>" + Willkommentip[Zufallsindex]["titel"] + "</span>"
	);
	$(".Willkommentiptextclass").append(
		"<span>" + Willkommentip[Zufallsindex]["text"] + "</span>"
	);
}