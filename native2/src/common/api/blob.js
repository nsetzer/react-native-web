

import RNFetchBlob from 'rn-fetch-blob'
// params.location: fs.dirs.MusicDir  + '/yue/' + file_name

export function downloadFile(url, headers={}, params={}, success=null, failure=null, progress=null) {
    console.log("downloading: " + url)
    RNFetchBlob.config({
        fileCache : true,
        path : params.location
    })
   .fetch('GET', url, headers)
   .progress({ interval: 333 }, (received,total)=>{
            progress && progress({
                bytesTransfered: received,
                fileSize: total,
            })
    })
   .then((result) => {
        //RNFetchBlob.fs.scanFile([ { path : result.path(), mime : result.respInfo.headers['Content-Type'] } ])

        RNFetchBlob.fs.exists(result.path())
        .then((exist) => {
            success && success(result)
        })
        .catch(() => { failure && failure({result, reason: "file not found"}) })

   })
   .catch((error, statusCode) => {
        console.log(error)
        console.log(statusCode)
        failure && failure(error)
    })

}

export function uploadFile(urlbase, headers={}, params={}, success=null, failure=null, progress=null) {

}

export const dirs = RNFetchBlob.fs.dirs

export default {
    downloadFile,
    uploadFile,
    dirs
}