const { Users } = require('../db/dbObjects.js');
const { setTotalPookies, getTotalPookies } = require('../helper.js');
const { ActivityType } = require('discord.js');
const { Events } = require('discord.js');

async function sumTotal(){
    let sum = 0;
		const users = await Users.findAll();
        
        for(let i = 0; i < users.length; i++)
            {
                const initialValue = 0;
                let user = users[i];
                let pookies = await user.getPookies(user.user_id);
                let map = pookies.map(i => i.amount);
                let sumWithInitial = map.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                initialValue,
                );
                sum = sum + sumWithInitial;
            }
    return sum;
}
module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
	
        setTotalPookies(await sumTotal());
    
        client.user.setActivity('activity', { type: ActivityType.Custom, name: "custom", state: getTotalPookies()+" pookies down in the fantastic blowhole"});
        console.log(getTotalPookies()+" pookies logged on startup.");
		//check if pookies arent same
		setInterval(async () => {
            let newsum = await sumTotal();
            if(newsum != getTotalPookies())
            {
                setTotalPookies(newsum);
                client.user.setActivity('activity', { type: ActivityType.Custom, name: "custom", state: getTotalPookies()+" pookies down in the fantastic blowhole"});
            }

		}, 300000);
    },
};
