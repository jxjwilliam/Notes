
-- select meta().id from state
-- select *  from state order by createDate desc


MERGE INTO state s
  USING (SELECT NULL) AS b ON KEY "user-state::user::0afb03a8-58d8-48a4-ac19-6f68b1f36992::environment::45a9fbf2-b565-4922-ad58-980aa677deae"
  WHEN MATCHED THEN
UPDATE 
  SET s.currentLoginSession.startTime = NOW_MILLIS(),
	s.currentLoginSession.loginSessionId = "727b69d0-e4ab-11e6-9f59-03826a2466a6"


-- localStorage:

UPDATE default
  SET i.subitems = ( ARRAY OBJECT_ADD(s, 'new', 'new_value' )
    FOR s IN i.subitems END ) 
      FOR s IN ARRAY_FLATTEN(ARRAY i.subitems 
        FOR i IN items END, 1) END;


select u.*, uc.email from app uc 
left join app u on keys uc.userPk
left join state s on keys 'user-state::' || meta(u).id || '::environment::45a9fbf2-b565-4922-ad58-980aa677deae'
where any p in uc.permissions satisfies p.environmentPk = 'environment::45a9fbf2-b565-4922-ad58-980aa677deae' end
and uc.userPk in ['user::0afb03a8-58d8-48a4-ac19-6f68b1f36992']

select * from app uc 
where any p in uc.permissions satisfies p.environmentPk = 'environment::45a9fbf2-b565-4922-ad58-980aa677deae' end
and uc.userPk in ['user::0afb03a8-58d8-48a4-ac19-6f68b1f36992']

select * from app uc 
where any p in uc.permissions satisfies p.environmentPk = 'environment::45a9fbf2-b565-4922-ad58-980aa677deae' end

select * from app where type = 'user-credentials' limit 1


SELECT 
    u.fullName.\`first` AS \`first\`, 
    u.fullName.\`last` AS \`last\`, 
    uc.email
    FROM app uc USE KEYS 'user-credentials::wiliam@overpass.com'
    LEFT JOIN app u ON KEYS uc.userPk
    LEFT JOIN state s ON KEYS "user-state::" || meta(u).id || "::environment::45a9fbf2-b565-4922-ad58-980aa677deae"

 SELECT uc.*,
    u.fullName.\`first` AS \`first\`, 
    u.fullName.\`last` AS \`last\`, 
    uc.email
    FROM app uc USE KEYS 'user-credentials::wiliam@overpass.com'
    LEFT JOIN app u ON KEYS uc.userPk
    LEFT JOIN state s ON KEYS "user-state::" || meta(u).id || "::environment::45a9fbf2-b565-4922-ad58-980aa677deae"
    
SELECT 
    u.fullName.\`first` AS \`first\`, 
    u.fullName.\`last` AS \`last\`, 
    u.email,
    s.*
    FROM app u USE KEYS [
        'user::0afb03a8-58d8-48a4-ac19-6f68b1f36992',
        "user::56354979-7de5-4318-bdc0-c7f310c618a3", 
        "user::bac2271b-5002-4863-b36e-6edfffac9ab2", 
        "user::f639e918-9917-484b-b932-3290138c4c24"
    ]
    LEFT JOIN state s ON KEYS "user-state::" || meta(u).id || "::environment::45a9fbf2-b565-4922-ad58-980aa677deae"

  
SELECT
uc.userPk AS userId,
u.fullName.`first` || ' ' || u.fullName.`last` AS fullName,
IFMISSING(u.email, uc.email) AS email,
u.isActive,
IFMISSING(s.lastKnownStatus, 'UNAVAILABLE') AS status,
s.currentLoginSession AS currentSession,
s.loginSessions AS loginSessions,
(
    SELECT
    ARRAY_SORT(ARRAY_REMOVE(ARRAY_AGG(ai.disposition), "")) AS outcomes,
    count(*) AS calls
    FROM app ai
    WHERE ai.type = 'agent-interaction'
    AND ai.campaignId = 'campaign::0a6be69a-470c-4a8a-ae68-623592486d5b'
    AND ai.environmentId = 'environment::45a9fbf2-b565-4922-ad58-980aa677deae'
    AND ANY participant IN ai.participants SATISFIES participant.id = uc.userPk END
) AS interactions
FROM app uc 
LEFT JOIN app u ON KEYS uc.userPk
LEFT JOIN state s ON KEYS 'user-state::' || uc.userPk || '::environment::45a9fbf2-b565-4922-ad58-980aa677deae'
WHERE uc.type = 'user-credentials'
AND ANY x IN uc.permissions SATISFIES 
    x.levelPk = 'campaign::0a6be69a-470c-4a8a-ae68-623592486d5b'  
    AND x.environmentPk = 'environment::45a9fbf2-b565-4922-ad58-980aa677deae'
    AND x.`role` = 'agent'
END;    



select dispositions from app where type = 'campaign' and primaryKey = 'campaign::bec4f003-d16d-45b1-bb47-37f7f267a6c9'
[
  {
    "dispositions": [
      "Sale Closed",
      "Not Interested",
      "Follow Up",
      "Do Not Call Registry",
      "Appointment Set",
      "Left Voicemail",
      "Busy",
      "No Answer",
      "Requires Supervisor",
      "Fax / Data / Modem Line",
      "Incorrect Number",
      "Disconnected Number",
      "Left Live Message",
      "Qualified",
      "Pledged",
      "Donated"
    ]
  }
]
SELECT
   ARRAY_SORT(ARRAY_REMOVE(ARRAY_AGG(lower(ai.disposition)), "")) AS outcomes,
    count(*) AS calls
    FROM app ai
    WHERE ai.type = 'agent-interaction'
    AND ai.campaignId = 'campaign::a59c6fdf-9c37-4864-b98d-6baf7466a231'
    AND ai.environmentId = 'environment::8ebc97a7-f1d6-4b2d-a2b7-adac3d0b483a'
    AND ANY participant IN ai.participants SATISFIES participant.id = 'user::ed8d37c6-b7c7-4bb1-a808-f684924fa51b' END