export function generateResetPasswordEmail({
  recipientName,
  otpCode,
}: {
  recipientName: string;
  otpCode: string | number;
}) {
  return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reset Your Password</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          h2 {
            color: #0275d8;
          }
          p {
            font-size: 16px;
            color: #333;
            line-height: 1.6;
          }
          .otp {
            font-size: 24px;
            font-weight: bold;
            color: #d9534f;
            background: #f9f9f9;
            padding: 10px;
            display: inline-block;
            border-radius: 5px;
            margin: 15px 0;
          }
          .footer {
            font-size: 14px;
            color: #666;
            margin-top: 20px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>🔒 Reset Your Password</h2>
          <p>Dear ${recipientName},</p>
          <p>You recently requested to reset your password. Use the OTP below to complete the process:</p>
 
          <div class="otp">${otpCode}</div>
 
          <p>This OTP is valid for a limited time. If you did not request a password reset, please ignore this email.</p>
 
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>`;
}
