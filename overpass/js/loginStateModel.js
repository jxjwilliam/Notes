import State from 'ampersand-state';
import Collection  from 'ampersand-collection';
import GenericModel from '../genericModel';

const StateModel = State.extend({
	props: {
		timestamp: {
			type: 'date',
			required: true
		},
		status: {
			type: 'string',
			required: true
		}
	}
});

const StateCollection = Collection.extend({
	model: StateModel
})

const SessionModel = State.extend({
	props: {
		sessionId: {
			type: 'string',
			required: true
		},
		startTime: {
			type: 'date',
			required: true
		},
		endTime: {
			type: 'date',
			required: true
		}
	},
	collections: {
		states: StateCollection
	}
});

const SessionCollection = Collection.extend({
	model: SessionModel
});

const UserStates = GenericModel.extend({
	config: {
		type: 'user-state',
		version: '0.1.2'
	},
	props: {
		userId: {
			type: 'string',
			required: true
		},
		lastKnownStatus: {
			type: 'string',
			required: true,
			default: false
		}
	},
	collections: {
		sessions: SessionCollection
	}
});

export default UserStates;

