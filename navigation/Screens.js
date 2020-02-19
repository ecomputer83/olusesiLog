import React from 'react';
import { Block } from "galio-framework";
import { Easing, Animated } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
// screens
import Home from '../screens/Home';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Onboarding from '../screens/Onboarding';

// drawer
import Menu from './Menu';
import DrawerItem from '../components/DrawerItem';
import nowTheme from '../constants/Theme';

// header for screens
import Header from '../components/Header';

const transitionConfig = (transitionProps, prevTransitionProps) => ({
  transitionSpec: {
    duration: 400,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing
  },
  screenInterpolator: sceneProps => {
    const { layout, position, scene } = sceneProps;
    const thisSceneIndex = scene.index;
    const width = layout.initWidth;

    const scale = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [4, 1, 1]
    });
    const opacity = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [0, 1, 1]
    });
    const translateX = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex],
      outputRange: [width, 0]
    });

    const scaleWithOpacity = { opacity };
    const screenName = 'Search';

    if (
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName)
    ) {
      return scaleWithOpacity;
    }
    return { transform: [{ translateX }] };
  }
});

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: ({ navigation }) => ({
        header: <Header bgColor={nowTheme.COLORS.PRIMARY} iconColor={nowTheme.COLORS.WHITE} title="Home" navigation={navigation} />
      })
    },
    // Pro: {
    //   screen: Pro,
    //   navigationOptions: ({ navigation }) => ({
    //     header: (
    //       <Header left={<Block />} white transparent title="" navigation={navigation} />
    //     ),
    //     headerTransparent: true
    //   })
    // }
  },
  {
    cardStyle: {
      backgroundColor: '#FFFFFF'
    },
    transitionConfig
  }
);

const AppStack = createDrawerNavigator(
  {
    Onboarding: {
      screen: Onboarding,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    Login: {
      screen: Login,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    Register: {
      screen: Register,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    Home: {
      screen: HomeStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => <DrawerItem focused={focused} title="Home" />
      })
    }
    
  },
  Menu
);

const AppContainer = createAppContainer(AppStack);
export default AppContainer;
