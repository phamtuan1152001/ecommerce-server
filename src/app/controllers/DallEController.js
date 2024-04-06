const { OpenAI, toFile } = require("openai");

const fs = require('fs');


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

class DallEController {
  async generate(req, res) {
    try {
      const { prompt } = req.body
      // res.status(200).json({ message: prompt })
      const response = await openai.images.generate({
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json'
      })
      // // const image = response.data[0].b64_json /* response.data.data[0].b64__json */
      // console.log("response", response);
      res.status(200).json({
        retCode: 0,
        retText: "Generate successfully",
        photo: response.data[0].b64_json
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        retCode: 1,
        retText: "Generate unsuccessfully",
        message: "Something went wrong"
      })
    }
  }

  async generateImageUploaded(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).send({ success: false, error: 'No file uploaded' });
      }

      const payload = {
        model: "dall-e-2",
        image: fs.createReadStream(`/Projects/ThesisProject/ThesisProject/thesis/server-ecom/ecommerce-server/src/public`),
        // mask: imageBuffer,
        prompt: "a tree",
        n: 1,
        size: "256x256",
        response_format: "url"
      }
      // console.log("p", payload);
      const response = await openai.images.edit(payload)
      console.log("response", response);
    } catch (error) {
      if (error.response) {
        console.log("status", error.response.status);
        console.log("data", error.response.data);
      } else {
        console.log("message", error.message);
      }
    }
  }
}

module.exports = new DallEController();