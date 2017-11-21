import React, { PureComponent } from 'react';
import '../css/index.css';

class Post extends PureComponent {
  constructor(props){
    super(props)
    this.isAdmin = window.location.href.includes('editing1234');
  }

  deletePost = key => {
    const url = `/redis/delete?hash=${key}`
    fetch(url).then(res => {
      const e = new Event('posts')
      document.dispatchEvent(e);
    })
  }

  editPost = key => {
    this.props.editForm(key);
  }

  getNewOrderWithExtraFields = item => {
    const newOrder = ['title'];
    const itemFields = Object.keys(item);
    const items = itemFields.filter(field => field.match(/\d+/));
    items.sort((a,b) => a.slice(-1) - b.slice(-1))
    return ['title', ...items ]
  }

  formatTextArea = text => {
   const createMarkup = () => ({__html: text})
    return <div dangerouslySetInnerHTML={createMarkup()} />
  }

  renderText = item => {
    const newOrder = ['title','editor'];
    return newOrder.map(key => { 
      let content ;
      switch (true) {
        case key === 'title':
          content = <div><h4>{`${item[key].toUpperCase()}`}</h4><p>{`${item.today}`}</p></div>
          break;
        case key.includes('editor'):
          content = this.formatTextArea(item[key]);
          break;
      }
      return (
        <div key={key} className="list-group-item">
          {content}
        </div>
      )
   })
  }

  render () {
    const { item, id } = this.props;
    return (
      <li 
        id={id}
        className="list-group-item"
      >
      <div>
        {this.renderText(item)}
      </div>
        { this.isAdmin &&
          <div className="buttonPair">     
              <button 
                type="button"
                className="btn btn-danger btn-xs"
                onClick={() => this.deletePost(id)}
              >
                delete
              </button>
              <button 
                type="button"
                className="btn btn-default btn-xs"
                onClick={() => this.editPost(id)}
              >
                edit
              </button>
          </div>
        }
      </li>
    );
  }
}

export default Post;