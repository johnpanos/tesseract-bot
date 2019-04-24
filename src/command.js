class Command {
  constructor(command, help) {
    this.command = command;
    this.help = help;
  }

  getCommand() {
    return this.command;
  }

  getHelp() {
    return this.help;
  }

  onLoad() {
    console.log(`Loaded ${this.command}`);
  }

  onMessage() {
    console.log(`Please override this method! (${this.command})`);
  }
}

export default Command;
