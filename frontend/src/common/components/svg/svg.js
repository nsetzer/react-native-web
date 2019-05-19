
import React from "react";

import SvgUri from 'react-native-svg-uri';

class Svg extends React.PureComponent {
    render() {
    return (
        <SvgUri source={this.props.src}
            width={this.props.style.width}
            height={this.props.style.height}
            />
    )
  }

}