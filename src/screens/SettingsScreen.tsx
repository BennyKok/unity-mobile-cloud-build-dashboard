import React, { useEffect } from 'react';
import { Button, Card, Divider, Icon, IconProps, Input, Layout, Spinner, Text, useTheme } from '@ui-kitten/components';
import { CancelIcon, ConfirmIcon } from '../Icons';
import { createStackNavigator } from '@react-navigation/stack';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import StoreUtils from "../utils/StoreUtils";
import { ActivityIndicator, Linking, View } from 'react-native';

const SettingsStack = createStackNavigator();
export function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
}

type SettingsLabelProps = {
  text: string
}

function SettingsLabel(params: SettingsLabelProps) {
  return <Text style={{ paddingTop: 8, paddingBottom: 10, fontWeight: 'bold' }} category='label'>{params.text}</Text>
}

function SettingsScreen() {
  const [apiKeyEditing, onChangeTextApiKeyEditing] = React.useState('');
  const [apiKeySaved, onChangeTextApiKeySaved] = React.useState('');
  const [apiKeyVisible, setApiKeyVisible] = React.useState(false);

  const [isLoadingAPIKey, setLoadingAPIKey] = React.useState(true);

  useEffect(() => {
    StoreUtils.loadApiKey((val) => {
      if (val != null)
        onChangeTextApiKeySaved(val)
      setLoadingAPIKey(false)
    });
  });

  const renderIcon = (props: IconProps) => (
    <TouchableWithoutFeedback onPress={() => setApiKeyVisible(!apiKeyVisible)}>
      <Icon {...props} name={!apiKeyVisible ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  const theme = useTheme();

  return (
    // <FadeInLayout>
    <Layout style={{ height: '100%', width: '100%' }}>
      <ScrollView >
        <Layout style={{ paddingHorizontal: 10, flex: 1, alignItems: 'flex-start' }}>
          <Card style={{ marginTop: 10 }}>
            <SettingsLabel text='Cloud Build API Key' />
            <Text style={{ marginBottom: 10 }} category='s2'>The API key is used to retrieve your cloud projects. {"\n\n"}Go to your cloud build dashboard -{">"} any project -{">"} settings -{">"} API settings</Text>
          </Card>

          {isLoadingAPIKey ?
            <View style={{ flex: 1, justifyContent: 'center', flexDirection: "row", width: '100%', marginVertical: 12 }}>
              <ActivityIndicator size="small" color={theme['text-basic-color']} />
            </View> :
            <>
              <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
                <Input
                  style={{ flex: 1, alignSelf: 'center' }}
                  // onSubmitEditing={setApiKey}
                  placeholder='Cloud Build API Key'
                  disabled={apiKeySaved ? true : false}
                  secureTextEntry={!apiKeyVisible}
                  value={apiKeySaved ? apiKeySaved : apiKeyEditing}
                  onChangeText={nextValue => onChangeTextApiKeyEditing(nextValue)}
                  accessoryRight={renderIcon} />

                {apiKeySaved ? <Button
                  style={{ height: 20, width: 20 }}
                  accessoryRight={CancelIcon}
                  status='danger'
                  onPress={() => StoreUtils.removeApiKey(() => onChangeTextApiKeySaved(''))}
                  appearance='outline'
                />

                  : <Button
                    appearance='outline'
                    style={{ height: 20, width: 20 }}
                    accessoryRight={ConfirmIcon}
                    onPress={() => StoreUtils.setApiKey(apiKeyEditing, () => {
                      onChangeTextApiKeySaved(apiKeyEditing);
                      onChangeTextApiKeyEditing('');
                      setApiKeyVisible(false);
                    })}
                  />
                }

              </View>
            </>
          }

          <Card style={{ marginTop: 10 }}>
            <SettingsLabel text='About' />
            <Text category='s2'>This project is open sourced on Github, feel free to have a look there!</Text>
            <View style={{ flexDirection: 'row', alignSelf: "flex-end", marginTop: 10 }}>
              <Button
                status='info'
                appearance='ghost'
                onPress={() => {
                  Linking.openURL('https://github.com/BennyKok/unity-mobile-dashboard');
                }}
              >
                Github
        </Button>
            </View>
          </Card>

          <Card style={{ marginTop: 10, marginBottom: 30 }}>
            <SettingsLabel text='About Author' />
            <Text category='s2'>This project is created by BennyKok, feel free to check out his other projects as well!</Text>
            <View style={{ flexDirection: 'row', alignSelf: "flex-end", marginTop: 10 }}>
              <Button
                status='info'
                appearance='ghost'
                onPress={() => {
                  Linking.openURL('https://www.bennykok.com/home');
                }}
              >
                Website
        </Button>
              <Button
                status='info'
                appearance='ghost'
                onPress={() => {
                  Linking.openURL('https://twitter.com/BennyKokMusic');
                }}
              >
                Twitter
        </Button>
            </View >
          </Card>
        </Layout >
      </ScrollView>
    </Layout>
    //</FadeInLayout>
  );
}
