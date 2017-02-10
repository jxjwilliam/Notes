UPDATE state s 
USE KEYS "state::test"
SET s.currentLoginSession.states = ARRAY_INSERT(s.currentLoginSession.states, ARRAY_LENGTH(s.currentLoginSession.states),
        {
            "startTime":s.lastState.startTime, 
            "endTime":NOW_MILLIS(), 
            "state":s.lastState.state, 
            "campaign":s.lastState.campaign, 
            "duration": DATE_DIFF_MILLIS(NOW_MILLIS(), s.lastState.startTime, 'millisecond')
        }
    ),
    s.lastState = {"startTime":NOW_MILLIS(), "endTime":null, "state":"inreview", "campaign":"campaign::123456", "duration":null},
    s.lastKnowStatus = "inreview"
RETURNING *

UPDATE state s 
USE KEYS "state::test"
SET s.currentLoginSession.states = ARRAY_INSERT(s.currentLoginSession.states, ARRAY_LENGTH(s.currentLoginSession.states),
        {
            "startTime":s.lastState.startTime, 
            "endTime":NOW_MILLIS(), 
            "state":s.lastState.state, 
            "campaign":s.lastState.campaign, 
            "duration": DATE_DIFF_MILLIS(NOW_MILLIS(), s.lastState.startTime, 'millisecond')
        }
    ),
    s.lastState = {"startTime":NOW_MILLIS(), "endTime":null, "state":"oncall", "campaign":"campaign::123456", "duration":null},
    s.lastKnowStatus = "oncall"
RETURNING *

UPDATE state s 
USE KEYS "state::test"
SET s.currentLoginSession.states = ARRAY_INSERT(s.currentLoginSession.states, ARRAY_LENGTH(s.currentLoginSession.states),
        {
            "startTime":s.lastState.startTime, 
            "endTime":NOW_MILLIS(), 
            "state":s.lastState.state, 
            "campaign":s.lastState.campaign, 
            "duration": DATE_DIFF_MILLIS(NOW_MILLIS(), s.lastState.startTime, 'millisecond')
        }
    ),
    s.lastState = {"startTime":NOW_MILLIS(), "endTime":null, "state":"onwrapup", "campaign":"campaign::123456", "duration":null},
    s.lastKnowStatus = "onwrapup"
RETURNING *

UPDATE state s 
USE KEYS "state::test"
SET s.currentLoginSession.states = ARRAY_INSERT(s.currentLoginSession.states, ARRAY_LENGTH(s.currentLoginSession.states),
        {
            "startTime":s.lastState.startTime, 
            "endTime":NOW_MILLIS(), 
            "state":s.lastState.state, 
            "campaign":s.lastState.campaign, 
            "duration": DATE_DIFF_MILLIS(NOW_MILLIS(), s.lastState.startTime, 'millisecond')
        }
    ),
    s.lastState = {"startTime":NOW_MILLIS(), "endTime":null, "state":"onbreak", "campaign":null, "duration":null},
    s.lastKnowStatus = "onbreak"
RETURNING *

UPDATE state s 
USE KEYS "state::test"
SET s.currentLoginSession.states = ARRAY_INSERT(s.currentLoginSession.states, ARRAY_LENGTH(s.currentLoginSession.states),
        {
            "startTime":s.lastState.startTime, 
            "endTime":NOW_MILLIS(), 
            "state":s.lastState.state, 
            "campaign":s.lastState.campaign, 
            "duration": DATE_DIFF_MILLIS(NOW_MILLIS(), s.lastState.startTime, 'millisecond')
        }
    ),
    s.lastState = {"startTime":NOW_MILLIS(), "endTime":null, "state":"online", "campaign":null, "duration":null},
    s.lastKnowStatus = "online"
RETURNING *