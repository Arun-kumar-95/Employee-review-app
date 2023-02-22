// require the twilio package
const twilio = require("twilio");

// exporting the send sms function
module.exports.sendSms = (BODY, PHONE) => {
  const client = new twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

//  return the client message function 
  return client.messages
    .create({
      body: `${BODY}`,
      from: process.env.TWILIO_PHONE,
      to: `+91${PHONE}`,
    })
    .then((message) => console.log("message sends"))
    .catch((err) => console.log(err, "message not send"));
};
