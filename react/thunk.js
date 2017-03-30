// 1. Action Creator
// returns a function and will be called in the Redux-Thunk middleware

function loadReposAction() {
	return function(dispatch, getState) {
		var state = getState();
		var url = "https://api.github.com/users/" + state.user + "/repos";

		dispatch(loadingChangedAction(true));

		return fetch(url)
		.then(function(result) {
	        dispatch(loadingChangedAction(false));

	        if (result.status === 200) {
	          return result.json();
	        }

	        throw "request failed";
		})
		.then(function(jsonResule) {
			dispatch(addReposAction(jsonResult));
		})
		.catch(function(err) {
	        sweetAlert("Oops...", "Couldn't fetch repos for user: " + state.user, "error");
		})
	}
}

function loadReposAction2(store) {
	var state = store.getState();
	var url = "https://api.github.com/users/" + state.user + "/repos";

	dispatch(loadingChangedAction(true));

}


// 2. Reducer
function initialState() {
	return {
		user: "",
		repos: [],
		isLoading: false
	}
}

function rootReducer(state=initialState, action) {}