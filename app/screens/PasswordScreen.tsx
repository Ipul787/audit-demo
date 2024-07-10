import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useAuth } from '../AuthContext';

const PasswordScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const { update } = useAuth();

    const handleChange = async () => {
        try {
        if (password != newPassword) {
            setError('Password mismatch');
        }
        update(email, newPassword);
        } catch (err) {
        setError('Password change failed');
        }
    };

    return (
        <View style={styles.container}>
        <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
        />
        <TextInput
            placeholder="Enter New Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
        />
        <TextInput
            placeholder="Reconfirm New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={styles.input}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Change Password" onPress={handleChange} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 12,
      padding: 8,
    },
    error: {
      color: 'red',
      marginBottom: 12,
    },
  });

export default PasswordScreen;