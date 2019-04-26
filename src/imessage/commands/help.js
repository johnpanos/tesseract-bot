import CommandLoader from "../loader";
import Command from "../../command";
import Config from "../../config";

class Help extends Command {
  constructor() {
    super("help", "Shows this message");
  }

  onMessage(message) {
    let reply = "";

    for (var key in this.commands) {
      const command = this.commands[key];
      reply += `${Config.getPrefix()}${command.getCommand()}: ${command.getHelp()}\n\n`;
    }

    message.sendMessage(reply);
  }

  onLoad() {
    this.commands = CommandLoader.loadCommands();
  }
}

export default new Help();
