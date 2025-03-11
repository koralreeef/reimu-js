// Authenticate via API Key
const tumblr = require("tumblr.js");
const { tumblrToken } = require("../../config.json");
const client = tumblr.createClient({ consumer_key: tumblrToken });
const { tumblrPosts } = require("../db/dbObjects.js");
const { Events } = require("discord.js");

const uuid = "t:FqeYngk0IwriwYGW7p0Rrg"; //lovelessdagger.tumblr.com
const tag = "chocolate milk and cookies";
const nation = "934259899435745292";
// const nation2 = "1281401565571452979";

// Make the request
async function go(channel) {
  var response = await client.blogPosts(uuid, {
    type: "photo",
    tag: tag,
    limit: 1,
  });
  const posted = await tumblrPosts.findOne({
    where: { postID: response.posts[0].id },
  });
  //console.log(posted)
  if (posted === null) {
    const tpmblr = response.posts[0].post_url.replace("tumblr", "tpmblr");
    await channel.send(
      tpmblr + "\nnew socmed au holy fucking shit <@109299841519099904>",
    );
    await tumblrPosts.create({
      postID: response.posts[0].id,
    });
    console.log("created post " + response.posts[0].id);
  } else {
    console.log("already found " + response.posts[0].id + ", skipping...");
  }
}

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    const channel = client.channels.cache.get(nation);
    setInterval(async () => {
      await go(channel);
    }, 900_000);
    console.log(`finding tumblr posts tagged as ${tag} every 15 minutes`);
  },
};
