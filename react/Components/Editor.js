import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Trumbowyg from 'react-trumbowyg';

import '../../node_modules/trumbowyg/dist/plugins/table/trumbowyg.table';
import '../../node_modules/trumbowyg/dist/plugins/preformatted/trumbowyg.preformatted';
import '../../node_modules/trumbowyg/dist/plugins/noembed/trumbowyg.noembed';


class Editor extends PureComponent {

  static propTypes = {
    handleChange: PropTypes.func.isRequired,
    data: PropTypes.shape({})
  }

  static defaultProps = {
    data: undefined
  }

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <Trumbowyg
        id='react-trumbowyg'
        ref="trumbowyg"
        buttons={[
            ['viewHTML'],
            ['formatting'],
            'btnGrp-semantic',
            ['link'],
            ['insertImage'],
            ['noembed'],
            'btnGrp-justify',
            'btnGrp-lists',
            ['table'],
            ['preformatted'],
            ['fullscreen']
          ]}
        data={this.props.data}
        onChange={this.props.handleChange}
      />
    );
  }
}

export default Editor;  
