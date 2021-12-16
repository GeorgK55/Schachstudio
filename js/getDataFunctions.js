
function getThemes() {

	$.ajax({
	  url: "php/getDBData.php",
	  data: { dataContext: "Themes" },
	  type: "GET"
	}).done(function(responseData) {

		var Themes = jQuery.parseJSON(responseData);

		var ThemesLevel0 = $.grep(Themes, function(theme, i) {
			return (theme['Level'] == 0);			
		});

		ThemesLevel0.forEach(function(item, idx) {
			AddTreeviewSubItems(Themes, item, 'ul_Themenliste');
		});

		$(function () { $('#div_Themenliste').on('changed.jstree', function (e, data) {

			var i, r = [];
			
    		for(i = 0; i < data.selected.length; i++) {
				r.push(data.instance.get_node(data.selected[i]).text); // wird erst später genutzt
				GlobalThemaId = data.instance.get_node(data.selected[i]).li_attr["data-themaid"];
    		}

			GlobalAufgabeId = 0; // entfernt eine eventuelle Markierung in der Aufgabenliste
			$('#s_AufgabenSpielen').hide(); // entfernt ein eventuell angezeigtes Brett zur Aufgabe

			//getChallenges($('#cb_Aufgabeauswahl').prop( "checked" ) ? ALLEAUFGABENANZEIGEN : GlobalThemaId);
			$('#btn_Aufgabeauswahl').removeClass('vanishMe').addClass('appearMe');
			getChallenges($('#btn_Aufgabeauswahl').html() == "Alle Aufgaben anzeigen" ? GlobalThemaId : ALLEAUFGABENANZEIGEN);
	
		}).jstree({'core': {
								'check_callback':	true,
								'open_parents':		true,
								'load_open':		true,
								'themes' : 			{	'variant' : 'large',
														'icons': false
										   			}
		   }}); 
		});
	});
}

function AddTreeviewSubItems(Themes, item, ul_parent) {

	var Aktuelle_li_ID = item['Level'] + '_' + item['Thematext'].replace(" ", "");
	
	// Findet alle Zeilen, in denen der aktuelle Thema als Father vorkommt und die Ebene um 1 höher ist
	var Subitems = $.grep(Themes, function(theme, i) { return (theme['Level'] == parseInt(item['Level']) + 1 && theme['Father'] == item['Thematext']); });
	
	// Wenn die aktuelle Zeile keine zugeordneten Zeilen hat, muss lediglich die Zeile als li-Tag eingefügt werden
	// Wenn nicht: Einen span-Tag für einen Marker und das Click-Event in den li-Tag einfügen
	// Eventlistener hat nicht funktioniert (jquery hat nur Tags erkannt, die schon  per php vorhanden waren).
	if(Subitems.length > 0) {
		
		//var newitem = '<li data-themaid="' + item['Id'] + '">' + item["Thematext"] + '</span></li>';
		var newitem = '<li id="' + Aktuelle_li_ID + '" data-themaid="' + item['Id'] + '">' + item["Thematext"] + '</span></li>';
		$(newitem).appendTo('#' + ul_parent); // ul_parent zeigt immer auf den aktuellen (Unter)listenanfang

		// Jetzt einen neuen (Unter)listenanfang setzen
		ul_parent = 'ul_' + item['Level'] + '_' + item['Thematext'].replace(" ", "");
		$('<ul id="' + ul_parent + '">').appendTo('#' + Aktuelle_li_ID); // An das grad erzeugte li-Element!!!
		
		Subitems.forEach(function(subitem, idx) {

			AddTreeviewSubItems(Themes, subitem, ul_parent); // Das ist die Rekursion !!!

		});
	} else {

		//var newitem = '<li data-themaid="' + item['Id'] + '">' + item["Thematext"] + '</li>';
		var newitem = '<li id="' + Aktuelle_li_ID + '" data-themaid="' + item['Id'] + '">' + item["Thematext"] + '</li>';
		$(newitem).appendTo('#' + ul_parent);

	}
}

function getChallenges(ThemaId) {

	//console.log('getChallenges mit ' + ThemaId);

	$.ajax({
		url: "php/getDBData.php",
		data: { dataContext: "Challenges", themaid: ThemaId },
		type: "GET"
	  }).done(function(responseData) {

		$('#ul_Aufgabenliste').empty();

		var Challenges = jQuery.parseJSON(responseData);
  
		Challenges.forEach(function(item, idx) {

			if(item.lichess_studie != null && item.lichess_kapitel != null) {
				quelleclass = item.lichess_studie + '/' + item.lichess_kapitel;
			} else {
				quelleclass = "georg";
			}

			quelleclass = "georg"; // mal zwecks debug

			var newitem = '<li id="' + item.Aufgaben_ID + '" data-lichess="' + quelleclass + '">' + item.Kurztext + '</li>';
			$(newitem).appendTo('#ul_Aufgabenliste'); 
		});

		$( "#ul_Aufgabenliste" ).selectable({
			selected: function( event, ui ) {
				GlobalAufgabeId = ui.selected.id;
				var AktuelleQuelleKlasse = $('#'+ui.selected.id).attr('data-lichess');
				if(AktuelleQuelleKlasse == 'georg') {
					//(ui.selected.id, AktuelleQuelleKlasse)
					showChallengegeorg(ui.selected.id);
				} else {
					showChallengelichess(ui.selected.id, AktuelleQuelleKlasse)
				}
			}
		});
	  });	  
}

function getChallenge(ID) {

	$.ajax({
		url: "php/getDBData.php",
		data: { dataContext: "Aufgabedaten", AufgabeID: ID },
		type: "GET"
	  }).done(function(responseData) {

		Challenge = jQuery.parseJSON(responseData); 

		$('#KurztextSpiel').val(Challenge[0].Kurztext == null ? "" : Challenge[0].Kurztext);
		$('#LangtextSpiel').val(Challenge[0].Langtext);
		$('#QuelleSpiel').val(Challenge[0].Quelle);
		$('#QuelledetailSpiel').val(Challenge[0].Quelledetail);
		$('#ImportQuelleSpiel').val(Challenge[0].ImportQuelle);
		$('#ScopeSpiel').val(Challenge[0].Scope);
		$('#SkillSpielSpiel').val(Challenge[0].Skill);
		$('#AmZugSpiel').val(Challenge[0].AmZug);
		$('#FENSpiel').val(Challenge[0].FEN);

		T_Zuege.FEN = Challenge[0].FEN; // das ist dann die jeweils aktuelle Situation
		T_Zuege.ZugFarbe = Challenge[0].FEN.indexOf('w') > 0 ? WEISSAMZUG : SCHWARZAMZUG;
		StellungAufbauen("Brett_SpieleAufgabe", Challenge[0].FEN, "zugmarkeraufgabe");

		$.ajax({
			url: "php/getDBData.php",
			data: { dataContext: "Zugdaten", AufgabeID: ID },
			type: "GET"
			}).done(function(responseData) {

				ChallengeMoves = jQuery.parseJSON(responseData);
				console.log(ChallengeMoves); 
		});
	
	});


}

function isChallengeUsed(ID) {

	return new Promise(function(resolve, reject) {

		$.ajax({
			url: "php/getDBData.php",
			data: { dataContext: "Aufgabebenutzung", AufgabeID: ID },
			type: "GET",
			success: function(responseData) {

				i = parseInt(responseData);

				isChallengeUsedResult = i == 0 ? false : true;
				console.log("isChallengeUsedResult: " + isChallengeUsedResult);

				resolve(isChallengeUsedResult);
			},
			error: function(errdata) {
				reject(errdata);
			}
		});
	});
}
