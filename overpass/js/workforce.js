
	// TODO: deprecated, will remove
	/* istanbul ignore next */
	getAgentsByCredentials(levelPk, environmentPk, level = null, role = 'agent') {

		console.info('CHAIM::UserCredentialsCrud::getAgentsByCredentials:', levelPk, environmentPk, level, role);

		let query = `SELECT
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
						AND ai.campaignId = $2
						AND ai.environmentId = $1
						AND ANY participant IN ai.participants SATISFIES participant.id = uc.userPk END
					) AS interactions,
					ARRAY_SUM(ARRAY_STAR(array st for st in 
								ARRAY_CONCAT(s.currentLoginSession.states, IFMISSING(s.loginSessions.states, [])) 
							WHEN st.campaign = $2 AND st.status = 'inreview'
							END).duration) AS inReviewTime,
					ARRAY_SUM(ARRAY_STAR(array st for st in 
								ARRAY_CONCAT(s.currentLoginSession.states, IFMISSING(s.loginSessions.states, [])) 
							WHEN st.campaign = $2 AND st.status = 'oncall'
							END).duration) AS onCallTime,
					ARRAY_SUM(ARRAY_STAR(array st for st in 
								ARRAY_CONCAT(s.currentLoginSession.states, IFMISSING(s.loginSessions.states, [])) 
							WHEN st.campaign = $2 AND st.status = 'inwrapup'
							END).duration) AS wrapUpTime
					FROM app uc 
					LEFT JOIN app u ON KEYS uc.userPk
					LEFT JOIN state s ON KEYS 'user-state::' || uc.userPk || '::' || $1
					WHERE uc.type = 'user-credentials'
					AND ANY x IN uc.permissions SATISFIES 
						x.levelPk = $2
						AND x.environmentPk = $1
					END;`;

		return this.connect().then(() => {
			return super.getByQuery(query, [environmentPk, levelPk]).then(res => {

				return this.convertAgentsData(res);
			});
		});
	}

	/* istanbul ignore next */
	/**
	 * input: "outcomes": [
	 *    "busy",
	 *    "sale closed",
	 *    "sale closed"
	 *  ]
	 *  output: {'sale closed': 2, busy: 1 }
	 */
	processOutcomes(outcomes) {
		let obj = {};
		if (outcomes && Array.isArray(outcomes)) {
			outcomes.forEach((x, i) => {
				let propName = x;
				if (obj.hasOwnProperty(propName)) {
					obj[propName] += 1;
				} else {
					obj[propName] = 1;
				}
			});
		}
		return obj;
	}

	/* istanbul ignore next */
	convertAgentsData(response_agents) {
		var agentlist = [];

		if (response_agents && Array.isArray(response_agents)) {
			response_agents.forEach(ra => {
				if (/pending/i.test(ra.accountStatus)) {
					agentlist.push({
						"userId": ra.userId,
						"isActive": false,
						"fullName": ra.email,
						"email": ra.email,
						"phoneNo": ra.phoneNumber || 'N/A',
						"status": "Invited",
						"calls": 0,
						"options": {},
						"inReviewTime": 0,
						"onCallTime": 0,
						"wrapUpTime": 0
					});
				}
				else {
					let interaction = ra.interactions ? ra.interactions[0] : {};
					let outcomes = interaction.outcomes || [];
					let isactive = ra.accountStatus === 'active';
					agentlist.push({
						"userId": ra.userId,
						"isActive": isactive,
						"fullName": ra.fullName,
						"email": ra.email,
						"phoneNo": ra.phoneNumber || '',
						"status": ra.status,
						"calls": interaction.calls || 0,
						"options": this.processOutcomes(outcomes),
						"inReviewTime": ra.inReviewTime || 0,
						"onCallTime": ra.onCallTime || 0,
						"wrapUpTime": ra.wrapUpTime || 0
					})
				}

				agentlist.push();
			});

			// sorting:
			let isActive = agentlist.filter(x => {
				return x.isActive === true;
			});
			let away = agentlist.filter(x => {
				return x.isActive === false && /away/i.test(x.status);
			});
			let offline = agentlist.filter(x => {
				return x.isActive === false && /offline/i.test(x.status);
			});
			let rests = agentlist.filter(x => {
				return x.isActive == false && ! /(away|offline)/i.test(x.status);
			});

			agentlist = isActive.concat(away, offline, rests);
		}

		return agentlist;
	}