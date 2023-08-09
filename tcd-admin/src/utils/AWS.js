const AWS = require('aws-sdk');
const fs = require('fs');
const fsProm = require('fs').promises;
const sharp = require('sharp')
const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_REGION_NAME, AWS_BUCKET } = process.env
const s3Credentials = {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION_NAME
}

AWS.config.update(s3Credentials);
const s3 = new AWS.S3(s3Credentials.region);
const textract = new AWS.Textract({region: 'us-west-2'});

//upload in s3 bucket
const s3Upload = async (data) => {
    const fileStream = fs.createReadStream(data.file.path);
    const uploadingModule = await findModule(data);
    const uploadParams = {
        Bucket: AWS_BUCKET,
        Body: '',
        // Body: fileStream,
        Key: 'tcd-admin/' + uploadingModule + '/' + data.file.filename,
    };

    if (data.imagePath && data.width && data.height) {
        const imgResize = await imageResize(data.imagePath, data.width, data.height);
        if (imgResize)
            uploadParams.Body = imgResize;
    } else
        uploadParams.Body = fileStream;

    return s3.upload(uploadParams).promise();
}
// remove from s3
const s3Remove = async (removeObj) => {
    const removeModule = await findModule(removeObj);
    const removeParams = {
        Bucket: AWS_BUCKET,
        Key: 'tcd-admin/' + removeModule + '/' + removeObj.imgName
    };

    return s3.deleteObject(removeParams).promise();
}
//copy object from 1 folder to another in s3
const s3CopyObject = async (copyObj) => {
    const copyModule = await findModule(copyObj);
    const moveModule = await findMoveModule(copyObj);
    var params = {
        Bucket: AWS_BUCKET,
        CopySource: AWS_BUCKET + '/tcd-admin/' + copyModule + '/' + copyObj.imgName,
        Key: 'tcd-admin/' + moveModule + '/' + copyObj.imgName
    };
    s3.copyObject(params, function (err, res) {
        if (res)
            s3Remove(copyObj);
    });
}
//image resize function
const imageResize = async (imgPath, imgWidth, imgHeight) => {
    let imgBuffer;
    await sharp(imgPath)
        .toBuffer()
        .then(buffer => {
            imgBuffer = buffer;
        });
    return imgBuffer;
}
// find module in which image uploaded
const findModule = async (data) => {
    let type = data.type;
    let videoType = data.videoType ? data.videoType : '';
    if (type === 'activity_image' || type === 'activity_icon') {
        return 'activity';
    } else if (type === 'effect_image' || type === 'effect_icon') {
        return 'effect';
    } else if (type === 'symptom_image' || type === 'symptom_icon') {
        return 'symptom';
    } else if (type === 'condition_image' || type === 'condition_icon') {
        return 'condition';
    } else if (type === 'article_image') {
        return 'article';
    } else if (type === 'method_icon') {
        return 'method';
    } else if (type === 'coa_image') {
        return 'coa';
    } else if (type === 'composition_image') {
        return 'composition';
    } else if (type === 'cms_image') {
        return 'cms';
    } else if (type === 'product_image') {
        return 'product';
    } else if (type === 'stat_file') {
        return 'statistics';
    } else if (type === 'profile_image') {
        return 'profile_image';
    } else if (type === 'coaparser') {
        return 'coaparser';
    } else if (type == 'video_url') {
        return 'video/' + videoType;
    } else if (type == 'video_thumb_image') {
        return 'video_thumb_image/' + videoType;
    } else if (type == 'entourage_image') {
        return 'entourage/' + videoType;
    }
}
// find module in which image moved
const findMoveModule = async (data) => {
    let type = data.type;
    let videoType = data.newType ? data.newType : '';
    if (type == 'video_url')
        return 'video/' + videoType;
    else if (type == 'video_thumb_image')
        return 'video_thumb_image/' + videoType;
}

//upload in s3 bucket
const s3UploadToTextractBucket = async (data) => {
    const fileStream = fs.createReadStream(data.file.path);
    const uploadParams = {
        Bucket: 'tcd-coaparser',
        Body: '',
        // Body: fileStream,
        Key: data.file.filename,
        contentType : 'application/pdf'
    };

    uploadParams.Body = fileStream;

    return s3.upload(uploadParams).promise();
}

const s3UploadtexTrack = async (imagedata) => {
    try{
        const data = await fsProm.readFile(imagedata.localpath+imagedata.filename, 'binary');
        //const data = await fsProm.createReadStream(imagedata.path);
        var dataBuffer = Buffer(data, 'binary');
        const params = {
            Bucket: 'tcd-coaparser', // pass your bucket name
            Key: imagedata.filename, // file will be saved as testBucket/03-01 GHFSSH0301AA.pdf
            Body: dataBuffer,
            contentType : 'application/pdf'
        };
        const uploadTos3 = await s3.upload(params).promise();
        if (!!uploadTos3) {
            const processFile = awsTextTract(imagedata.filename);
            return processFile;
        }
    } catch(e) {
        return {success: false, message: e}
    }

    //return s3.upload(uploadParams).promise();
}

// aws textract parse pdf/image
const awsTextTract = async (filename) => {

    var detectParameter = {
        DocumentLocation: {
            S3Object: {
                Bucket: "tcd-coaparser",
                Name: filename
            }
        },
        FeatureTypes: [
            "TABLES",
            "FORMS"
        ],
    }

    try {
        console.log('Processing '+ filename);
        let data = await textract.startDocumentAnalysis(detectParameter).promise();

        var analysisParams = {
            JobId: data.JobId
        };
        console.log('Starting Analysis.');

        let dataResult = await textract.getDocumentAnalysis(analysisParams).promise();

        console.log('Gathering Data.');
        return {success: true, JobId: data.JobId, JobStatus: dataResult.JobStatus};
    } catch(e) {
        return {success: false, message: e};
    }
}

const awsTextTractJobProcess = async (id) => { 
    try {
        var analysisParams = {
            JobId: id
        };

        let dataResult = await textract.getDocumentAnalysis(analysisParams).promise();

        return dataResult;

    } catch (e) {
        return e;
    }
}

module.exports = {
    s3Upload,
    s3Remove,
    s3CopyObject,
    s3UploadtexTrack,
    awsTextTract,
    s3UploadToTextractBucket,
    awsTextTractJobProcess
}