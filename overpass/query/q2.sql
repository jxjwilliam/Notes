select 
meta(u).id as userId,
u.fullName.`first` || ' ' || u.fullName.`last` as fullName,
IFMISSING(u.email, null) as email,
u.isActive,
IFMISSING(s.lastKnownStatus, 'UNAVAILABLE') as status,
s.currentLoginSession as currentSession,
s.loginSessions as loginSessions,
(
    select 
    array_sort(array_remove(array_agg(ai.disposition), "")) as outcomes,
    count(*) as calls
    from app ai
    where ai.type = 'agent-interaction'
    and ai.campaignId = 'campaign::5e0e1f8e-4727-4fec-b134-c75e09c16550'
    and ai.environmentId = 'environment::7dd3d3b0-fc87-4277-a62a-a3a1858cf992'
    and ANY participant IN ai.participants SATISFIES participant.id = meta(u).id END
) as interactions
from app u use keys ['user::eee69127-3954-4d9a-8a8d-83d626fb476b']
left join state s on keys 'user-state::' || meta(u).id || '::environment::7dd3d3b0-fc87-4277-a62a-a3a1858cf992';



select * from app where email = 'bpop@mailinator.com'

select * from state where userId = 'user::0afb03a8-58d8-48a4-ac19-6f68b1f36992'




// http://localhost:9000/#/dashboard/
//environment::45a9fbf2-b565-4922-ad58-980aa677deae
//campaign-monitor/campaign::0a6be69a-470c-4a8a-ae68-623592486d5b

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

