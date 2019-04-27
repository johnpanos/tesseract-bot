import Command from "../../command";

class LinkDiscord extends Command {
  constructor() {
    super(
      "linkdiscord",
      "Links your phone number to your Discord account (UNDER CONSTRUCTION)"
    );
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

    client.imsgDiscordLink.ensure(user.id, {
      user: user.id,
      imsgAccounts: []
    });

    if (
      client.imsgDiscordLink
        .get(user.id)
        .imsgAccounts.find(acc => acc == message.getRecipientId()) != null
    ) {
      message.sendMessage("Discord account already linked");
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

                client.imsgDiscordLink.push(
                  user.id,
                  message.getRecipientId(),
                  "imsgAccounts"
                );
              } else {
                discordMessage.edit("iMessage account link rejected");
              }
            })
            .catch(collected => {
              console.log(collected);
              discordMessage.reply(
                "The iMessage account link request has expired"
              );
            });
        });
    });
  }
}

export default new LinkDiscord();
