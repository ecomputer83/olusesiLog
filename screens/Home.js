import React from "react";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { Block, theme,Button, Text } from "galio-framework";
import { IconCard } from "../components";
import {iconmenu, nowTheme } from "../constants";

const { width } = Dimensions.get("screen");

class Home extends React.Component {
  


  

  render() {
    const { navigation } = this.props;
    return (
      <Block flex center style={styles.home}>
        
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width
  },
  iconCard: {
    width: (width / 3) - 25,
    paddingHorizontal: 2,
    fontFamily: 'montserrat-regular'

  },
  loginbutton: {
    width: (width /2) - (theme.SIZES.BASE * 2 + 2.5),
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
    marginRight: 5
  },

  registerbutton: {
    width: (width /2) - (theme.SIZES.BASE * 2 + 2.5),
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
});

export default Home;
