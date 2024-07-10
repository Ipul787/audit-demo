import { Alert, Button, Platform, StyleSheet, TextInput } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { jwtDecode } from 'jwt-decode';

export default function TabTwoScreen() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [title, setTitle] = useState('');
  const [startdate, setStartDate] = useState(new Date());
  const [enddate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [area, setArea] = useState([
    { label: 'Malang', value: '1'}, 
    { label: 'Surabaya', value: '2'}, 
    { label: 'Jakarta', value: '3'}
  ]);
  const { userToken } = useAuth();
  const [username, setUsername] = useState('');

  const onChange1 = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || startdate;
    setShowStartPicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  const onChange2 = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const endDate = selectedDate || enddate;
    setShowEndPicker(Platform.OS === 'ios');
    setEndDate(endDate);
  };

  const showStartDatePicker = () => {
    setShowStartPicker(true);
  };

  const showEndDatePicker = () => {
    setShowEndPicker(true);
  };

  useEffect(() => {
    if (userToken) {
      const decoded = jwtDecode(userToken);
      setUsername(decoded.username);
    }
  }, [userToken]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:3000/submitData', {
        title: title,
        area: value,
        startDate: startdate.toISOString(),
        endDate: enddate.toISOString(),
        username: username
      });

      if (response.status === 200) {
        Alert.alert('Data submitted successfully!');
        setTitle('');
        setValue(null);
        setStartDate(new Date());
        setEndDate(new Date());
      } else {
        Alert.alert('Failed to submit data. Server returned status: ' + response.status);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error submitting data. Please try again. ');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Title</Text>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <Text style={styles.text}>Area</Text>
      <DropDownPicker 
        open={open}
        value={value}
        items={area}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setArea}
        style={styles.dropdown}
      />
      <View style={styles.margin}/>
      <Button onPress={showStartDatePicker} title="Select Start Date" />
      {showStartPicker && (
        <DateTimePicker
          value={startdate}
          mode="date"
          display="default"
          onChange={onChange1}
        />
      )}
      <Text>Start Date: {startdate.toDateString()}</Text>
      <View style={styles.margin}/>
      <Button onPress={showEndDatePicker} title="Select End Date" />
      {showEndPicker && (
        <DateTimePicker
          value={enddate}
          mode="date"
          display="default"
          onChange={onChange2}
        />
      )}
      <Text>End Date: {enddate.toDateString()}</Text>
      <View style={styles.margin}/>
      <Text style={styles.text}>User</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        editable={false}
      />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button onPress={handleSubmit} title="Submit" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  text: {
    padding: 8,
    width: '84%'
  }, 
  input: {
    height: 40,
    width: '80%', 
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
  dropdown: {
    height: 40,
    width: '80%',
    marginBottom: 12,
    paddingHorizontal: 8, 
    marginLeft: 40
  }, 
  margin: {
    marginTop: 30, 
  }
});
