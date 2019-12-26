import React, { Component } from "react";
import { Text, View, Alert } from "react-native";
import {
  createAppContainer,
  NavigationActions,
  StackActions
} from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Notifications } from "expo";
import * as WebBrowser from "expo-web-browser";
import * as Permissions from "expo-permissions";

class Top extends Component {
  state = {
    token: null
  };

  componentDidMount() {
    this.getToken();
  }

  getToken = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    const token = await Notifications.getExpoPushTokenAsync();

    console.log("[EXPO NOTIFICATION TOKEN]", token);
    console.log(
      `Try running the command "node pushNotification.js ${
        token.match(/\[(.+)]/)[1]
      } [SCREEN NAME(A|B|C) or URL] [ID]"`
    );
    console.log(
      `ex) $ node pushNotification.js ${token.match(/\[(.+)]/)[1]} A 123`
    );
    this.setState({ token });
  };

  render() {
    const { token } = this.state;
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text>{token || "getting token..."}</Text>
        <Text>Please look your console</Text>
      </View>
    );
  }
}

const stackOptions = {
  top: {
    screen: Top,
    navigationOptions: {
      header: null
    }
  }
};

[
  { routeName: "A", color: "#6200EE" },
  { routeName: "B", color: "#03DAC6" },
  { routeName: "C", color: "#B00020" }
].forEach(option => {
  stackOptions[option.routeName] = {
    screen: props => (
      <View
        style={{
          flex: 1,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: option.color
        }}
      >
        <Text style={{ color: "#FFF", fontSize: 16 }}>screen name</Text>
        <Text style={{ color: "#FFF", fontSize: 24 }}>{option.routeName}</Text>
        <Text style={{ color: "#FFF", fontSize: 16, marginTop: 24 }}>ID</Text>
        <Text style={{ color: "#FFF", fontSize: 24 }}>
          {props.navigation.state.params.id || "-"}
        </Text>
      </View>
    ),
    navigationOptions: ({ navigation }) => ({
      headerTitle: `${option.routeName} ID:${navigation.state.params.id}`
    })
  };
});

const AppContainer = createAppContainer(
  createStackNavigator(stackOptions, {
    initialRouteName: "top"
  })
);

export default class App extends Component {
  componentDidMount() {
    Notifications.addListener(notification => {
      console.log("received notification", notification);
      if (notification.origin === "selected") {
        this.respond(notification);
      } else if (notification.origin === "received") {
        Alert.alert("通知が届きました", "画面へ移動しますか？", [
          {
            text: "キャンセル",
            style: "cancel"
          },
          {
            text: "移動する",
            onPress: () => {
              this.respond(notification);
            }
          }
        ]);
      }
    });
  }

  respond(notification) {
    if (notification.data.url) {
      WebBrowser.openBrowserAsync(notification.data.url);
    } else if (this.navigator) {
      const actionOptions = {
        routeName: notification.data.routeName || "top",
        params: notification.data.params
      };
      if (this.navigator.state.nav.routes.length > 1) {
        // 同階層の場合はスタック追加せず差し替える
        this.navigator.dispatch(StackActions.replace(actionOptions));
      } else {
        this.navigator.dispatch(NavigationActions.navigate(actionOptions));
      }
    }
  }

  render() {
    return (
      <AppContainer
        ref={ref => {
          this.navigator = ref;
        }}
      />
    );
  }
}
