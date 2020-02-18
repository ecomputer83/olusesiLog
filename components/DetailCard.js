import React from 'react';
import { Block, Text, theme, Button as GaButton } from 'galio-framework';
import { nowTheme } from '../constants';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('screen');
export default class DetailCard extends React.Component {

    render(){
        const {
            Key,
            Value,
            bgColor,
            ...props
          } = this.props;
            const PrimaryColor = nowTheme.COLORS.PRIMARY;
            const BlackColor = nowTheme.COLORS.BLACK;
          return ( 
              <Block row flex style={{width:width}}>
            <Block style={{width:(width - 10) * 0.4}}>
            <Text
                style={{
                  color: PrimaryColor,
                  fontWeight: 'bold',
                  fontSize: 16,
                  fontFamily: 'montserrat-bold',
                  marginTop: 5,
                  marginBottom: 5,
                  zIndex: 2
                }}
              >
                {Key}
                  </Text>
            </Block>
            <Block style={{width: (width - 50) * 0.6}}>
            <Text
                style={{
                  color: BlackColor,
                  fontSize: 16,
                  fontFamily: 'montserrat-bold',
                  marginTop: 5,
                  marginBottom: 5,
                  zIndex: 2
                }}
              >
                {Value}
                  </Text>
            </Block>
          </Block>)
    }
}