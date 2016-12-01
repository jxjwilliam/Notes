// actions
export const setVisibilityFilter = (filter) => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})


// components

const App = () => (
	<div>
		<AddTodo />
		<VisibleTodoList />
		<Footer />
	<\/div>
);


const Footer = () => (
	<p>
		<FilterLink filter="SHOW_ALL">All<\/FilterLink>
		<FilterLink filter="SHOW_ACTIVE">Active<\/FilterLink>
		<FilterLink filter="SHOW_COMPLETED">Completed<\/FilterLink>
	<\/p>
);

const Link = ({ active, children, onClick }) => {
	if (active) {
		return <span>{children}<\/span>
	}

  return (
    <a href="#" onClick={e => {e.preventDefault(); onClick(); }}>
    	{children}
    <\/a>
  )
}

// containers

const mapStateToProps = (state, props) => ({
	active: props.filter === state.visibilityFilter
})

const mapDispatchToProps = (dispatch, props) => ({
	onClick: () => {
		dispatch(setVisibilityFilter(props.filter))
	}
})

const FilterLink = connect(mapStateToProps, mapDispatchToProps)(Link);

// reducers

export default const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}
