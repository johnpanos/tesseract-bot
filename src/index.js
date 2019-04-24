import * as Discord from "discord.js";
import Config from "./config";
import CommandLoader from "./loader";

const client = new Discord.Client();
const commands = CommandLoader.loadCommands();

const initCommands = async () => {
  for (var key in commands) {
    const command = commands[key];
    command.onLoad();
  }
};

client.on("ready", async () => {
  await initCommands();
  console.log(`Logged in as ${client.user.tag}!`);

  setInterval(() => {
    const beforeDarkChannel = client.channels.get(beforeDarkId);
    const afterDarkChannel = client.channels.get(afterDarkId);
    const lateNightChannel = client.channels.get(lateNightId);

    if (beforeDarkChannel) {
      beforeDarkChannel.members.map(member => {
        handleVoiceTransfer(member);
      });
    }

    if (afterDarkChannel) {
      afterDarkChannel.members.map(member => {
        handleVoiceTransfer(member);
      });
    }

    if (lateNightChannel) {
      lateNightChannel.members.map(member => {
        handleVoiceTransfer(member);
      });
    }
  }, 30000);
});

client.on("message", msg => {
  if (msg.content[0] == Config.getPrefix()) {
    const messageArr = msg.content.substring(1).split(" ");
    const command = commands[messageArr[0].toLocaleLowerCase()];
    if (command) {
      command.onMessage(msg);
    }
  }
});

const beforeDarkId = "566664834343632922";
const afterDarkId = "460567307685462037";
const lateNightId = "566512008866955274";

const handleVoiceTransfer = newMember => {
  let newUserChannel = newMember.voiceChannel;

  if (
    newUserChannel.id == beforeDarkId ||
    newUserChannel.id == afterDarkId ||
    newUserChannel.id == lateNightId
  ) {
    // User Joins a voice channel
    var today = new Date();
    var time = today.getHours();

    var requestedId = "";

    if (time <= 5) {
      requestedId = lateNightId;
    } else if (time > 5 && time < 20) {
      requestedId = beforeDarkId;
    } else {
      requestedId = afterDarkId;
    }

    const requestedChannel = client.channels.get(requestedId);

    if (requestedId != newUserChannel.id) {
      console.log(
        `Moving ${newMember.nickname} (${newMember.user.tag}) to ${
          requestedChannel.name
        }`
      );
      newMember.setVoiceChannel(requestedChannel);
    }
  }
};

client.on("voiceStateUpdate", (oldMember, newMember) => {
  let newUserChannel = newMember.voiceChannel;
  let oldUserChannel = oldMember.voiceChannel;
  if (newUserChannel !== undefined) {
    handleVoiceTransfer(newMember);
  }
});

client.login(Config.getToken());