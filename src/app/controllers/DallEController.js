const { OpenAI } = require("openai");
// import * as dotenv from "dotenv"

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
}

module.exports = new DallEController();