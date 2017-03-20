http://localhost:9000/#/dashboard/environment::45a9fbf2-b565-4922-ad58-980aa677deae/campaign-monitor/campaign::0a6be69a-470c-4a8a-ae68-623592486d5b



// campaign::0a6be69a-470c-4a8a-ae68-623592486d5b 
// environment::45a9fbf2-b565-4922-ad58-980aa677deae null agent


SELECT
	uc.userPk AS userId,
	u.fullName.\`first\` || ' ' || u.fullName.\`last\` AS fullName,
	uc.state AS accountStatus,
	IFMISSING(u.email, uc.email) AS email,
	CASE WHEN s.lastState IS NOT MISSING THEN 
		s.lastState.status
	ELSE
		'unknown'
	END AS status,
	(
		SELECT
		IFNULL(ARRAY_SORT(ARRAY_REMOVE(ARRAY_AGG(ai.disposition), "")), []) AS outcomes,
		count(*) AS calls
		FROM app ai
		WHERE ai.type = 'agent-interaction'
		AND ai.campaignId = "campaign::0a6be69a-470c-4a8a-ae68-623592486d5b"
		AND ai.environmentId = "environment::45a9fbf2-b565-4922-ad58-980aa677deae"
		AND ANY participant IN ai.participants SATISFIES participant.id = uc.userPk END
	) AS interactions,
	ARRAY_SUM(ARRAY_STAR(array st for st in 
				ARRAY_CONCAT(s.currentLoginSession.states, IFMISSING(s.loginSessions.states, [])) 
			WHEN st.campaign = "campaign::0a6be69a-470c-4a8a-ae68-623592486d5b" AND st.status = 'inreview'
			END).duration) AS inReviewTime,
	ARRAY_SUM(ARRAY_STAR(array st for st in 
				ARRAY_CONCAT(s.currentLoginSession.states, IFMISSING(s.loginSessions.states, [])) 
			WHEN st.campaign = "campaign::0a6be69a-470c-4a8a-ae68-623592486d5b" AND st.status = 'oncall'
			END).duration) AS onCallTime,
	ARRAY_SUM(ARRAY_STAR(array st for st in 
				ARRAY_CONCAT(s.currentLoginSession.states, IFMISSING(s.loginSessions.states, [])) 
			WHEN st.campaign = "campaign::0a6be69a-470c-4a8a-ae68-623592486d5b" AND st.status = 'inwrapup'
			END).duration) AS wrapUpTime
	FROM app uc 
	LEFT JOIN app u ON KEYS uc.userPk
	LEFT JOIN state s ON KEYS 'user-state::' || uc.userPk || '::' || "environment::45a9fbf2-b565-4922-ad58-980aa677deae"
	WHERE uc.type = 'user-credentials'
	AND ANY x IN uc.permissions SATISFIES 
		x.levelPk = "campaign::0a6be69a-470c-4a8a-ae68-623592486d5b"
		AND x.environmentPk = "environment::45a9fbf2-b565-4922-ad58-980aa677deae"
	END;




function getDispositionOptions(agents) {

	let dispositions, selectedDisposition;

	let optionNotEmpty = agents.find((el) => {
		return Object.keys(el.options).length > 0;
	});

	//Otherwise undefined is returned.
	if(!optionNotEmpty) {
		dispositions = [];
		selectedDisposition = {};
	}
	else {
		let doption = optionNotEmpty['options'];
		if(Object.keys(doption).length > 0) {
			dispositions = Object.keys(doption).map(x=> {
				return {
					name: x,
					value: x
				}
			});
		}

		 selectedDisposition = dispositions.find(x=> {
			return x.name === 'disconnected'
		});

		if(Object.keys(selectedDisposition).length === 0) {
			selectedDisposition = dispositions[0] || {};
		}
	}

	console.log('1111', JSON.stringify(dispositions), selectedDisposition);
}