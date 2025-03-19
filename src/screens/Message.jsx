import React, { useState, useRef, useEffect, use, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
} from "react-native";
import MainLayoutWrapper from "../components/layout/MainLayoutWrapper";
import messageSocket from "../services/messageSocket";
import { userSelector } from "../redux/selectors/selector";
import { useSelector } from "react-redux";
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
function Message() {
  const user = useSelector(userSelector);

  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello!",
      sender: "other",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      text: "Hi there!",
      sender: "me",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection when app starts
    messageSocket.init({ userId: user?._id });

    // Clean up socket connection when app is closed
    return () => {
      messageSocket.disconnect();
      messageSocket.off("receive_message");
    };
  }, []);

  const onSend = () => {
    const messageToSend = {
      text: inputText,
      sender: "me",
      timestamp: new Date().toISOString(),
    };

    // Add message to local state
    setMessages((previousMessages) => [...previousMessages, messageToSend]);

    // Send message through socket
    messageSocket.emit("send_message", {
      conversationId: "67db0e237946051c65e569ff",
      senderId: user?._id,
      receiverId: user?._id,
      text: messageToSend.text,
      createdAt: new Date(),
    });
    setInputText("");
  };

  messageSocket.on("receive_message", (message) => {
    console.log("New message received:", message);
    const generateId = () =>
      `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const messageToReceived = {
      id: message._id + generateId(),
      text: message.text,
      sender: "other",
      timestamp: message.updatedAt,
    };

    // Add message to local state
    setMessages((previousMessages) => [...previousMessages, messageToReceived]);
  });

  const renderMessage = ({ item }) => {
    const isMyMessage = item.sender === "me";
    return (
      <View
        style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text style={[styles.messageSender, isMyMessage && styles.mySender]}>
          {item.text}
        </Text>
        <Text style={[styles.timestamp, isMyMessage && styles.mySender]}>
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  return (
    <MainLayoutWrapper headerHidden={true}>
      <Image
        source={require("../../assets/image/ChatBG.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesListContent}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={onSend}
          disabled={inputText.trim() === ""}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </MainLayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    height: 60,
    backgroundColor: "#075E54",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  backgroundImage: {
    position: "absolute",
    top: -HEIGHT * 0.15,
    left: 0,
    right: 0,
    width: WIDTH,
    height: HEIGHT * 0.35,
  },
  messagesList: {
    flex: 1,
    marginTop: HEIGHT * 0.15,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    backgroundColor: "#F8FBFB",
  },
  messagesListContent: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 20,
    marginVertical: 5,
  },
  myMessage: {
    backgroundColor: "#A4DC5D",
    alignSelf: "flex-end",
    borderBottomRightRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  messageSender: {
    color: "#5D6066",
  },
  mySender: {
    color: "white",
  },
  otherMessage: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  messageText: {
    fontSize: 16,
    color: "#000",
  },
  timestamp: {
    fontSize: 11,
    color: "#999",
    alignSelf: "flex-end",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    paddingBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 18,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    backgroundColor: "#A4DC5D",
    borderRadius: 50,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Message;
