const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "helpall",
  aliases: ["allcmd", "allcommands"],
  version: "2.0.0",
  hasPermssion: 0,
  credits: "হৃদয় হাসান শান্ত",
  description: "Displays all available commands in one stylish page",
  commandCategory: "system",
  usages: "[No args]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;

  const allCommands = [];

  for (const [name] of commands) {
    if (name && name.trim() !== "") {
      allCommands.push(name.trim());
    }
  }

  // Sort commands alphabetically
  allCommands.sort((a, b) => a.localeCompare(b));

  const botName =
    global.config?.BOTNAME ||
    global.config?.botName ||
    "HRIDOY BOT";

  const finalText = `
╭━━━〔 💠 𝐀𝐒𝐈𝐅 𝐁𝐎𝐓 💠 〕━━━╮
┃
┃  👑 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓
┃  ─────────────────
┃
${allCommands.map((cmd, index) =>
    `┃  ${String(index + 1).padStart(2, "0")} ➜ ${cmd}`
  ).join("\n")}
┃
┣━━━━━━━━━━━━━━━━━━━━
┃  🤖 𝐁𝐎𝐓 : ${botName}
┃  👑 𝐎𝐖𝐍𝐄𝐑 : Asif Xhowdary
┃  📦 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 : ${allCommands.length}
┃  ⚡ 𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : 𝐕𝟐. 𝟎
┃
╰━━━〔 💫 𝐀𝐒𝐈𝐅 𝐗𝐇𝐎𝐖𝐃𝐀𝐑𝐘 💫 〕━━━╯
`;

  // Background image
  const selectedBg = "https://i.imgur.com/any2url.com/item/7P8gRNG9TV.jpeg";

  const cacheDir = __dirname + "/cache";

  // Create cache folder if missing
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const imgPath = cacheDir + "/helpallbg.jpg";

  const callback = () => {
    api.sendMessage(
      {
        body: finalText.trim(),
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => {
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      },
      messageID
    );
  };

  request
    .get(encodeURI(selectedBg))
    .on("error", (err) => {
      console.error("❌ HelpAll Image Error:", err);

      // Send text even if image download fails
      api.sendMessage(
        finalText.trim(),
        threadID,
        null,
        messageID
      );
    })
    .pipe(fs.createWriteStream(imgPath))
    .on("close", callback);
};
