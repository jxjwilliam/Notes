	data = data.map(x=>{
	let er = {
		"Agent": x.fullName,
		"Status": x.status || "N/A",
		"Calls": x.calls || "0",
		"In Review Time": x.inReviewTime ? (x.inReviewTime): "00:00:00",
		"On Call Time": x.onCallTime ? (x.onCallTime): "00:00:00",
		"Wrap Up Time": x.wrapUpTime ? (x.wrapUpTime): "00:00:00",
	};

	/**
	 * This works only for xlsx, not csv, coz each agent columns could be different.
	 *
	 let t = {};
	 Object.keys(x.options).forEach(o => t[o] = x.options[o]);
	 Object.assign(er, t);
	 */
	if(Object.keys(x.options).length>0) {
		ary.forEach(o => {
			let t = {};
			t[o] = x.options[o] || 0;						
		});
		Object.assign(er, t);
	}
	console.log('william:', JSON.stringify(er));
	return er;
	});


/**
 * This works only for xlsx, not csv, coz each agent columns could be different.
 *
 *   let t = {};
 *   Object.keys(x.options).forEach(o => t[o] = x.options[o]);
 *   Object.assign(er, t);
 *   if (Object.keys(x.options).length>0) {...}
 */


	processAgentStatus(data, exportType) {
		if (data && Array.isArray(data)) {

			if(!exportType || exportType !=='csv') {

				data = data.map(x=>{
					let er = {
						"Agent": x.fullName,
						"Status": x.status || "N/A",
						"Calls": x.calls || "0",
						"In Review Time": x.inReviewTime ? (x.inReviewTime): "00:00:00",
						"On Call Time": x.onCallTime ? (x.onCallTime): "00:00:00",
						"Wrap Up Time": x.wrapUpTime ? (x.wrapUpTime): "00:00:00",
					};
					if(Object.keys(x.options).length>0) {
						let t = {};
						Object.keys(x.options).forEach(o => {
							t[o] = x.options[o];
						});
						Object.assign(er, t);
					}
					console.log('william:', JSON.stringify(er));
					return er;
				});
			}
			else {
				let ary = [];
				// extract: ["Connection Lost", "Disconnected Number", "Busy", "Do Not Call Registry"]
				data.forEach(x=> {
					Object.keys(x.options).forEach(o => {
						if(o && ary.indexOf(o)===-1) {
							ary.push(o);
						}
					});
				});

				data = data.map(x=>{
					let er = {
						"Agent": x.fullName,
						"Status": x.status || "N/A",
						"Calls": x.calls || "0",
						"In Review Time": x.inReviewTime ? (x.inReviewTime): "00:00:00",
						"On Call Time": x.onCallTime ? (x.onCallTime): "00:00:00",
						"Wrap Up Time": x.wrapUpTime ? (x.wrapUpTime): "00:00:00",
					};

					let t = {};
					ary.forEach(o => {
						x.options = x.options || {};
						t[o] = x.options[o] || 0;
					});
					Object.assign(er, t);
					return er;
				});
			}
		}
		return data;
	}
