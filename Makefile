run:
	node ./src/app.js 
delete-commands:
	node ./src/delete-commands.js
refresh-commands:
	node ./src/deploy-commands.js
refresh-db:
	node ./db/dbInit.js -f
run-dev:
	nodemon ./src/app.js