import React, { useLayoutEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import CustomListItem from '../components/CustomListItem';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { auth, db } from '../config/firebase';

const HomeScreen = ({ navigation }) => {
  const signOut = () => {
    auth.signOut().then(() => {
      navigation.replace('Login');
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'ChatMe',
      headerStyle: { backgroundColor: '#FFF' },
      headerTitleStyle: { color: '#000' },
      headerTintColor: '#000',
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity onPress={signOut} activeOpacity={0.5}>
            <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
          </TouchableOpacity>
        </View>
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
          <TouchableOpacity activeOpacity={0.5}>
            <AntDesign name="camerao" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddChat')}
            activeOpacity={0.5}
          >
            <SimpleLineIcons name="pencil" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView>
      <ScrollView>
        <CustomListItem />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
