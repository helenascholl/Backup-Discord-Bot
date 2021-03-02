const Discord = require('discord.js');
const got = require('got');

const driveApi = require('./src/driveApi');

const config = require('./config.json');

const imageFileExtensions = [ 'png', 'jpg', 'jpeg' ];
const mimeTypes = [
    {
        mimeType: 'image/jpeg',
        fileExtensions: [ 'jpg', 'jpeg' ]
    },
    {
        mimeType: 'image/png',
        fileExtensions: [ 'png' ]
    }
];

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', message => {
    if (config.channels.map(c => c.id).includes(message.channel.id)) {
        const image = getImage(message);

        if (image) {
            const folderId = config.channels.find(c => c.id === message.channel.id).backupFolderId;
            const mimeType = mimeTypes
                .find(mt => mt.fileExtensions.includes(image.filename.split('.').pop()))
                .mimeType;

            console.log(`Uploading file ${image.filename}`);
            driveApi.uploadFile(image.filename, folderId, mimeType, got.stream(image.url));
        }
    }
});

initGoogleDrive()
    .then(startClient);

async function initGoogleDrive() {
    const rootFolderId = await driveApi.findFolder(config.rootFolder);

    for (const channel of config.channels) {
        const folderId = await driveApi.findFolder(channel.backupFolder, rootFolderId);

        if (folderId) {
            console.log(`Folder ${channel.backupFolder} already exists`);
            channel.backupFolderId = folderId;
        } else {
            console.log(`Creating folder ${channel.backupFolder}`);
            channel.backupFolderId = await driveApi.createFolder(channel.backupFolder, rootFolderId);
        }
    }
}

async function findOrCreateFolder(name, parent, role) {
    let folder = await driveApi.findFolder(name, parent);

    if (folder) {
        console.log(`Folder '${name}' already exists: ${folder.shareLink}`);
        return folder;
    }

    folder = await driveApi.createFolder(name, parent, role);
    console.log(`Created folder '${name}': ${folder.shareLink}`);

    return folder;
}

function startClient() {
    client.login(process.env['DISCORD_TOKEN']).catch(console.error);
}

function getImage(message) {
    for (const attachment of message.attachments) {
        for (const imageFileExtension of imageFileExtensions) {
            if (attachment[1].url.endsWith(imageFileExtension)) {
                return {
                    filename: attachment[1].name,
                    url: attachment[1].url
                }
            }
        }
    }

    for (const embed of message.embeds) {
        if (embed.type === 'image') {
            return {
                filename: embed.url.split('/').pop(),
                url: embed.url
            }
        }
    }

    return false;
}
