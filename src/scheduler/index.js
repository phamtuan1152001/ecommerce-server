const moment = require('moment')
const cron = require('node-cron');
const Product = require("../app/models/Product")

function scheduler() {
  cron.schedule("* * * * * *", async function () {
    // console.log("nodejjs running")
    try {
      // Find products where sale period has ended but still marked as onSale
      const currentTime = new Date()
      const expiredProducts = await Product.find({
        onSale: true,
        dateOnSaleTo: { $lte: moment().format() }, // Sale end date is in the past
      });

      // console.log("expiredProducts", expiredProducts)
      // console.log(moment().format())

      // Update the onSale field to false for expired products
      for (const product of expiredProducts) {
        product.onSale = false;
        product.salePrice = "";
        product.dateOnSaleFrom = "";
        product.dateOnSaleTo = "";
        await product.save();
      }
      // console.log('Expired products updated successfully.');
    } catch (error) {
      console.error('Error updating expired products:', error);
    }
  })
}

module.exports = scheduler