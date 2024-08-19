run:
	node app.js 
delete-commands:
	node delete-commands.js
refresh-commands:
	node deploy-commands.js
refresh-db:
	node ./db/dbInit.js -f
