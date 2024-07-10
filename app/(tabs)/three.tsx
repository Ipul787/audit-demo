import { ScrollView, StyleSheet, View, Text } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Row, Rows } from 'react-native-table-component';

interface Audit {
  audit_id: number;
  title: string;
  area: number;
  start_date: Date;
  end_date: Date;
  user: string;
}

export default function TabThreeScreen() {

  const [tableData, setTableData] = useState<string[][]>([]);

  useEffect(() => {
    axios.get<Audit[]>('http://10.0.2.2:3000/audit')
      .then(response => {
        const data = response.data.map((audit: Audit) => [
          audit.audit_id.toString(), 
          audit.title, 
          audit.area.toString(), 
          new Date(audit.start_date).toDateString(), 
          new Date(audit.end_date).toDateString(), 
          audit.user
        ]);
        setTableData(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  
  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9', flexDirection: 'column' }}>
            <Row data={['ID', 'Title', 'Area', 'Start', 'End', 'User']} style={styles.header} textStyle={styles.headerText}/>
            <Rows data={tableData} textStyle={styles.text}/>
          </Table>
        </View>
      </ScrollView>
      <EditScreenInfo path="app/(tabs)/three.tsx" />
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
  header: { 
    height: 50, 
    backgroundColor: '#f1f8ff' 
  },
  headerText: {
    textAlign: 'center', 
    fontWeight: 'bold'
  },
  row: { 
    flexDirection: 'row', 
    height: 40, 
    backgroundColor: '#f1f8ff' 
  }, 
  text: { 
    margin: 6,
    textAlign: 'center'
  }, 
  cell: {
    flex: 1,
    textAlign: 'center'
  }
});
