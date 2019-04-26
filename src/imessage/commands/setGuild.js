import Command from "../../command";

class SetGuild extends Command {
  constructor() {
    super("setguild", "Sets the current guild to the specified guild");
  }

  onMessage(message) {
    const client = message.getDiscordClient();

    var payload = message.content.split(" ");
    payload.shift();
    payload = payload.join(" ");

    const guildFromId = client.guilds.find(guild => guild.id == payload);
    const guildFromName = client.guilds.find(
      guild => guild.name.toLocaleLowerCase() == payload.toLocaleLowerCase()
    );

    if (guildFromId != null || guildFromName != null) {
      const guild = guildFromId || guildFromName;

      client.imsgUserData.ensure(message.getRecipientId(), {
        guild: null
      });

      if (
        client.imsgUserData.get(message.getRecipientId(), "guild") == guild.id
      ) {
        message.sendMessage(
          `Your current guild is already set to "${guild.name}"`
        );
      } else {
        client.imsgUserData.set(message.getRecipientId(), guild.id, "guild");
        message.sendMessage(`Current guild set to "${guild.name}"`);
      }
    } else {
      message.sendMessage(`No guild found with name or id: "${payload}"`);
    }
  }
}

export default new SetGuild();
