import Command from "../../command";

class ListChannels extends Command {
  constructor() {
    super("listchannels", "List current channels available for selection");
  }

  onMessage(message) {
    const client = message.getDiscordClient();
    const guild = client.guilds.find(
      guild => guild.id == message.getCurrentGuild()
    );

    if (guild == null) {
      message.sendMessage("Bruh, you don't have a current guild selected");
    } else {
      guild.channels.map(channel => {
        if (channel.type == "text") {
          message.sendMessage(`${channel.name}: ${channel.id}`);
        }
      });
    }

    // var payload = message.content.split(" ");
    // payload.shift();
    // payload = payload.join(" ");

    // const guildFromId = client.guilds.find(guild => guild.id == payload);
    // const guildFromName = client.guilds.find(
    //   guild => guild.name.toLocaleLowerCase() == payload.toLocaleLowerCase()
    // );

    // if (guildFromId != null || guildFromName != null) {
    //   const guild = guildFromId || guildFromName;

    //   message.sendMessage("Listing channels for guild: " + guild.name);
    //   guild.channels.map(channel => {
    //     if (channel.type == "text") {
    //       message.sendMessage(`${channel.name}: ${channel.id}`);
    //     }
    //   });
    // } else {
    //   message.sendMessage(
    //     "Please enter in a valid guild to see available channels, use listguilds to see available guilds."
    //   );
    // }
  }
}

export default new ListChannels();
