async function executeQuery(query) {
		let requestBody = { 'query':query };
		console.log(query)

		// let [currentMethod, url] = ['GET', 'http://localhost:3000/exec']
		// if(query.toLowerCase().indexOf('insert') == 0) {
			let method = 'POST';
			let url = 'http://localhost:3000/exec';
		// }

			console.log(JSON.stringify(requestBody))

		const response = await fetch( url,
										{
											method: 'POST',
											headers: {
												'Accept': 'application.json',
												'Content-Type': 'application/json'
											},
											body: JSON.stringify(requestBody),
											cache: 'default'
										}
									);
		// response.then(
		// 	data => { console.log("||"+JSON.stringify(data)+"||"); },
		// 	err => { console.log(err); }
		// );

		const responseJSON = await response.json();
		console.log(responseJSON);

		if(responseJSON.errorExplain || responseJSON.errorLog || responseJSON.errorQuery) {
			return false;
		}


		if(responseJSON.resultQuery && responseJSON.resultQuery.length > 0) {
			const resultTable = document.getElementById('result-table');

			let keys = Object.keys(responseJSON.resultQuery[0]);

			let appendHTML = "<thead>";
			keys.forEach((k) => {
				appendHTML += "<td><b>" + k + "</b></td>"
			});
			appendHTML += "</thead>";
			resultTable.innerHTML += appendHTML;

			console.log(keys);

      responseJSON.resultQuery.forEach(element => {

	      appendHTML = "<tr>";
				keys.forEach((k) => {
					appendHTML += "<td>" + element[k] + "</td>"
				});
				appendHTML += "</tr>";

      	resultTable.insertAdjacentHTML('beforebegin', appendHTML)
      });
  }

		if(responseJSON.resultExplain && responseJSON.resultExplain.length > 0) {
  			const explainTable = document.getElementById('explain-table');

			let keys = Object.keys(responseJSON.resultExplain[0]);

			let appendHTML = "<thead>";
			keys.forEach((k) => {
				appendHTML += "<td><b>" + k + "</b></td>"
			});
			appendHTML += "</thead>";
			explainTable.innerHTML += appendHTML;

			console.log(keys);

	      	responseJSON.resultExplain.forEach(element => {

		      	appendHTML = "<tr>";
					keys.forEach((k) => {
						appendHTML += "<td>" + element[k] + "</td>"
					});
					appendHTML += "</tr>";

	      		explainTable.insertAdjacentHTML('beforebegin', appendHTML)
      		});
		}

		return true;
}