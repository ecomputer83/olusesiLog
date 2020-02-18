import React from 'react';
import { View, Image, Text, Dimensions, StyleSheet} from 'react-native';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import {Block} from 'galio-framework';

import {nowTheme} from '../constants';
const { height, width } = Dimensions.get('window');
export default class MyCarousel extends React.Component {
    _image = (imagewidth, item, parallaxProps) => {
      const { parallax, even } = this.props;
      parallax ? (
        <ParallaxImage
          source={item}
          containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
          style={[styles.image, {width: imagewidth}]}
          parallaxFactor={0.35}
          showSpinner={true}
          spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
          {...parallaxProps}
        />
    ) : (
        <Image
          source={item}
          style={[styles.image, {width: imagewidth, height: (imagewidth / 2)}]}
        />
    );
    }
    _renderItem = ({item, index}, parallaxProps) => {
      const { imagewidth, even } = this.props;

      const uppercaseTitle = item.model ? (
            <Text
              style={styles.title}
              numberOfLines={2}
            >
                { item.model.toUpperCase() }
            </Text>
        ) : false;

        return (
        <View style={{width: imagewidth }}>
          <Image
          source={item.featureimage}
          style={[styles.image, {width: imagewidth, height: (imagewidth / 2)}]}
        />
          <View style={styles.textContainer}>
                    { uppercaseTitle }
                    <Text
                      style={styles.subtitle}
                      numberOfLines={2}
                    >
                        { item.year }
                    </Text>
          </View>
        </View>
          
        );
    }

    render = () => {
      const { imagewidth, item, even } = this.props;
      // const { slider1ActiveSlide } = this.state;
  
      return (
        <Block style={[styles.Container, {width: width}]}>
                  <Carousel
                    ref={c => this._slider1Ref = c}
                    data={item}
                    renderItem={this._renderItem}
                    sliderWidth={imagewidth}
                    itemWidth={imagewidth}
                    hasParallaxImages={true}
                    firstItem={1}
                    inactiveSlideScale={0.94}
                    inactiveSlideOpacity={0.7}
                    containerCustomStyle={styles.slider}
                    contentContainerCustomStyle={styles.sliderContentContainer}
                    loop={true}
                    loopClonesPerSide={2}
                    autoplay={true}
                    autoplayDelay={500}
                    autoplayInterval={3000}
                  />
              </Block>
      );
    }
}

const styles = StyleSheet.create({
  slider: {
    marginTop: 15,
    overflow: 'visible' // for custom animations
},
sliderContentContainer: {
  paddingTop: 10 // for custom animation
},
paginationContainer: {
  paddingTop: 8
},
textContainer: {
  justifyContent: 'center',
  paddingTop: 12,
  paddingBottom: 20,
  paddingHorizontal: 16,
  backgroundColor: nowTheme.COLORS.SLIDER_TEXT_COLOR,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0
},
paginationDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  marginHorizontal: 8
},
Container: {
  paddingTop: 20,
  zIndex: 2,
},
title: {
  color: nowTheme.COLORS.WHITE,
  fontSize: 13,
  fontWeight: 'bold',
  letterSpacing: 0.5
},
subtitle: {
  marginTop: 6,
  color: nowTheme.COLORS.WHITE,
  fontSize: 12,
  fontStyle: 'italic'
},
imageContainer: {
  flex: 1,
  marginBottom: -1, // Prevent a random Android rendering issue
  backgroundColor: 'white',
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
},
imageContainerEven: {
  backgroundColor: nowTheme.COLORS.BLACK
},
});