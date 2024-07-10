import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useAuth } from '../AuthContext';

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleRegister = async () => {
        try {
        register(email, username, password);
        } catch (err) {
        setError('Registration failed');
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
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
        />
        <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Register" onPress={handleRegister} />
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

export default RegisterScreen;