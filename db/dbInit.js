const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});
const Tags = require('./models/pookiebears.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');
sequelize.sync({ force }).then(async () => {
	const shop = [
		Tags.upsert({ id: 1,
			name: 'ritsu',
			description: 'https://cdn.discordapp.com/attachments/1273023049221935185/1273722403742285905/image.png?ex=66c04ead&is=66befd2d&hm=2e8e5f0fd1ccd505ad6c57e0bfc692563358b8107e837b95a0fbaa81356f534c&',
			username: 'koral',
			userAvatar: 'https://cdn.discordapp.com/avatars/109299841519099904/588b0dfa2e47bdd3325730eb76bad246.webp',
			usage_count: 0, 
			rarity: "common"}),
		Tags.upsert({ id: 2,
			name: 'ritsu SSR',
			description: 'https://cdn.discordapp.com/attachments/1273023049221935185/1273722403742285905/image.png?ex=66c04ead&is=66befd2d&hm=2e8e5f0fd1ccd505ad6c57e0bfc692563358b8107e837b95a0fbaa81356f534c&',
			username: 'koral',
			userAvatar: 'https://cdn.discordapp.com/avatars/109299841519099904/588b0dfa2e47bdd3325730eb76bad246.webp',
			usage_count: 0, 
			rarity: "SSR"}),
		Tags.upsert({ id: 3,
			name: 'lereimu',
			description: 'https://cdn.discordapp.com/attachments/1272897435932561448/1273851532626100406/emoji.png?ex=66c0c6f0&is=66bf7570&hm=ae062149c625ceac69bc1290f730e267a60bee686f8053ff6f88c98b0a4d92f7&',
			username: 'koral',
			userAvatar: 'https://cdn.discordapp.com/attachments/1273023049221935185/1273722403742285905/image.png?ex=66c04ead&is=66befd2d&hm=2e8e5f0fd1ccd505ad6c57e0bfc692563358b8107e837b95a0fbaa81356f534c&',
			usage_count: 0, 
			rarity: "common"}),
		Tags.upsert({ id: 4,
			name: 'lereimu SSR',
			description: 'https://cdn.discordapp.com/attachments/1273023049221935185/1273722403742285905/image.png?ex=66c04ead&is=66befd2d&hm=2e8e5f0fd1ccd505ad6c57e0bfc692563358b8107e837b95a0fbaa81356f534c&',
			username: 'koral',
			userAvatar: 'https://cdn.discordapp.com/attachments/1273023049221935185/1273722403742285905/image.png?ex=66c04ead&is=66befd2d&hm=2e8e5f0fd1ccd505ad6c57e0bfc692563358b8107e837b95a0fbaa81356f534c&',
			usage_count: 0, 
			rarity: "SSR"}),
	];

	await Promise.all(shop);
	console.log('Database synced');

	sequelize.close();
}).catch(console.error);
