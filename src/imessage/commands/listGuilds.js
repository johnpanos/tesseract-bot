import Command from "../../command";

class ListGuilds extends Command {
  constructor() {
    super("listguilds", "List current guilds available for selection");
  }

  onMessage(message) {
    const client = message.getDiscordClient();
    console.log(client.guilds);
    const guildString = client.guilds
      .map(guilds => {
        return guilds.name + ": " + guilds.id;
      })
      .join("\n");
    console.log(guildString);
    message.sendMessage(guildString);
  }
}

export default new ListGuilds();
