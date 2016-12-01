class MyComponent extends Component {
	getInitialState() {
		const oThis = this;

		$.get({	
			url: 'api...',
			success: function (...) {
				oThis.setState({...data returned by server});
			}
		});
		return {};
	}

	render() {
	    if (this.props.loading) {
	      return <div>Loading...<\/div>
	    }
	    return ...;
	}
}

const FriendListReducer = (state={}, action) => {
	// initialize your default state properties

	switch(action.type) {
		case ADD_TODO:
			return {
				...state,
				todo(undefined, action)
			}
		default:
			return state;
	}
}

const rootReduer = combineReducers({
	friends: FriendListReducer
});


// webpack
import $ from 'jquery';
import 'jquery-ui';

import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/themes/base/selectable.css';
import 'jquery-ui/ui/core';
import 'jquery-ui/ui/widgets/selectable';