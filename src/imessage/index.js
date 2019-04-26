import iMessage from "imessage";
import Config from "../config";
import Message from "./models/Message";

const im = new iMessage();

var prevRowId = -1;

var subscribedGuilds = {};

const commands = {
  debug(message) {
    message.sendMessage(`
${message.getRecipientId()}

Current Guild: ${message.getUserData().guild}
    `);
  },

  listguilds(message) {
    const client = message.getDiscordClient();
    console.log(client.guilds);
    const guildString = client.guilds
      .map(guilds => {
        return guilds.name + ": " + guilds.id;
      })
      .join("\n");
    console.log(guildString);
    message.sendMessage(guildString);
  },

  subscribe(message) {
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

      client.imsgSubscribedGuilds.ensure(guild.id, []);

      if (
        client.imsgSubscribedGuilds
          .get(guild.id)
          .find(id => id == message.getRecipientId()) != null
      ) {
        message.sendMessage(`You are already subscribed to ${guild.name}!`);
      } else {
        client.imsgSubscribedGuilds.push(guild.id, message.getRecipientId());
        message.sendMessage(`Subscribed to ${guild.name}!`);
      }
    }
  },

  unsubscribe(message) {
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

      client.imsgSubscribedGuilds.ensure(guild.id, []);

      if (
        client.imsgSubscribedGuilds
          .get(guild.id)
          .find(id => id == message.getRecipientId()) == null
      ) {
        message.sendMessage(`You were not subscribed to ${guild.name}!`);
      } else {
        client.imsgSubscribedGuilds.remove(guild.id, message.getRecipientId());
        message.sendMessage(`Unsubscribed to ${guild.name}!`);
      }
    }
  },

  listchannels(message) {
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

      message.sendMessage("Listing channels for guild: " + guild.name);
      guild.channels.map(channel => {
        if (channel.type == "text") {
          message.sendMessage(`${channel.name}: ${channel.id}`);
        }
      });
    } else {
      message.sendMessage(
        "Please enter in a valid guild to see available channels, use listguilds to see available guilds."
      );
    }
  },

  setchannel(message) {
    const client = message.getDiscordClient();

    var channel = null;

    console.log(message.content.split(" ")[1]);

    if (
      (channel = client.channels.find(
        channel => channel.id == message.content.split(" ")[1]
      )) != null
    ) {
      client.imsgUserData.set(
        message.getRecipientId(),
        channel.id,
        "channel"
      );
      message.sendMessage(
        `Subscribed to channel ${
          channel.name
        }. Every message you send will now be sent to this channel.`
      );
    } else {
      message.sendMessage("Channel not found.");
    }
  },

  setguild(message) {
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
        client.imsgUserData
          .get(message.getRecipientId(), "guild") == guild.id
      ) {
        message.sendMessage(`Your current guild is already set to "${guild.name}"`);
      } else {
        client.imsgUserData.set(message.getRecipientId(), guild.id, 'guild');
        message.sendMessage(`Currnet guild set to "${guild.name}"`);
      }
    } else {
      message.sendMessage(`No guild found with name or id: "${payload}"`);
    }
  }
};

const handleCommand = message => {
  const recipient = message.getRecipient();
  var command = message.getContent();
  if (command[0] == Config.getPrefix()) {
    const messageArr = command.substring(1).split(" ");
    command = messageArr[0].toLocaleLowerCase();
    console.log("Running command " + command);
    if (commands[command]) {
      commands[command](message);
    }
  } else {
    message.getDiscordClient().imsgUserData.ensure(
      message.getRecipientId(),
      {
        channel: ''
      }
    );
    const channel = message
      .getDiscordClient()
      .channels.find(
        channel =>
          channel.id ==
          message
            .getDiscordClient()
            .imsgUserData.get(message.getRecipientId(), "channel")
      );
    console.log(channel);
    if (channel) {
      channel.send(`${message.getRecipientId()}: ${message.content}`);
    }
  }
};

var imMessage = {
  subscribedGuilds: subscribedGuilds,
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
