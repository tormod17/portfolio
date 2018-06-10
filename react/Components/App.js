import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import logo from '../logo.svg';
import '../css/App.css';
import Header from './Header';
import Menu from './Menu';
import Posts from './Posts';
import Form from './Form';
import LoginForm from './LoginForm';

class App extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      showHideForm: false,
      login: false,
    };
    this.isAdmin = window.location.href.includes('editing');
    this.showHideLoginForm = this.showHideLoginForm.bind(this);
    this.showHideForm = this.showHideForm.bind(this);
    this.getAllPosts = this.getAllPosts.bind(this);
    this.editForm = this.editForm.bind(this);
  }

  componentWillMount() {    
    this.getAllPosts();
  }

  componentDidMount() {
    document.addEventListener('posts', this.getAllPosts);
  }

  getAllPosts() {
    fetch('/redis/posts')
    .then(res => { 
      return res.json();
    })
    .then(json => {
      const posts = { ...json };
      this.setState({
        posts
      });
    });
  }

  showHideLoginForm(){
    this.setState({
       login: !this.state.login,
       showHideForm: !this.state.showHideForm,
       editingId: ''
    });
  }

  editForm(key) {
    this.showHideForm();
    this.setState({
      editingId: key,
    });
  }

  showHideForm() {
    this.setState({
      showHideForm: !this.state.showHideForm,
      login: false,
      editingId: ''
    });
  }
  
  render() {
    const { showHideForm, posts, editingId, login } = this.state;
    
    return (
      <div 
        className="App pageWrapper"
        ref={(div)=> this.App = div}
      >
        <Header 
          showHideLoginForm={this.showHideLoginForm} 
        />
        <div className="row">
          <div className="col-xs-6 col-sm-10 center">
            <div className="">
              <h3>Posts</h3>
            </div>
          </div>
          <div className="col-xs-6 col-sm-2 sideWrapper">
            <div className="info aside section">
            { this.isAdmin &&
              <button 
                type="button"
                className="btn btn-success"
                onClick={this.showHideForm}
              >
                Add post
              </button>
            }
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-10 postsWrapper">
            <Posts
              posts={posts}
              editForm={this.editForm}
            />
          </div>
          <div className="col-sm-2 sideWrapper">
              <Menu 
                posts={posts}
              />
            </div>
        </div>  
        { showHideForm &&
          <CSSTransitionGroup
            transitionName="formTrans"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnter={false}
            transitionLeave={false}
          >
            <Form 
              closeForm={this.showHideForm}
              editingPost={posts && !login && posts[editingId] }
              editingId={editingId}
              login={login}
            />
          </CSSTransitionGroup>
        }
      </div>
    );
  }
}

export default App;
