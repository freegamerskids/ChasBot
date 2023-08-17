# ChasBot
a general-purpose discord bot

## Installing
***You need to have Node.js 16.9.0 or later to run this bot***

After that, it's really simple. Just one command:
```
npm i
```

## Configuring and setting up
1. Rename `config.example.json` to `config.json` and set the variables as you like to
2. Install [MongoDB](https://www.mongodb.com/docs/manual/installation) and configure the `database` variables in your `config.json`

## Running
This bot comes with a start command:
```
npm run start
```

## Updating
**IMPORTANT:** If you changed the action config or any other config in the `src` folder, make sure to make a backup before making this change.

### Automatically
Run the `update.(sh/ps1)` according to your OS. 

`update.sh` => Linux distributions or UNIX (MacOS)

`update.ps1` => Windows (Powershell)

### Manually
Download the `update.zip` in the [latest release](https://github.com/freegamerskids/ChasBot/releases/latest), unpack the zip file and replace files in your project folder with the new ones in the zip file.

After that, type this in the command line:
```
npm i
```

And you're ready to start your bot!

## Migrating to MongoDB
Since version 2.3.0, ChasBot uses [MongoDB](https://www.mongodb.com/) as the database for saving guild settings, timezones, etc.
If you've been using ChasBot before 2.3.0 (2.1.2 or older), please [install MongoDB](https://www.mongodb.com/docs/manual/installation),
configure the `database` variables in `config.json` and run this command:
```
npm run db-migrate
```

After that you'll be ready to go and start using ChasBot again!