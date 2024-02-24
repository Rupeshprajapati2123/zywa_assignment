const express = require('express');
const router = express.Router();
const { uploadCsvData, findUserByName } = require('./functions');
const { DeliveredSchema, PickupSchema, ReturnedSchema } = require('./schemas');
const { a } = require('./consts');

// Route for uploading CSVs
router.get('/upload', (req, res) => {
  uploadCsvData(DeliveredSchema, __dirname + '/public/Delivered.csv', 'Delivered_model');
  uploadCsvData(DeliveredSchema, __dirname + '/public/Delivery_exceptions.csv', 'Delivery_exceptions');
  uploadCsvData(PickupSchema, __dirname + '/public/Pickup.csv', 'Picked_model');
  uploadCsvData(ReturnedSchema, __dirname + '/public/Returned.csv', 'Returned_model');
  res.send("CSVs Uploaded!");
});

// Route for getting card status
router.get('/get_card_status', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Route for handling post request to get card status

const arr = [
    { model: 'Returned_model', schema: ReturnedSchema, field: 'User contact' },
    { model: 'Delivered_model', schema: DeliveredSchema, field: 'User contact' },
    { model: 'Delivery_exceptions', schema: DeliveredSchema, field: 'User contact'},
    { model: 'Picked_model', schema: PickupSchema, field: 'User Mobile', },
  ];
  
  router.post('/get_card_status', async (req, res) => {
    let mobile = req.body.mobile;
    let field=false;
  
    
    mobile = mobile.replace(/"/g, '');
  
    // Check if mobile contains only numbers
    if (/^\d+$/.test(mobile)) {
      field = false;
    } else {
      field = true;
    }
  
    for (let i = 0; i < arr.length; i++) {
      const result = await findUserByName(mobile, arr[i].model, arr[i].schema, field==true?'Card ID':arr[i].field, arr[i].by);
      if (result) {
        res.render('userDetails', { user: result, status: a[i] });
        return;
      }
    }
    res.sendFile(__dirname + '/public/not_found.html');
  });
  

module.exports = router;

