import Command from "../command";

class Ping extends Command {
  constructor() {
    super("ping", "I will reply ping to you!");
  }

  onMessage(message) {
    message.channel.send("Pinging...").then(sent => {
      sent.edit(
        `Pong! Response time: ${sent.createdTimestamp -
          message.createdTimestamp}ms`
      );
    });
  }
}

export default new Ping();
