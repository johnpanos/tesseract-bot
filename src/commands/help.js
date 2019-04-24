import Command from "../command";

class Help extends Command {
  constructor() {
    super("help", "Help sends help!");
  }

  onMessage(message) {
    message.reply("fuck");
  }
}

export default new Help();
