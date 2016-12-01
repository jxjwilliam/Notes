class CommentList extends Component {
	constructor(props) {
		super(props);
		this.state = { comments: [] }
	}

	componentDidMount() {
		$.ajax({
			url: '',
			success: function(comments) {
				this.setState({comments: comments});
			}.bind(this)
		});
	}

	render() {
		return <ul> {this.state.comments.map(renderComment)} <\/ul>;
	}

	renderComment({body, author}) {
 	   return <li>{body}—{author}<\/li>;
	}
}


class CommentListContainer extends React.Component {
  constructor() {
    super();
    this.state = { comments: [] }
  }

  componentDidMount() {
    $.ajax({
      url: "/my-comments.json",
      dataType: 'json',
      success: function(comments) {
        this.setState({comments: comments});
      }.bind(this)
    });
  }

  render() {
    return <CommentList comments={this.state.comments} \/>;
  }
}


class UsersView extends React.Component {
  render() {
    const {users, UserLink} = this.props

    return (
      <ul>
        {users.map(user => (
          <UserLink key={user.id} user={user}>
            <li>{user.name}</li>
          </UserLink>
        ))}
      <\/ul>
    ) 
  }
}

const AdminUserLink = ({user, children}) => <Link to={`/admin/users/${user.id}`}>{children}</Link>
const AdminUserList = <UsersView UserLink={AdminUserLink} />

const UserProfileLink = ({user, children}) => <Link to={`/users/${user.id}`}>{children}</Link>
const UserProfileList = <UsersView UserLink={UserProfileLink} />


