import {
  HttpException,
  HttpStatus,
  Injectable,
  Req,
  Res,
} from '@nestjs/common';
import AWS from 'aws-sdk';
import path from 'path';
import sharp from 'sharp';

@Injectable()
export class AwsService {
  s3Credentials = {
    accessKeyId: process.env.AWSACCESSKEY,
    secretAccessKey: process.env.AWSSECRETACCESSKEY,
    region: process.env.AWSREGIONNAME,
  };

  s3_Bucket = process.env.AWSBUCKET;

  s3 = new AWS.S3({
    accessKeyId: process.env.AWSACCESSKEY,
    secretAccessKey: process.env.AWSSECRETACCESSKEY,
    region: process.env.AWSREGIONNAME,
  });

  textract = new AWS.Textract({ region: 'us-west-2' });

  async awsTextTract(file) {
    const fileName =
      file.fieldname + '-' + Date.now() + path.extname(file.originalname);

    const response = await this.s3_upload(
      file.buffer,
      'tcd-coaparser',
      fileName,
      file.mimetype,
    );

    if (response) {
      const detectParameter = {
        DocumentLocation: {
          S3Object: {
            Bucket: 'tcd-coaparser',
            Name: fileName,
          },
        },
        FeatureTypes: ['TABLES', 'FORMS'],
      };
      try {
        console.log('Processing ' + fileName);

        const data = await this.textract
          .startDocumentAnalysis(detectParameter)
          .promise();

        const analysisParams = {
          JobId: data.JobId,
        };
        console.log('Starting Analysis.');

        const dataResult = await this.textract
          .getDocumentAnalysis(analysisParams)
          .promise();

        console.log('Gathering Data.');
        return {
          success: true,
          JobId: data.JobId,
          JobStatus: dataResult.JobStatus,
        };
      } catch (e) {
        return { success: false, message: e };
      }
    }
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async s3Upload(file) {
    try {
      const uploadingModule = await this.findModule(file);
      const fileName =
        file.file.fieldname +
        '-' +
        Date.now() +
        path.extname(file.file.originalname);

      const uploadParams = {
        Bucket: this.s3_Bucket,
        Body: '',
        // Body: fileStream,
        Key: 'tcd-admin/' + uploadingModule + '/' + fileName,
      };
      if (file.file && file.file.width && file.file.height) {
        const imgResize = await this.imageResize(file.file, file.file.width, file.file.height);
        if (imgResize) uploadParams.Body = imgResize;
      } else uploadParams.Body = file.file.buffer;
      
      return this.s3.upload(uploadParams).promise();
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async s3Remove(removeObj) {
    try {
      const removeModule = await this.findModule(removeObj);
      const removeParams = {
        Bucket: this.s3_Bucket,
        Key: 'tcd-admin/' + removeModule + '/' + removeObj.imgName,
      };

      return this.s3.deleteObject(removeParams).promise();
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findModule(data) {
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
    } else if (type == 'advertisement_image') {
      return 'advertisement'
    } else if (type == 'video_thumb_image') {
      return 'video_thumb_image/' + videoType;
    } else if (type == 'entourage_image') {
      return 'entourage/' + videoType;
    }
  }

  async imageResize(file, imgWidth, imgHeight) {
    // let imgBuffer;
    // await sharp(imgPath)
    //   .toBuffer()
    //   .then((buffer) => {
    //     imgBuffer = buffer;
    //   });

    //.......
    let imgToFile;
    sharp(file)
      .resize(imgHeight, imgWidth)
      .toFile(file, function (err) {
        try {
          imgToFile = file;
        } catch (err) {
          return err;
        }
      });
    return imgToFile;
  }
}
