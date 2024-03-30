// import CloudConvert from 'cloudconvert';
const CloudConvert = require('cloudconvert')

const cloudConvert = new CloudConvert(process.env.CLOUD_CONVERT_API);

class ConvertControlelr {
  async convert(req, res, next) {
    try {
      const { urlImage, fileNameImage } = req.body
      let job = await cloudConvert.jobs.create({
        "tasks": {
          "import-1": {
            "operation": "import/url",
            "url": urlImage,
            // "filename": fileNameImage
          },
          "task-1": {
            "operation": "convert",
            "input_format": "jpg",
            "output_format": "psd",
            "engine": "imagemagick",
            "input": [
              "import-1"
            ],
            "fit": "max",
            "strip": false,
            "auto_orient": true
          },
          "export-1": {
            "operation": "export/url",
            "input": [
              "task-1"
            ],
            "inline": false,
            "archive_multiple_files": false
          }
        },
        "tag": "jobbuilder"
      });
      job = await cloudConvert.jobs.wait(job.id);
      res.json({
        retCode: 0,
        retText: "Successfully convert",
        retData: job,
      })
    } catch (err) {
      console.log("FAIL!", err)
    }
  }
}

module.exports = new ConvertControlelr