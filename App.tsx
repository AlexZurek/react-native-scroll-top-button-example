import React, { useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Avatar, Icon, ListItem } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const listRef = useRef<FlatList<any>>(null);

  const fetchMoreEmployees = async () => {
    const result = await fetch(
      "http://dummy.restapiexample.com/api/v1/employees"
    );

    if (result.ok) {
      const data = await result.json();
      setEmployees(data.data);
    }
  };

  useEffect(() => {
    fetchMoreEmployees();
  }, []);

  const renderItem = (itemData: any) => {
    const e = itemData.item;

    return (
      <ListItem bottomDivider>
        <Avatar
          rounded
          icon={{
            name: "user",
            type: "font-awesome-5",
            color: "white",
          }}
          containerStyle={{
            backgroundColor: "purple",
          }}
        />

        <ListItem.Content>
          <ListItem.Title>{e.employee_name}</ListItem.Title>
          <ListItem.Subtitle>
            {`Salary: ${e.employee_salary.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}`}
          </ListItem.Subtitle>
        </ListItem.Content>

        <ListItem.Chevron />
      </ListItem>
    );
  };

  const scrollTopHandler = () => {
    if (listRef.current) {
      listRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const onScrollHandler = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setContentVerticalOffset(event.nativeEvent.contentOffset.y);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        keyExtractor={(item) => `${item.id}`}
        data={employees}
        renderItem={renderItem}
        ref={listRef}
        onScroll={onScrollHandler}
        scrollEventThrottle={16}
      />

      {contentVerticalOffset > 300 && (
        <Icon
          name="north"
          type="material"
          raised
          reverse
          color="teal"
          containerStyle={styles.scrollTopButton}
          onPress={scrollTopHandler}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollTopButton: {
    position: "absolute",
    bottom: 30,
    right: 10,
  },
});
