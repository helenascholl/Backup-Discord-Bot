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

async function createFolder(name, parent, role) {
    const res = await drive.files.create({
        resource: {
            name: name,
            mimeType: 'application/vnd.google-apps.folder',
            parents: parent ? [ parent ] : []
        },
        fields: 'id, webViewLink'
    });

    drive.permissions.create({
        fileId: res.data.id,
        requestBody: {
            role: role,
            type: 'anyone'
        }
    });

    return {
        id: res.data.id,
        shareLink: res.data.webViewLink
    };
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
    const res = await drive.files.list({ q: queryString, fields: 'files(id, parents, webViewLink)' });

    if (parent) {
        const files = res.data.files.filter(f => f.parents.includes(parent));

        return files[0] ? {
            id: files[0].id,
            shareLink: files[0].webViewLink
        } : null;
    }

    return res.data.files[0] ? {
        id: res.data.files[0].id,
        shareLink: res.data.files[0].webViewLink
    } : null;
}

module.exports.createFolder = createFolder;
module.exports.uploadFile = uploadFile;
module.exports.findFolder = findFolder;
