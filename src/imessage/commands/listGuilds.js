import Command from "../../command";

class ListGuilds extends Command {
  constructor() {
    super("listguilds", "List current guilds available for selection");
  }

  onMessage(message) {
    const client = message.getDiscordClient();
    const guildString = client.guilds
      .map(guilds => {
        return guilds.name + ": " + guilds.id;
      })
      .join("\n\n");
    message.sendMessage(guildString);
  }
}

export default new ListGuilds();
