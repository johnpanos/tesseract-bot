import iMessage from "imessage";
import Config from "../config";
import Message from "./models/Message";
import CommandLoader from "./loader";
import * as Discord from "discord.js";

const im = new iMessage();

const commands = CommandLoader.loadCommands();

const initCommands = async () => {
  for (var key in commands) {
    const command = commands[key];
    command.onLoad();
  }
};

(async () => {
  await initCommands();
})();

var prevRowId = -1;

// const commands = {
//   notify(message) {
//     const client = message.getDiscordClient();
//     var payload = message.content.split(" ");
//     payload.shift();
//     payload = payload.join(" ");

//     const guildFromId = client.guilds.find(guild => guild.id == payload);
//     const guildFromName = client.guilds.find(
//       guild => guild.name.toLocaleLowerCase() == payload.toLocaleLowerCase()
//     );

//     if (guildFromId != null || guildFromName != null) {
//       const guild = guildFromId || guildFromName;

//       client.imsgSubscribedGuilds.ensure(guild.id, []);

//       if (
//         client.imsgSubscribedGuilds
//           .get(guild.id)
//           .find(id => id == message.getRecipientId()) != null
//       ) {
//         message.sendMessage(`You are already subscribed to ${guild.name}!`);
//       } else {
//         client.imsgSubscribedGuilds.push(guild.id, message.getRecipientId());
//         message.sendMessage(`Subscribed to ${guild.name}!`);
//       }
//     }
//   },

//   unsubscribe(message) {
//     const client = message.getDiscordClient();

//     var payload = message.content.split(" ");
//     payload.shift();
//     payload = payload.join(" ");

//     const guildFromId = client.guilds.find(guild => guild.id == payload);
//     const guildFromName = client.guilds.find(
//       guild => guild.name.toLocaleLowerCase() == payload.toLocaleLowerCase()
//     );

//     if (guildFromId != null || guildFromName != null) {
//       const guild = guildFromId || guildFromName;

//       client.imsgSubscribedGuilds.ensure(guild.id, []);

//       if (
//         client.imsgSubscribedGuilds
//           .get(guild.id)
//           .find(id => id == message.getRecipientId()) == null
//       ) {
//         message.sendMessage(`You were not subscribed to ${guild.name}!`);
//       } else {
//         client.imsgSubscribedGuilds.remove(guild.id, message.getRecipientId());
//         message.sendMessage(`Unsubscribed to ${guild.name}!`);
//       }
//     }
//   },
// };

const handleCommand = async message => {
  const recipient = message.getRecipient();
  const client = message.getDiscordClient();
  var command = message.getContent();
  if (command[0] == Config.getPrefix()) {
    const messageArr = command.substring(1).split(" ");
    command = messageArr[0].toLocaleLowerCase();
    console.log("Running command " + command);
    command = commands[messageArr[0].toLocaleLowerCase()];
    if (command) {
      command.onMessage(message);
    }
  } else {
    client.imsgUserData.ensure(message.getRecipientId(), {
      channel: ""
    });
    const channel = client.channels.find(
      channel =>
        channel.id ==
        client.imsgUserData.get(message.getRecipientId(), "channel")
    );
    if (channel) {
      const botMember = channel.guild.members.find(
        member => member.id == client.user.id
      );

      const acc = client.imsgDiscordLink.find(accounts =>
        accounts.imsgAccounts.find(acc => acc == message.getRecipientId())
      );

      const discordAcc = await client.fetchUser(acc.user);

      console.log(discordAcc);

      const embed = new Discord.RichEmbed()
        .setAuthor(
          discordAcc
            ? discordAcc.username + "#" + discordAcc.discriminator
            : message.getRecipientId(),
          discordAcc.avatarURL
            ? discordAcc.avatarURL
            : "https://i.imgur.com/lm8s41J.png"
        )
        /*
         * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
         */
        .setColor(0x00ae86)
        .setDescription(message.content);
      channel.send({ embed });
    }
  }
};

var imMessage = {
  init() {
    setInterval(() => {
      im.getDb((err, db) => {
        const query = `SELECT * FROM message WHERE message.is_from_me = 0 AND message.type = 0 AND message.text IS NOT NULL ORDER BY message.ROWID DESC LIMIT 1;`;

        db.get(query, (err, row) => {
          if (err) {
            console.error("ah shit, here we go again.", err);
          }
          if (prevRowId == -1) {
            prevRowId = row.ROWID;
            return;
          }
          if (prevRowId != row.ROWID) {
            console.log("New message found!");
            console.log(`ID: ${row.ROWID}\nText: ${row.text}`);
            prevRowId = row.ROWID;
            im.getRecipientById(row.handle_id, (err, recipient) => {
              const message = new Message(recipient, row.text);
              handleCommand(message);
            });
          }
        });
      });
    }, 1000);
  }
};

export default imMessage;
