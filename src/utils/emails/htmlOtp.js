export const otpForm = (otp) => {
	return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0fff4;">
    <!-- Main Container -->
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <tr>
            <td style="padding: 30px 20px; text-align: center; background-color: #4caf50; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; color: #ffffff; font-size: 24px;">OTP Verification</h1>
            </td>
        </tr>
        <!-- Content -->
        <tr>
            <td style="padding: 30px 20px; text-align: center;">
                <p style="margin: 0 0 20px; color: #333333; font-size: 16px;">
                    Please use the following OTP to complete your verification:
                </p>
                <!-- OTP Display -->
                <div style="background-color: #e8f5e9; padding: 15px; border-radius: 10px; display: inline-block;">
                    <span style="font-size: 28px; font-weight: bold; color: #2e7d32; letter-spacing: 5px;">${otp}</span>
                </div>
                <p style="margin: 20px 0 0; color: #666666; font-size: 14px;">
                    This OTP is valid for 10 minutes. Do not share it with anyone.
                </p>
            </td>
        </tr>
        <!-- Footer -->
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f0fff4; border-radius: 0 0 10px 10px;">
                <p style="margin: 0; color: #666666; font-size: 12px;">
                    If you didn't request this OTP, please ignore this email.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};
