import React, { PureComponent } from 'react';
import '../css/index.css';

class Header extends PureComponent {
  render() {
    return (
      <div className="Header">
        <div className="">
          <div className="page-header">
            <h1>CODING BLOG</h1> 
              <a href="/" className="goBack">
                <button 
                  type="button"
                  className="btn btn-default"
                >
                  Go Back
                </button>     
              </a>
          </div>   
          <p>This blog is a meta React project </p>
        </div>
      </div>
    );
  }
}

export default Header;
