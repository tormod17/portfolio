import React, { Component } from 'react';
import TextEditor from './TextEditor';

const today = new Date().toISOString().slice(0, 10)

class AddForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      numberOfInputs: 1,
      today,
    };
    this.addPost = this.addPost.bind(this);
  }

  addPost(e){
    e.preventDefault();
    const url = '/redis/addPost';
    const fetchData = {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: new Headers,
    }
    fetch(url, fetchData).then(() => {
      const e = new Event('posts')
      document.dispatchEvent(e);
      this.props.closeForm()
    })
  }

  handleEditorChange = (e, name) => {
    this.setState(prevState=> ({
      ...prevState,
      [name]: e.target.getContent(),
    }))
  }

  updateFieldValue = e => {
    e.stopPropagation();
    const val = e.target.value;
    const name = e.target.getAttribute('name');
    this.setState(prevState=> ({
      ...prevState,
      [name]: val,
    }))
  }

  render(){
    const { title } = this.state;
    const { closeForm, editingPost } = this.props;

    return (
        <form className="form-horizontal" onSubmit={this.addPost}>   
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input 
              type="text"
              className="form-control" 
              name="title"
              onChange={this.updateFieldValue}
              value={title}
              required
            />
          </div>
          <div className="form-group">
            <TextEditor
              handleChange={e => this.handleEditorChange(e,'editor')}
            />
          </div>
          <div className="form-group"> 
            <div className="buttonPair">       
              <button 
                  type="submit"
                  className="btn btn-primary btn-small"
                >
                  Submit
              </button>
            </div>
          </div>
        </form>
    )
  }
}

export default AddForm;