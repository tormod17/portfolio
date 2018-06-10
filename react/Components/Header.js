import React, { PureComponent } from 'react';
import '../css/index.css';

class Header extends PureComponent {
  
  constructor(props){
    super(props)
  }

  render() {
    return (
      <div className="Header">
        <div className="">
          <div className="page-header">
            <h1>CODING BLOG</h1> 
             <div className="header__buttons">
              <a href="/" className="">
                <button 
                  type="button"
                  className="btn btn-default"
                >
                  Go Back
                </button>     
              </a>
        
                <button 
                  type="button"
                  className="btn btn-default"
                  onClick={this.props.showHideLoginForm}
                >
                  edit
                </button>     
            </div>
          </div>   
          <p>This blog is a meta React project </p>
        </div>
      </div>
    );
  }
}

export default Header;
