# Backup-Discord-Bot

Automatically back up images in Discord channels to Google Drive.

## Invite the bot

https://discordapp.com/oauth2/authorize?&client_id=816259244587221022&scope=bot

## For Developers

### Create a Discord Application

If you want to run the bot yourself, [create a new Discord Bot](https://discordapp.com/developers/docs/intro#bots-and-apps) and copy the token into  `.env` (do not commit this file).

### Create a Google Service Account

 - [Create a Service Account](https://cloud.google.com/iam/docs/creating-managing-service-accounts)
 - [Create a Service Account Key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)
 - Save the key as `credentials.json` in your project root (do not commit this file)
 - Share the Google Drive folder you want to back up your images to with the service account (The email address looks like this: sa-name@project-id.iam.gserviceaccount.com)

### Configure the Bot

All the configuration for your bot is done in `config.json`:
 - `rootFolder`: The folder containing all the folders with the backups of your channels
 - `channel.id`: [The ID of a Discord text channel](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)
 - `channel.backupFolder`: The name of the folder to contain the backups of the specified channel (If the folder doesn't exist yet, the bot will create it)

### Start the Bot

```shell
docker-compose up -d
```
