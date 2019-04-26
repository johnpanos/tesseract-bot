import { spawn } from "child_process";
import { resolve } from "path";

class Message {
  constructor(recipient, content) {
    this.recipient = recipient;
    this.content = content;
  }

  static client = null;

  static sendMessageToRecipient(recipient, text) {
    const child = spawn("/usr/bin/osascript", [
      resolve("src/imessage/SendTextSingleBuddy.scpt"),
      text,
      recipient.id
    ]);

    // use child.stdout.setEncoding('utf8'); if you want text chunks
    child.stdout.on("data", chunk => {
      // data from standard output is here as buffers
    });

    child.stderr.on("data", chunk => {
      // data from standard output is here as buffers
      console.log("err: " + chunk);
    });

    child.on("close", code => {
      console.log(`child process exited with code ${code}`);
    });
  }

  sendMessage(text) {
    Message.sendMessageToRecipient(this.recipient, text);
  }

  getDiscordClient() {
    return Message.client;
  }

  getRecipientId() {
    return this.recipient.id;
  }

  getRecipient() {
    return this.recipient;
  }

  getContent() {
    return this.content;
  }
}

export default Message;
