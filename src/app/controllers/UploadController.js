const { cloudinary } = require("../../utils/cloudinary");

class UploadController {
  async upload(req, res, next) {
    try {
      const filestr = req.body.data;
      // console.log("req.body", filestr);
      const uploadedResponse = await cloudinary.uploader.upload(filestr);
      // console.log("uploadedResponse", uploadedResponse);
      res.json({ ...uploadedResponse });
    } catch (err) {
      console.log("FETCH FAIL!", err);
      res.status(500).json({ err: "Something went wrong" });
    }
  }

  async uploadMultiple(req, res, next) {
    try {
      const filestr = req.body.data;
      // res.json(filestr)
      const logic = filestr?.map(async (item) => {
        const uploadedResponse = await cloudinary.uploader.upload(item);
        return { ...uploadedResponse }
      })
      const resolvedPromises = await Promise.all(logic);
      res.json(resolvedPromises);
    } catch (err) {
      console.log("FETCH FAIL!", err);
      res.status(500).json({ err: "Something went wrong" });
    }
  }
}

module.exports = new UploadController();
