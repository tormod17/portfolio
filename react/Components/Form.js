import React, { Component } from 'react';
import AddForm from './AddForm';
import EditForm from './EditForm';
import LoginForm from './LoginForm';

import '../css/index.css';

const today = new Date().toISOString().slice(0, 10);

class Form extends Component {
  constructor(props){
    super(props)
    this.state = {
      numberOfInputs: 1,
      today,
    };
  }

  componentDidMount(){
    const { editingPost } = this.props;
    if (editingPost) {
      this.setState({
        ...editingPost,
      })
    }
    document.querySelector('html').style.overflow = 'hidden';
  }

  componentWillUnmount(){
    document.querySelector('html').style.overflow = 'scroll';
  }

  render() {
    const { closeForm, editingPost, editingId, login } = this.props;
 
    return (
      <div 
        className="Form"
      >
        <div onClick={closeForm}  className="overlay"/>
        <div className="container centerPage">
          <div className="page-header">
            <h3>
              Create your blog post.
            </h3>
            <p>
              {today}
            </p>
          </div>
          <div 
            className="closeButton"
            onClick={closeForm}  
          >
            <span className="">
              X
            </span>
          </div>
          <div className="form-wrapper">
            {editingPost && 
              <EditForm
                closeForm={closeForm}
                post={editingPost}
                id={editingId}
              />

            }
            {!editingPost && !login &&
              <AddForm 
                closeForm={closeForm}
              />
            }
            { login &&
              <LoginForm
                closeForm={closeForm}              
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Form;
