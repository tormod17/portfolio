import React, { PureComponent } from 'react';
import Trumbowyg from 'react-trumbowyg';
import TextEditor from './TextEditor';
import '../css/index.css';

class EditForm extends PureComponent {
  constructor(props){
    super(props)
    const { post } = props;
    this.state = {
      ...post
    };
    this.editPost = this.editPost.bind(this);
  }

  updateFieldValue = e => {
    e.stopPropagation();
    const val = e.target.value
    const name = e.target.getAttribute('name');
    this.setState(prevState=> ({
      ...prevState,
      [name]: val,
    }))
  }

  handleEditorChange = e => {
    this.setState(prevState=> ({
      ...prevState,
      editor: e.target.getContent(),
    }))
  }

  editPost = (e) => {
    e.preventDefault();
    const state = { ...this.state };
    const { id, closeForm } = this.props;

    const cleanState = Object.keys(this.state).reduce((p,c) => {
      if (state[c] !== '') {
        p[c] = state[c];
      }
      return p;
    }, {})
    const fetchData = {
      method: 'POST',
      body: JSON.stringify(cleanState),
      headers: new Headers,
    }
    const url = `/redis/update?hash=${id}`
    fetch( url, fetchData ).then(() => {
      const e = new Event('posts')
      document.dispatchEvent(e);
      closeForm()
    })
  }

  render(){
    const { title, editor } = this.state;
    return (
       <form className="form-horizontal" onSubmit={this.editPost}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
              <input 
                type="text"
                className="form-control" 
                name="title"
                onChange={this.updateFieldValue}
                value={title}
              />
          </div>
          <div className="form-group">        
            <TextEditor
              name="editor" 
              data={editor}
              handleChange={this.handleEditorChange}
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

export default EditForm;
