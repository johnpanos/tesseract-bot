import Command from "../../command";

class SetChannel extends Command {
  constructor() {
    super("setchannel", "Sets the current channel to the specified channel");
  }

  onMessage(message) {
    const client = message.getDiscordClient();
    var channel = null;

    if (
      (channel = client.channels.find(
        channel => channel.id == message.content.split(" ")[1]
      )) != null
    ) {
      client.imsgUserData.set(message.getRecipientId(), channel.id, "channel");
      message.sendMessage(
        `Subscribed to channel ${
          channel.name
        }. Every message you send will now be sent to this channel.`
      );
    } else {
      message.sendMessage("Channel not found.");
    }
  }
}

export default new SetChannel();
