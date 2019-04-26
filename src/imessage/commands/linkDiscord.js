import Command from "../../command";

class LinkDiscord extends Command {
  constructor() {
    super("linkdiscord", "Links your phone number to your Discord account");
  }

  onMessage(message) {
    const client = message.getDiscordClient();
    var payload = message.content.split(" ");
    payload.shift();
    payload = payload.join(" ");
    const user = client.users.find(user => user.tag == payload);

    if (!user) {
      message.sendMessage("User not found in available guilds");
      return;
    }

    user.createDM().then(dmChannel => {
      dmChannel
        .send(
          `The number \`${message.getRecipientId()}\` is trying to link to this Discord account. Is this your number? (PLEASE THUMBS DOWN IF YOU DO NOT RECOGNIZE THE NUMBER/EMAIL)`
        )
        .then(discordMessage => {
          discordMessage.react("👍").then(() => discordMessage.react("👎"));

          const filter = (reaction, reactUser) => {
            return (
              ["👍", "👎"].includes(reaction.emoji.name) &&
              reactUser.tag == user.tag
            );
          };

          discordMessage
            .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
            .then(collected => {
              const reaction = collected.first();

              if (reaction.emoji.name === "👍") {
                discordMessage.edit(
                  "iMessage account linked to Discord successfully"
                );
              } else {
                discordMessage.edit("iMessage account link rejected");
              }
            })
            .catch(collected => {
              discordMessage.reply(
                "The iMessage account link request has expired"
              );
            });
        });
    });

    message.sendMessage("Bruh");
  }
}

export default new LinkDiscord();
