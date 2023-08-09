const twilio = require('twilio');

const sendSMS = async (contactNo) => {
  const accountSid = 'AC6ce8391f82e28e68c23e797c80d41565'; // Your Account SID from www.twilio.com/console
  const authToken = 'df878cc289366e6f81cda5604bcf7fb4'; // Your Auth Token from www.twilio.com/console

  const client = new twilio(accountSid, authToken);

  client.messages
    .create({
      body: 'Welcome to TCD. Thank you for registering with us.',
      //to: '+17327897890', // Text this number
      to: '+1' + contactNo,
      from: '+14152311655', // From a valid Twilio number
    })
    .then((message) => console.log(message.sid))
    .catch(function (err) {
      console.log('Error', err);
    });
};

export { sendSMS };
