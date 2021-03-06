import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { ScrollView } from 'react-navigation';
import * as WebBrowser from 'expo-web-browser';
import { connect } from 'react-redux';
import SvgUri from 'react-native-svg-uri';
import moment from 'moment';
import { getProfileData } from '../store/actions';
import BackButton from '../components/BackButton';
import { AmpEvent } from '../components/withAmplitude';
import FeedUpdate from '../components/FeedScreen/FeedUpdate';

import styles from '../constants/screens/ViewCampScreen'

class ViewCampScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Campaign',
      headerStyle: {
        backgroundColor: '#323338'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        textAlign: 'center',
        flexGrow: 1,
        alignSelf: 'center'
      },
      headerLeft: <BackButton navigation={navigation} popToTop />,
      headerRight: <View />
    };
  };

  goToProfile = () => {
    this.props.getProfileData(this.props.selectedCampaign.users_id);
    this.props.navigation.navigate('Pro');
  };

  render() {
    let sortedUpdates = false;
    if (this.props.selectedCampaign.updates && this.props.selectedCampaign.updates.length) {
      sortedUpdates = this.props.selectedCampaign.updates.sort(function(a, b) {
        return moment(a.created_at) - moment(b.created_at);
      });
    }

    return (
      <ScrollView>
        <View>
          <ListItem
            onPress={this.goToProfile}
            title={
              <View>
                <Text style={styles.listUsername}>
                  {this.props.selectedCampaign.username}
                </Text>
              </View>
            }
            leftAvatar={{
              source: { uri: this.props.selectedCampaign.profile_image }
            }}
            subtitle={this.props.selectedCampaign.location}
          />
          <Image
            source={{ uri: this.props.selectedCampaign.camp_img }}
            style={styles.campImgContain}
          />
          <View style={styles.campDescContain}>
            <Text style={styles.campDescName}>
              {this.props.selectedCampaign.camp_name}
            </Text>
            <Text style={styles.campDesc}>
              {this.props.selectedCampaign.camp_desc}
            </Text>
          </View>
          <View style={styles.donateView}>
            <View style={styles.campMission}>
              <SvgUri
                fill='#3b3b3b'
                width='25'
                height='25'
                source={require('../assets/icons/hand.svg')}
              />
              <Text style={styles.supportMissionText}>Support Our Mission</Text>
              <Text style={styles.campMissionText}>
                Your donation helps us more{'\n'}than you know. Thanks!
              </Text>
            </View>
            <View style={styles.donateButton}>
              <TouchableOpacity
                style={styles.touchableButton}
                // If these links are empty string and don't have an http:// or a https:// it will send you with unpromised rejections.
                onPress={async () =>
                  this.props.selectedCampaign.camp_cta &&
                  this.props.selectedCampaign.camp_cta !== null &&
                  await WebBrowser.openBrowserAsync(this.props.selectedCampaign.camp_cta) &&
                  AmpEvent('Campaign Donation Button Clicked', {
                    username: this.props.username,
                    campId: this.props.selectedCampaign.camp_id
                  })
                }
              >
                <View style={styles.touchableView}>
                  <Text style={styles.touchableText}>Donate</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.feedContainer}>
            {
              sortedUpdates !== false &&
              sortedUpdates.map(update => {
                return (
                  <FeedUpdate
                    key={`update${update.update_id}`}
                    data={update}
                    toggled
                    hideUsername
                    navigation={this.props.navigation}
                  />
                )                
              }
            )}
        </View>        
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  selectedCampaign: state.selectedCampaign
});


export default connect(
  mapStateToProps,
  { getProfileData }
)(ViewCampScreen);
