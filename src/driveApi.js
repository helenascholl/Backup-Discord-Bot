const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');

const SCOPES = [ 'https://www.googleapis.com/auth/drive.file' ];

const drive = google.drive({
    version: 'v3',
    auth: getAuthClient()
});

function getAuthClient() {
    return new GoogleAuth({
        scopes: SCOPES
    });
}

async function createFolder(name, parent) {
    const res = await drive.files.create({
        resource: {
            name: name,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [ parent ]
        }
    });

    return res.data.id;
}

async function uploadFile(filename, parent, mimeType, readStream) {
    const res = await drive.files.create({
        resource: {
            name: filename,
            parents: [ parent ]
        },
        media: {
            mimeType: mimeType,
            body: readStream
        }
    });

    return res.data.id;
}

async function findFolder(name, parent) {
    const queryString = `mimeType = 'application/vnd.google-apps.folder' and name = '${name}'`;
    const res = await drive.files.list({ q: queryString, fields: 'files(id, parents)' });

    if (parent) {
        const files = res.data.files.filter(f => f.parents.includes(parent));
        return files[0] ? files[0].id : null;
    }

    return res.data.files[0] ? res.data.files[0].id : null;
}

module.exports.createFolder = createFolder;
module.exports.uploadFile = uploadFile;
module.exports.findFolder = findFolder;
