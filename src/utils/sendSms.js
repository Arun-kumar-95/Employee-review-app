const twilio = require("twilio");

module.exports.sendSms = (BODY, PHONE) => {
  const client = new twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

 
  return client.messages
    .create({
      body: `${BODY}`,
      from: process.env.TWILIO_PHONE,
      to: `+91${PHONE}`,
    })
    .then((message) => console.log("message sends"))
    .catch((err) => console.log(err, "message not send"));
};
