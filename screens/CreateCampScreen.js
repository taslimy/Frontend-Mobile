import React from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Button
} from 'react-native';
import { ScrollView } from 'react-navigation';
import { Input } from 'react-native-elements';
import { connect } from 'react-redux';
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'

import { postCampaign, getCampaigns } from '../store/actions';

import PublishButton from '../components/PublishButton';

class CreateCampScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'New Campaign',
      headerStyle: {
        backgroundColor: '#323338'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        textAlign: 'center',
        flexGrow: 1,
        alignSelf: 'center',
        fontFamily: 'OpenSans-SemiBold'
      },
      headerRight: (
        <PublishButton
          navigation={navigation}
          pressAction={navigation.getParam('publish')}
        />
      )
    };
  };

  state = {
    users_id: this.props.currentUserProfile.id,
    camp_name: '',
    camp_desc: '',
    camp_cta: '',
    camp_img: '',
  };

  getPermissionAsync = async() => {
      if (Constants.platform.ios) {
          const {status }= await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if(status !==  'granted'){
              alert('Sorry, we need camera roll permissions to make this work!');
          }
      }
  }

  _pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
      })
      console.log(result, 'Pick Image ----------------------------------');
      if(!result.cancelled){
          this.setState({
            camp_img: result.uri
          })
      }
  }

  componentDidMount() {
    this.props.navigation.setParams({ publish: this.publish });
    this.getPermissionAsync();
  }

  publish = async () => {
    if (
      !this.state.camp_img ||
      !this.state.camp_name ||
      !this.state.camp_desc ||
      !this.state.camp_cta
    ) {
      return;
    } else {
      await this.props.postCampaign(this.state);
      await this.props.getCampaigns();
      this.props.navigation.navigate('Home');
    }
  };

  render() {
    let { camp_img } = this.state;
    console.log(this.state.users_id)
    return (
      <KeyboardAvoidingView
        behavior='height'
        keyboardVerticalOffset={90}
        enabled
      >
        <ScrollView
          contentContainerStyle={{
            backgroundColor: '#fff',
            minHeight: '100%'
          }}
        >
          <View style={styles.sectionContainer}>
            <View style={styles.sections}>
              <Text style={styles.sectionsText}>Campaign Name</Text>
              <TextInput
                ref={input => {
                  this.campNameInput = input;
                }}
                returnKeyType='next'
                placeholder='Koala In Need!'
                style={styles.inputContain}
                onChangeText={text => this.setState({ camp_name: text })}
                onSubmitEditing={() => {
                  if (Platform.OS === 'android') return;
                  this.campImgUrlInput.focus();
                }}
                blurOnSubmit={Platform.OS === 'android'}
                value={this.state.camp_name}
              />
            </View>
            <View style={styles.sections}>
              <Text style={styles.sectionsText}>Campaign Image URL</Text>
                <Button
                title= 'Click here to choose an Image'
                onPress={this._pickImage}
                />
                {camp_img ?
                <Image source={{ url: camp_img }} style={{width: 50, height: 50}}/> : null}
            </View>

            <View style={styles.sections}>
              <Text style={styles.sectionsText}>Campaign Details</Text>
              <TextInput
                ref={input => {
                  this.campDetailsInput = input;
                }}
                returnKeyType='next'
                placeholder='Add campaign details and list of monetary needs.'
                style={styles.inputContain2}
                onChangeText={text => this.setState({ camp_desc: text })}
                multiline={true}
                value={this.state.camp_desc}
              />
            </View>

            <View style={styles.sections}>
              <Text style={styles.sectionsText}>Donation Link</Text>
              <TextInput
                ref={input => {
                  this.donationLinkInput = input;
                }}
                returnKeyType='next'
                keyboardType='url'
                placeholder='Please include full URL'
                autoCapitalize='none'
                style={styles.inputContain}
                onChangeText={text => this.setState({ camp_cta: text })}
                value={this.state.camp_cta}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  currentUserProfile: state.currentUserProfile
});

export default connect(
  mapStateToProps,
  { postCampaign, getCampaigns }
)(CreateCampScreen);

const styles = StyleSheet.create({
  sectionContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    margin: 15
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottomColor: '#f5f5f5',
    paddingLeft: 10,
    paddingRight: 10,
    height: 75
  },
  TouchableOpacity: {},
  ButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#eee',
    marginTop: 12,
    marginBottom: 12,
    flex: 1
  },
  CancelButton: {
    fontSize: 16,
    color: 'black'
  },
  PublishButton: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
  },
  camera: {
    backgroundColor: '#C4C4C4',
    width: '100%',
    height: 150,
    flexDirection: 'row'
  },
  CameraContainerButton: {
    marginTop: 120,
    marginRight: 10,
    marginLeft: 10
  },
  inputContain: {
    height: 48,
    borderWidth: 2,
    borderColor: '#C4C4C4',
    padding: 5,
    borderRadius: 5,
    fontSize: 20,
    marginBottom: 25
  },
  inputContain2: {
    height: 140,
    borderWidth: 2,
    borderColor: '#C4C4C4',
    padding: 5,
    borderRadius: 5,
    fontSize: 20,
    marginBottom: 25,
    textAlignVertical: 'top'
  },
  Card: {
    marginTop: 20,
    backgroundColor: '#fff',
    width: '100%',
    padding: 25
  },
  cardText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 25
  },
  cardPara: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 13
  },
  sectionsText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
    marginBottom: 5
  }
});
