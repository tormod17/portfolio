import React, { Component } from 'react';
import AddForm from './AddForm';
import EditForm from './EditForm';
import '../css/index.css';

const today = new Date().toISOString().slice(0, 10);

class Form extends Component {
  constructor(props){
    super(props)
    this.state = {
    };
    this.login = this.login.bind(this);
  }

  componentDidMount(){
    document.querySelector('html').style.overflow = 'hidden';
  }

  componentWillUnmount(){
    document.querySelector('html').style.overflow = 'scroll';
  }

  login(e) {
    e.preventDefault();
    const state = { ...this.state };
    const { id, closeForm } = this.props;

    const cleanState = Object.keys(state).reduce((p,c) => {
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
    const url = `/login`
    fetch( url, fetchData ).then((res) => {
      console.log(res.json())
      const e = new Event('posts')
      document.dispatchEvent(e);
      closeForm()
    })
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

  render() {
    const { closeForm } = this.props;
 
    return (
      <form className="" onSubmit={this.login}>
          <div className="form-group">
              <label htmlFor="email">Email address:</label>
              <input 
                name="email" 
                type="email" 
                className="form-control"
                id="email"
                onChange={this.updateFieldValue}
              />
          </div>
          <div className="form-group">
              <label htmlFor="pwd">Password:</label>
              <input 
                name="password"
                type="password"
                className="form-control" 
                id="pwd"
                onChange={this.updateFieldValue}
              />
          </div>
          <button type="submit" className="btn btn-success" id="button">Admn Login</button>
      </form>
    );
  }
}

export default Form;
