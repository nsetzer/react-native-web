
export const mock_api = !!process.env.REACT_APP_MOCK_API;

const api = mock_api?require('./api_mock'):require('./api');

export const env = api.env

export const authenticate = api.authenticate
export const validate_token = api.validate_token
export const getPeople = api.getPeople

export const getNotes = api.getNotes
export const getNoteContent = api.getNoteContent
export const saveNote = api.saveNote
export const deleteNote = api.deleteNote

export const fsGetPath = api.fsGetPath

export const libraryGetSong = api.libraryGetSong
export const libraryDomainInfo = api.libraryDomainInfo
export const historyIncrementPlaycount = api.historyIncrementPlaycount
export const queueGetSongs = api.queueGetSongs
export const queuePopulate = api.queuePopulate
export const queueCreate = api.queueCreate

export const storageGeneratePublicUri = api.storageGeneratePublicUri
export const storageRevokePublicUri = api.storageRevokePublicUri
export const storagePublicFileInfo = api.storagePublicFileInfo

export const getCurlDocumentation = api.getCurlDocumentation

// ---------------------------------------

function saveBlob(blob, fileName) {
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.dispatchEvent(new MouseEvent('click'));
}

export function downloadFile(url, headers={}, params, success=null, failure=null) {
    var postData = new FormData();

    // https://stackoverflow.com/questions/22724070/
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);

    for (var key in headers) {
        // most common header will be
        //xhr.setRequestHeader('X-YUE-PASSWORD', password);

        xhr.setRequestHeader(key, headers[key]);
    }

    xhr.responseType = 'blob';
    xhr.onload = function (this_, event_) {
        var blob = this_.target.response;

        if (!blob || this_.target.status != 200) {
            if (failure !== null) {
                failure({status: this_.target.status, blob})
            }
        } else {
            // expect the reply from the server to have a header
            // set indicating the name of the resource file
            var contentDispo = xhr.getResponseHeader('Content-Disposition');
            console.log(xhr)

            var fileName;
            // https://stackoverflow.com/a/23054920/
            if (contentDispo !== null) {
                // this string can contain multiple semi-colon separated parts
                // one of those parts could be be 'filename=name;'
                fileName = contentDispo.match(/filename[^;=\\n]*=((['"]).*?\\2|[^;\\n]*)/)[1];
            }

            if (!fileName) {
                console.error("filename not found in xhr request header 'Content-Disposition'")
                // TODO: find a better way to guess the name from url
                // with no header, or not file name in the content header
                //  attempt to guess the name from the url.
                //   scheme://hostname:port/path/to/file?params
                // This may indicate an error with the backend server
                var parts;
                parts = xhr.responseURL.split('/')
                parts = parts[parts.length-1].split('?')

                fileName = parts[0] || 'resource.bin'
            }
            saveBlob(blob, fileName);
            if (success !== null) {
                success({url, fileName, blob})
            }
        }
    }
    xhr.send(postData);
}


function _uploadFileImpl(elem, urlbase, headers={}, params={}, success=null, failure=null, progress=null) {

    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

    var arrayLength = elem.files.length;
    console.log("uploading: " + arrayLength)
    for (var i = 0; i < arrayLength; i++) {
        var file = elem.files[i];
        console.log(file)
        var url;
        if (urlbase.endsWith('/')) {
            url = urlbase + file.name
        } else {
            url = urlbase + '/' + file.name
        }

        if (queryString) {
            url += '?' + queryString
        }

        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);


        for (var key in headers) {
            // most common header will be
            //xhr.setRequestHeader('X-YUE-PASSWORD', password);
            xhr.setRequestHeader(key, headers[key]);
        }

        // TODO: support passing last modified as a header or param?
        // url += '&modified=' + file.lastModified;
        // xhr.setRequestHeader('X-LAST-MODIFIED', file.lastModified);

        xhr.upload.onprogress = function(event) {
            if (event.lengthComputable) {
                if (progress !== null) {
                    progress({
                        bytesTransfered: event.loaded,
                        fileSize: file.size,
                        fileName: file.name,
                        finished: false,
                    })
                }
            }
        }

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (success !== null) {
                    var params={name: file.name, url,
                        lastModified: file.lastModified,
                        size: file.size, type: file.type};
                    success(params)
                    if (progress !== null) {
                        progress({
                            fileSize: file.size,
                            fileName: file.name,
                            finished: true,
                        })
                    }
                }
            } else if(xhr.status >= 400) {
                if (failure !== null) {
                    var params={name: file.name, url, status: xhr.status};
                    failure(params)
                    if (progress !== null) {
                        progress({
                            fileSize: file.size,
                            fileName: file.name,
                            finished: true,
                        })
                    }
                }
            } else {
                console.log("xhr status changed: " + xhr.status)
            }
        };

        if (progress !== null) {
            progress({
                bytesTransfered: 0,
                fileSize: file.size,
                fileName: file.name,
                finished: false,
            })
        }

        var fd = new FormData();
        fd.append('upload', file);
        xhr.send(fd);
    }
}

// construct a hidden form element that allows
// a user to select files. dispatch a mouse
// event to click on this form, opening the upload file dialog
// when the user selects a file dispatch an multi-part form upload

export function uploadFile(urlbase, headers={}, params={}, success=null, failure=null, progress=null) {

    // TODO: Investigate destructor for createElement
    // upload is a rare event but could this be causing
    // some kind of resource leak?

    var element = document.createElement('input');
    element.type = 'file'
    element.hidden = true
    element.onchange = (event) => {_uploadFileImpl(
        element, urlbase, headers, params, success, failure, progress)}
    element.dispatchEvent(new MouseEvent('click'));
}

