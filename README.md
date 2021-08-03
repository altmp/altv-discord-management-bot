# alt:V Discord Bot

**What?**

This is the public bot for alt:V that helps manage the server.

**Configuration**

This uses environment variables. You either use a `.env` file or pass environment variables in. Here is the current config.

```
DATABASE_URL=''
DATABASE_NAME=''
DISCORD_BOT_TOKEN=''
PREFIX=''
```

Make sure when you make a discord bot that you turn on all **user intent options in developer settings.**

**Deployment**

You need NodeJS 14+

You need a Discord Bot Token

You need a standalone MongoDB Server

```
npm install
npm run
```

**Development**

```
npm run dev
```
