export const signup = (link,userName) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }

    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .header {
      background-color: #4CAF50;
      color: white;
      text-align: center;
      padding: 20px;
    }

    .content {
      padding: 20px;
      text-align: center;
      color: #333333;
    }

    .content p {
      line-height: 1.6;
    }

    .cta-button {
      display: inline-block;
      margin-top: 20px;
      background-color: #4CAF50;
      color: white;
      text-decoration: none;
      padding: 12px 25px;
      font-size: 16px;
      border-radius: 5px;
      transition: background-color 0.3s;
    }

    .cta-button:hover {
      background-color: #45a049;
    }

    .footer {
      background-color: #f1f1f1;
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #888888;
    }

    @media (max-width: 600px) {
      .content {
        padding: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Welcome to Saraha Application</h1>
    </div>
    <div class="content">
      <p>Hi ${userName},</p>
      <p>Thank you for signing up for Saraha Application! We're excited to have you on board. To get started, please activate your account by clicking the button below:</p>
      <a href="${link}" class="cta-button">Activate My Account</a>
      <p>If the button above doesn’t work, copy and paste the following link into your browser:</p>
      <p>If you didn’t sign up for Saraha Application, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>If you need help, contact us at saraha.com.</p>
      <p>&copy; 2023 Saraha Application, All Rights Reserved.</p>
    </div>
  </div>
</body>
</html>
`;
export const changeEmail = (link,userName) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }

    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .header {
      background-color: #4CAF50;
      color: white;
      text-align: center;
      padding: 20px;
    }

    .content {
      padding: 20px;
      text-align: center;
      color: #333333;
    }

    .content p {
      line-height: 1.6;
    }

    .cta-button {
      display: inline-block;
      margin-top: 20px;
      background-color: #4CAF50;
      color: white;
      text-decoration: none;
      padding: 12px 25px;
      font-size: 16px;
      border-radius: 5px;
      transition: background-color 0.3s;
    }

    .cta-button:hover {
      background-color: #45a049;
    }

    .footer {
      background-color: #f1f1f1;
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #888888;
    }

    @media (max-width: 600px) {
      .content {
        padding: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Welcome to Social App Change Email</h1>
    </div>
    <div class="content">
      <p>Hi ${userName},</p>
      <p>Thank you for signing up for Saraha Application! We're excited to have you on board. To get started, please activate your account by clicking the button below:</p>
      <a href="${link}" class="cta-button">Activate My Account</a>
      <p>If the button above doesn’t work, copy and paste the following link into your browser:</p>
      <p>If you didn’t sign up for Saraha Application, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>If you need help, contact us at saraha.com.</p>
      <p>&copy; 2023 Saraha Application, All Rights Reserved.</p>
    </div>
  </div>
</body>
</html>
`;