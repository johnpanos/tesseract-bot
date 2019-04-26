import Command from "../../command";

class Debug extends Command {
  constructor() {
    super("debug", "Prints out debug/user information to the text thread");
  }

  onMessage(message) {
    const client = message.getDiscordClient();
    message.sendMessage(`
ID: ${message.getRecipientId()}

Current Guild: ${
      message.getCurrentGuild() == null
        ? "None"
        : client.guilds.find(guild => guild.id == message.getCurrentGuild())
            .name
    }

Current Channel: ${
      message.getCurrentChannel() == null
        ? "None"
        : "#" +
          client.channels.find(guild => guild.id == message.getCurrentChannel())
            .name
    }
    `);
  }
}

export default new Debug();
