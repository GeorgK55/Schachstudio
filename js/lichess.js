
function getlichessUserdata() {

	const headers = { Authorization: 'Bearer ' + 'lip_dXasEGgvxmJGdYQPZXVM' };

	fetch('https://lichess.org/api/account', { headers })
  .then(res => res.json())
	.then(function(res) {
		console.log(res);
	});

}

function getlichessUserstudies() {

	const headers = { 'Authorization': 'Bearer ' + 'lip_dXasEGgvxmJGdYQPZXVM' };

	fetch('https://lichess.org/api/study/by/GeorgK', { headers })
   .then(res => res.text())
	 .then(function(res) {
	 		console.log(res);
			studienliste = res.split('\n');
			console.log(studienliste);
			getstudydata(studienliste, studienliste.length);
 		})
	;

}

function getstudydata(studien, counter) {

	const headers = { 'Authorization': 'Bearer ' + 'lip_dXasEGgvxmJGdYQPZXVM' };

  for(i = 0; i < counter; i++) {
    console.log(studien[i]);

	fetch('https://lichess.org/api/study/' + JSON.parse(studien[i]).id + '.pgn', { headers })
		.then(res => res.text())
		.then(function(res) {
			console.log(res);
		})
	}

}

//getlichessUserdata();
//getlichessUserstudies();