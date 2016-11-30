getState()
dispatch(action)
subscribe(listener)
replaceReducer(nextReducer)

export default combineReducers({
	todos,
	counter,
	reducer1,
	reducer2
})

import { createStore } from 'redux'
let store = createStore(
	reducer,
	actionCreators,
	applyMiddleware(logger,thunk)
)

function addTodo(state=[], action) {
	switch(action.type) {
		case 'ADD_TODO':
			return state.concat([ action.text])
		default:
			return state;
	}
}

store.dispatch({
	type: 'ADD_TODO', 
	text: 'text 1'
});

store.dispatch({
	type: 'ADD_TODO', 
	text: 'middleware'
});

function withdrawMoney(amount) {
	return {
		type: 'WITHDRAW',
		amount
	}
}
store.dispatch(withdrawMoney(100))


bindActionCreators(actionCreators, dispatch);


export class App extends Component {
	constructor(props) {
		super(props)
		this.state = initialState();
	}
}


export function fetchPost(cuid) {
	return (dispatch) => {
		return callApi(`posts/${cuid}`).then(res => dispatch(addPost(res.post)))
	};
}

export function fetchPosts() {
	return (dispatch) => {
		return callApi('posts').then(res => dispatch(addPosts(res.posts)));
	}
}


// PostListPage.js
import ...

function mapStateToProps (state, props) {
	return {
		post: getPost(state, props.params.cuid)
	}

}
export function PostDetailPage(props) {
	return (
		<div>
			<>
		<\/div>
	)
}

export default connect(mapStateToProps)(PostDetailPage);


//////////////////////////////////////////

function mapStateToProps (state) {
	return {
		showAddPost: getShowAddPost(state),
		posts: getPosts(state)
	}
}

class PostListPage extends Component {
	constructor() {
		super();
	}
	ComponentDidMount() {
		this.props.dispatch(fetchPosts);
	}
	handleDeletePost = post => {
		this.props.dispatch(deletePostRequest(post));
	}
	handleAddPost = (name, title, content) => {
		this.props.dispatch(toggleAddPost());
		this.props.dispatch(addPostRequest({ name, title, content }))
	}
	render() {
		return (
			<div>
			    <PostCreateWidget addPost={this.handleAddPost} showAddPost={this.props.showAddPost} />
        		<PostList handleDeletePost={this.handleDeletePost} posts={this.props.posts} />
			<\/div>
		);
	}
}


export default connect(mapStateToProps)(PostListPage);


import styles from '...css';


const getPosts = state => state.posts.data;
const getPost = (state, cuid) => state.posts.data.filter(post=> post.cuid === cuid)[0];


<PostCreateWidget 
	addPost={this.handleAddPost}
	showAddPost={this.props.showAddPost}
\/>

<PostList 
	handleDeletePost={this.handleDeletePost}
	posts={this.props.posts}
\/>

<input
	className={styles.input}
	{...input}
	type="text"
	onClick={
		e => input.onClick(this._handleBlur(e))
	}
	onBlur={() => {
		this._onBlur();
		input.onBlur();
	}}
\/>


<Field component={renderField} props={{ disabled: true }} />

connect(mapStateToProps, {pushState})(GroupsContainer)



export function fetchMapData(address) {
	return function(dispatch) {
		return fetch(address)
		.then(fetchUtil.checkHttpStatus) //check if 404
        .then(fetchUtil.parseJSON)
        .then(mapData => dispatch(fetchDataSucceed(mapData)))
        .catch(error => dispatch(fetchDataFailed(error)));
	}
}
