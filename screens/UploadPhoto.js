import React from 'react'
import { Button, Image, View, Text } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'

export default class UploadPhoto extends React.Component {
    state= {
        image: null,
    }

    getPermissionAsync = async() => {
        if (Constants.platform.ios) {
            const {status }= await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if(status !==  'granted'){
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }

    _pickImage = async () => {
        let result= await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
        })
        console.log(result);
        if(!result.cancelled){
            this.setState({
              image: result.uri
            })
        }
    }

    _uploadImage = async () => {

      const URL = "http://localhost:8000/api/campaigns"
      const uri = this.state.image

      let uriParts = uri.split('.');
      let fileType = uriParts[uriParts.length - 1];

      let formData = new FormData();
      formData.append('photo', {
        uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });

      let options = {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      };

      return fetch(URL, options)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      });

    }

    componentDidMount(){
        this.getPermissionAsync();
    }


    render() {
        let {image} = this.state;
        console.log(image)
        return (
            <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Button
            title= 'Click here to choose an Image'
            onPress={this._pickImage}
            />
            {image &&
            <Image source={{url:image}} style={{width: 200, height: 200}}/>}
            <Button
            title= 'Upload'
            onPress={this._uploadImage}
            />
            </View>
        );
    }
}
