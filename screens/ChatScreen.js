import React, { useLayoutEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import firebase from 'firebase/app';
import { db, auth } from '../config/firebase';

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Chat',
      headerTitleAlign: 'left',
      headerBackTitleVisible: false,
      headerTitle: () => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Avatar
            rounded
            source={{
              uri:
                messages[0]?.data.photoURL ||
                'https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png',
            }}
          />
          <Text style={{ color: '#FFF', marginLeft: 10, fontWeight: '700' }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={navigation.goBack}
        >
          <AntDesign name="arrowleft" size={24} color="#FFF" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);

  const sendMessage = () => {
    Keyboard.dismiss();

    db.collection('Chats').doc(route.params.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });

    setInput('');
  };

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection('Chats')
      .doc(route.params.id)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
              {messages.map(({ id, data }) =>
                data.email === auth.currentUser.email ? (
                  <View key={id} style={styles.reciever}>
                    <Avatar
                      rounded
                      // WEB
                      containerStyle={{
                        position: 'absolute',
                        top: -17,
                        left: -7,
                      }}
                      // IOS
                      position="absolute"
                      top={-15}
                      left={-5}
                      size={30}
                      source={{
                        uri: data.photoURL,
                      }}
                    />
                    {/* <Text style={styles.recieverName}>{data.displayName}</Text> */}
                    <Text style={styles.recieverText}>{data.message}</Text>
                  </View>
                ) : (
                  <View key={id} style={styles.sender}>
                    <Avatar
                      rounded
                      // WEB
                      containerStyle={{
                        position: 'absolute',
                        top: -17,
                        left: -7,
                      }}
                      // IOS
                      position="absolute"
                      top={-15}
                      left={-5}
                      size={30}
                      source={{
                        uri: data.photoURL,
                      }}
                    />
                    <Text style={styles.senderName}>{data.displayName}</Text>
                    <Text style={styles.senderText}>{data.message}</Text>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                value={input}
                onChangeText={(text) => setInput(text)}
                onSubmitEditing={sendMessage}
                placeholder="Type a message..."
                style={styles.textInput}
              />
              <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                <Ionicons name="send" size={24} color="#2B68E6" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reciever: {
    padding: 15,
    // backgroundColor: '#ECECEC',
    backgroundColor: '#2B68E6',
    // backgroundColor: '#ADD8E6',
    alignSelf: 'flex-end',
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: '80%',
    position: 'relative',
  },
  sender: {
    padding: 15,
    // backgroundColor: '#2B68E6',
    backgroundColor: '#ECECEC',
    alignItems: 'flex-start',
    borderRadius: 20,
    margin: 15,
    maxWidth: '80%',
    position: 'relative',
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: '#000',
  },
  senderText: {
    color: '#000',
    fontWeight: '500',
    marginLeft: 10,
    marginBottom: 15,
  },
  recieverName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: '#000',
  },
  recieverText: {
    // color: '#00008b',
    color: '#FFF',
    fontWeight: '500',
    marginLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: 'transparent',
    backgroundColor: '#ECECEC',
    padding: 10,
    color: '#555',
    borderRadius: 30,
  },
});
