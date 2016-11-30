import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index'

const store = createStore(
	rootReducer,
	applyMiddleware(thunk)
);



// actions.js:
export function fetchTodos() {
 // Instead of plain objects, we are returning function.
  return function(dispatch) {
    // Dispatching REQUEST action, which tells our app, that we are started requesting todos.
    dispatch({
      type: 'FETCH_TODOS_REQUEST'
    });

    return fetch('/api/todos')
      // Here, we are getting json body(in our case it will contain `todos` or `error` prop, depending on request was failed or not) from server response
      // And providing `response` and `body` variables to the next chain.
      .then(response => response.json().then(body => ({ response, body })))
      .then(({ response, body }) => {
        if (!response.ok) {
          // If request was failed, dispatching FAILURE action.
          dispatch({
            type: 'FETCH_TODOS_FAILURE',
            error: body.error
          });
        } else {
          // When everything is ok, dispatching SUCCESS action.
          dispatch({
            type: 'FETCH_TODOS_SUCCESS',
            todos: body.todos
          });
        }
      });
  }
}

////////////////////////////////////////////////

// TodosContainer.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchTodos } from '../actions';

class TodosContainer extends Component {
  componentDidMount() {
    // When container was mounted, we need to start fetching todos.
    this.props.fetchTodos();
  }

  render() {
    // In some simple cases, it is not necessary to create separate `Todos` component. You can put todos markup directly here.
    return <Todos items={this.props.todos} \/>
  }
}

// This function is used to convert redux global state to desired props.
function mapStateToProps(state) {
  // `state` variable contains whole redux state.
  return {
    // I assume, you have `todos` state variable.
    // Todos will be available in container component as `this.props.todos`
    todos: state.todos
  };
}

// This function is used to provide callbacks to container component.
function mapDispatchToProps(dispatch) {
  return {
    // This function will be available in component as `this.props.fetchTodos`
    fetchTodos: function() {
      dispatch(fetchTodos());
    }
  };
}

// We are using `connect` function to wrap our component with special component, which will provide to container all needed data.
export default connect(mapStateToProps, mapDispatchToProps)(TodosContainer);

///////////////////////////////////////////////////

import fetch from 'isomorphic-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
function requestPosts(subreddit) {
  return {
    type: REQUEST_POSTS,
    subreddit
  }
}

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
function receivePosts(subreddit, json) {
  return {
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

// Meet our first thunk action creator!
// Though its insides are different, you would use it just like any other action creator:
// store.dispatch(fetchPosts('reactjs'))

export function fetchPosts(subreddit) {

  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return function (dispatch) {

    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestPosts(subreddit))

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch(`http://www.reddit.com/r/${subreddit}.json`)
      .then(response => response.json())
      .then(json =>

        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(receivePosts(subreddit, json))
      )

      // In a real world app, you also want to
      // catch any error in the network call.
  }
}


store.dispatch().then(() => {
  render() {
    return <p>{this.props.strs.join(', ')}<\/p>
  }
});


<TodoList todos={todos} {...boundActionCreators} \/>


const store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk),
    DevTools.instrument()
  )
)

export function deletePost(cuid) {
  return {
    type: DELETE_POST,
    cuid
  };
}

export function deletePost(cuid) {
  return (dispatch) => {
    return callApi(`posts/${cuid}`, 'delete').then(() => dispatch(deletePost(cuid)));
  }
}