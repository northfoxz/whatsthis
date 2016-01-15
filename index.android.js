/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  BackAndroid,
  ToastAndroid,
  AsyncStorage,
  Image
} = React;

var MainView = require('./main');
var LanguageSelectView = require('./main/LanguageSelect');
var ImageSelectView = require('./main/ImageSelect');

var _navigator;
var _userDataDefault = {

}

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator.getCurrentRoutes().length === 1  ) {
     return false;
  }
  _navigator.pop();
  return true;
});

var NavigationBar = React.createClass({
  getInitialState: function() {
    return {
    }
  },
  componentDidMount: function() {

  },
  render: function() {
    return (
      <View><Text>What's This v0.1</Text></View>
    )
  }
})

var whatsthis = React.createClass({

  getInitialState: function() {
    return {
      loading: false,
      versionKey: 'v0.1',
      user: _userDataDefault
    }
  },
  componentDidMount() {
    this._loadInitialState().done();
  },
  async _loadInitialState() {
    try {
      var value = await AsyncStorage.getItem('userData');
      if (value !== null){
        // ToastAndroid.show('Welcome back', 1)
        this.setState({ user: JSON.parse(value) });
      } else {
        // ToastAndroid.show('You are new, welcome.', 1)
        this._setDefaultUserData().done();
      }
    } catch (error) {
      ToastAndroid.show('存取資料出錯', 1)
    }
  },
  async _setDefaultUserData() {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(_userDataDefault))
    } catch (error) {
      ToastAndroid.show(JSON.stringify(error), 1)
    }
  },
  async _saveUserData() {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(this.state.user))
    } catch (error) {
      ToastAndroid.show(JSON.stringify(error), 1)
    }
  },

  render: function() {
    return (
      <View style={{flex:1}}>
        <Navigator
          style={{flex:1}}
          navigationBar={this._renderNavigationBar()}
          initialRoute = {{ id: 'Home' }}
          configureScene={this._configureScene}
          renderScene={this._renderScene}
        />
        { this.state.loading ? <LoadingView /> : null }
      </View>
    );
  },
  _setLoading: function(state) {
    this.setState({
      loading: state
    })
  },
  _renderNavigationBar: function() {
    return (<View></View>);
  },
  _configureScene: function(route) {
    switch(route.id) {
      case 'Home':
        return Navigator.SceneConfigs.FadeAndroid;
      default:
        return Navigator.SceneConfigs.PushFromRight;
    }
  },
  _renderScene: function(route, navigator) {
    _navigator = navigator
    switch(route.id) {
      case 'Home':
        return (
          <MainView
            setLoading={this._setLoading}
            getUserData={this._getUserData}
            setUserData={this._setUserData}
            navigator={navigator} />
        );
      case 'LanguageSelect':
        return (
          <LanguageSelectView
            setLoading={this._setLoading}
            getUserData={this._getUserData}
            setUserData={this._setUserData}
            navigator={navigator} />
        );
      case 'ImageSelect':
        return (
          <ImageSelectView
            setLoading={this._setLoading}
            getUserData={this._getUserData}
            setUserData={this._setUserData}
            navigator={navigator} />
        );
    }
  },
  _setUserData: function(key, value) {
    var _user = this.state.user;
    _user[key] = value;
    this.setState({ user: _user });
    this._saveUserData().done();
  },
  _getUserData: function(key) {
    var _user = this.state.user;
    return _user[key];
  }
});


AppRegistry.registerComponent('whatsthis', () => whatsthis);
