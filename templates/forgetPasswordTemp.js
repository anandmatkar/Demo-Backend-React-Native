export const forgetTemplate = (userName, otp) => {
  let resetTemp = `<!DOCTYPE html>
      <html>
      <head>
          <title>Forget Password OTP </title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #F5F5F5;
                  margin: 0;
                  padding: 0;
                  text-align: center;
              }
              .container {
                  background-color: #fff;
                  border-radius: 10px;
                  padding: 20px;
                  margin: 20px auto;
                  width: 80%;
                  max-width: 400px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #333;
              }
              h2 {
                  color: #007BFF;
              }
              p {
                  color: #777;
                  line-height: 1.6;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>OTP Verification</h1>
              <p>Dear ${userName},</p>
              <p>Your One-Time Password (OTP) for reset password is:</p>
              <h2>${otp}</h2>
              <p>Please use this code to complete your password change process.</p>
              <p>If you did not request this OTP, please ignore this email.</p>
          </div>
      </body>
      </html>`;
  return resetTemp;
};
