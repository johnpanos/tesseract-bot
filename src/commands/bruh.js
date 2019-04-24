import Command from "../command";

class Bruh extends Command {
  constructor() {
    super("bruh", "bruh");
  }

  onMessage(message) {
    var vc = message.member.voiceChannel;
    if (!vc)
      return message.reply("lmao dumbass you're not in in a voice channel");
    vc.join()
      .then(connection => {
        setTimeout(() => {
          const dispatcher = connection.playFile(
            "C:/Users/John/Desktop/dev/CockBot/src/static/bruh.mp3",
            { volume: 1, passes: 5 }
          );

          dispatcher.on("end", end => {
            setTimeout(() => {
              vc.leave();
            }, 1000);
          });
        }, 500);
      })
      .catch(console.error);
  }
}

export default new Bruh();
