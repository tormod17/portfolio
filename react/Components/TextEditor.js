import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Trumbowyg from 'react-trumbowyg';
// Import TinyMCE
import { Editor } from '@tinymce/tinymce-react';

import '../../node_modules/trumbowyg/dist/plugins/table/trumbowyg.table';
import '../../node_modules/trumbowyg/dist/plugins/preformatted/trumbowyg.preformatted';
import '../../node_modules/trumbowyg/dist/plugins/noembed/trumbowyg.noembed';


class TextEditor extends PureComponent {

  static propTypes = {
    handleChange: PropTypes.func.isRequired,
    data: PropTypes.string,
  }

  static defaultProps = {
    data: undefined
  }

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <Editor
        initialValue={this.props.data}
        init={{
          plugins: 'link image lists code fullscreen',
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | numlist bullist | code| fullscreen'
        }}
        onChange={this.props.handleChange} 
      />
    );
  }
}

export default TextEditor;  
