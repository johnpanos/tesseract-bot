import { RichEmbed } from "discord.js";
import Command from "../command";

class ListVC extends Command {
  constructor() {
    super("listvc", "Lists all voice channels and ids!");
  }

  onMessage(message) {
    const channels = message.guild.channels.filter(
      channel => channel.type == "voice"
    );
    console.log(channels.array());
    channels.map(channel => {
      const embed = new RichEmbed()
        // Set the title of the field
        .setTitle(`Voice Channel: ${channel.name}`)
        // Set the color of the embed
        .setColor(0xff0000)
        // Set the main content of the embed
        .setDescription(`ID: ${channel.id}`);
      message.channel.send(embed);
    });
  }
}

export default new ListVC();
