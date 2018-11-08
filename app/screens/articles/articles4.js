import React from 'react';
import {
  FlatList,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  RkText,
  RkCard,
  RkStyleSheet,
} from 'react-native-ui-kitten';
import { SocialBar } from '../../components';
import NavigationType from '../../config/navigation/propTypes';
import { AsyncStorage } from "react-native"
import { UIConstants } from '../../config/appConstants';


export class Articles4 extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'My orders'.toUpperCase(),
  };

  constructor(props){
    super(props);
    this.getOrders();
  }
  state = {
    orders:[],
    user:'',
    msg:'Loading...'
  };

  getOrders = async()=> {
    let res = await AsyncStorage.getItem('currentUser');
    this.setState({user:JSON.parse(res).data});
    const { user } = this.state;
    let result = [];
    if(user.type == 'Technician'){  
      result = await fetch(`${UIConstants.URL}order/by/technician/${user.userable.id}`);
    }
    else{
      result = await fetch(`${UIConstants.URL}order/by/customer/${user.userable.id}`);
    }
    let orders = await result.json(); 
    this.setState({orders:orders.data});  
  }

  handleOnPress = item =>()=> {
    this.props.navigation.navigate('OrderDetail',{order:item})
  }

  extractItemKey = (item) => `${item.id}`;
  renderStatus = (text) =>{
    switch (text) {
      case "Active":  return <RkText style={styles.post} numberOfLines={1} rkType='success'> {text}</RkText>
      case "Repairing":  return <RkText style={styles.post} numberOfLines={1} rkType='primary'> {text}</RkText>
      default:return <RkText style={styles.post} numberOfLines={1} rkType='secondary5'> {text}</RkText>
    }
   
  }
  renderUser = (item)=>{
    let user=item.customer;
    if(user.type=="Customer"){
      user = item.technician;
    }
    if(item.score==null){
      return <RkText rkType='secondary6 hintColor'>
        {user}
      </RkText>
    }
    return <RkText rkType='secondary6 hintColor'>
      {user}{', score: '+item.score}
    </RkText>
    
  }
  noItemDisplay = () => (
    <View >
      <RkText style={styles.center} rkType='header4 hintColor'>{this.state.msg}</RkText>
    </View>
  );
  renderItem = ({ item }) => (
    <TouchableOpacity
      delayPressIn={70}
      activeOpacity={0.8}
      onPress={this.handleOnPress(item)}>
      <RkCard rkType='horizontal' style={styles.card} >
        <Image rkCardImg source={{uri:item.photo}} />
        <View rkCardContent>
          <RkText numberOfLines={1} rkType='header6'>{item.breakdown}</RkText>
          {this.renderUser(item)}
          <RkText style={styles.post} numberOfLines={1} rkType='secondary6'>{item.created_at}</RkText>
          {this.renderStatus(item.finish_at)}
        </View>
        <View rkCardFooter>
          <SocialBar rkType='space' showLabel />
        </View >
      </RkCard>
    </TouchableOpacity>
  );

  render = () => (
    <View>
      <FlatList
        data={this.state.orders}
        renderItem={this.renderItem}
        keyExtractor={this.extractItemKey}
        style={styles.container}
        ListEmptyComponent={this.noItemDisplay}
      />
    </View>
  );
}


const styles = RkStyleSheet.create(theme => ({
  container: {
    backgroundColor: theme.colors.screen.scroll,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  card: {
    marginVertical: 8,
  },
  post: {
    marginTop: 2,
  },
  center: {
    textAlign: 'center',
    width: '100%',
  }
}));
