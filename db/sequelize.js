// Require Sequelize
const Sequelize = require('sequelize');
// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('c:/Users/12098/discord-bot/config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

/*
 * equivalent to: CREATE TABLE tags(
 * name VARCHAR(255) UNIQUE,
 * description TEXT,
 * username VARCHAR(255),
 * usage_count  INT NOT NULL DEFAULT 0
 * );
 */
const Tags = sequelize.define('tags', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: Sequelize.TEXT,
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, readyClient => {
    Tags.sync();
	console.log(`Initializing database as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
	if (commandName === 'pookiebear') {
		const tagName = interaction.options.getString('name');
		const tagDescription = interaction.options.getString('link');

		try {
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			const tag = await Tags.create({
				name: tagName,
				description: tagDescription,
				username: interaction.user.username,
			});

			return interaction.reply(`pookiebear ${tag.name} added.`);
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('That pookiebear already exists.');
			}

			return interaction.reply('Something went wrong with adding a tag.');
		}
	}

    else if (commandName === 'tag') {
        const tagName = interaction.options.getString('name');
    
        // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
        const tag = await Tags.findOne({ where: { name: tagName } });
    
        if (tag) {
            // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
            tag.increment('usage_count');
    
            return interaction.reply(tag.get('description'));
        }
    
        return interaction.reply(`Could not find tag: ${tagName}`);
    }

    else if (commandName === 'edittag') {
        const tagName = interaction.options.getString('name');
        const tagDescription = interaction.options.getString('description');
    
        // equivalent to: UPDATE tags (description) values (?) WHERE name='?';
        const affectedRows = await Tags.update({ description: tagDescription }, { where: { name: tagName } });
    
        if (affectedRows > 0) {
            return interaction.reply(`Tag ${tagName} was edited.`);
        }
    
        return interaction.reply(`Could not find a tag with name ${tagName}.`);
    }

    else if (commandName == 'pookieinfo') {
        const tagName = interaction.options.getString('name');
    
        // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
        const tag = await Tags.findOne({ where: { name: tagName } });
    
        if (tag) {
            return interaction.reply(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.\n ${tag.description}`);
        }
    
        return interaction.reply(`Could not find tag: ${tagName}`);
    }

    else if (commandName === 'gallery') { //formerly showtags
        // equivalent to: SELECT name FROM tags;
        const tagList = await Tags.findAll({ attributes: ['name'] });
        const tagString = tagList.map(t => t.name).join(', ') || 'No pookiebears found.';
    
        return interaction.reply(`List of tags: ${tagString}`);
    }

    else if (commandName === 'deletetag') {
        const tagName = interaction.options.getString('name');
        // equivalent to: DELETE from tags WHERE name = ?;
        const rowCount = await Tags.destroy({ where: { name: tagName } });
    
        if (!rowCount) return interaction.reply('That tag doesn\'t exist.');
    
        return interaction.reply('Tag deleted.');
    }

    else {
        return
    }
});

// Login to Discord with your client's token
client.login(token);

//https://discordjs.guide/sequelize/#creating-the-model