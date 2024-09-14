const Sequelize = require("sequelize");
const fs = require("fs");
const { sleep } = require("./../helper.js");
const sequelize = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "database.sqlite",
});
const Pookiebears = require("./models/pookiebears.js")(sequelize, Sequelize.DataTypes);
function moveImage(image, destination) {
    // destination will be created or overwritten by default.
    fs.copyFile("./baseImages" + image, destination + image, (err) => {
        if (err)
            throw err;
        console.log("copied image to " + destination);
    });
}
const force = process.argv.includes("--force") || process.argv.includes("-f");
sequelize
    .sync({ force })
    .then(async () => {
    fs.rm("./images", { recursive: true, force: true }, (err) => {
        if (err) {
            throw err;
        }
        console.log("previous image folder deleted");
    });
    console.log("waiting for folder to be deleted....");
    await sleep(1500);
    console.log("done");
    await fs.mkdirSync("./images");
    moveImage("/pookiebear1.jpg", "./images");
    moveImage("/pookiebear2.jpg", "./images");
    moveImage("/pookiebear3.jpg", "./images");
    const pookies = [
        Pookiebears.upsert({
            id: 1,
            pookie_name: "lappy",
            file_path: "./images/pookiebear1.jpg",
            creator: "koral",
            creatorURL: "https://cdn.discordapp.com/avatars/109299841519099904/588b0dfa2e47bdd3325730eb76bad246.webp",
            summon_count: 0,
            rarity: 0,
            source: "no source listed",
        }),
        Pookiebears.upsert({
            id: 2,
            pookie_name: "lappy ssr",
            file_path: "./images/pookiebear1.jpg",
            creator: "koral",
            creatorURL: "https://cdn.discordapp.com/avatars/109299841519099904/588b0dfa2e47bdd3325730eb76bad246.webp",
            summon_count: 0,
            rarity: 100,
            source: "no source listed",
        }),
        Pookiebears.upsert({
            id: 3,
            pookie_name: "jill stingray",
            file_path: "./images/pookiebear3.jpg",
            creator: "koral",
            creatorURL: "https://cdn.discordapp.com/avatars/109299841519099904/588b0dfa2e47bdd3325730eb76bad246.webp",
            summon_count: 0,
            rarity: 0,
            source: "[source](https://x.com/danidanihatikyu/status/1450170022563758080)",
        }),
        Pookiebears.upsert({
            id: 4,
            pookie_name: "jill stingray ssr",
            file_path: "./images/pookiebear3.jpg",
            creator: "koral",
            creatorURL: "https://cdn.discordapp.com/avatars/109299841519099904/588b0dfa2e47bdd3325730eb76bad246.webp",
            summon_count: 0,
            rarity: 100,
            source: "[source](https://x.com/danidanihatikyu/status/1450170022563758080)",
        }),
        /*
              Users.upsert({ user_id: 1271933270451552317,
                  balance: 0,
                  lifetime: 0,
                  favoritePookie: "reimu",
                  location: "gensokyo",
                  questTier: 10,
                  questLifetime: 19,
              })
              */
    ];
    await Promise.all(pookies);
    console.log("Database synced");
    sequelize.close();
})
    .catch(console.error);
