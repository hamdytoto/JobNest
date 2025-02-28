 const getApplicationEmailTemplate = (status, jobTitle, companyName) => {
    const isAccepted = status === "accepted";
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Application Status</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { width: 80%; max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; 
                    border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); text-align: center; }
                .header { font-size: 24px; font-weight: bold; padding: 10px 0; }
                .message { font-size: 16px; color: #333; line-height: 1.6; margin: 20px 0; }
                .cta-button { display: inline-block; padding: 10px 20px; color: #fff; border-radius: 5px; 
                    text-decoration: none; font-size: 16px; margin-top: 15px; }
                .accepted { background-color: #28a745; }
                .rejected { background-color: #dc3545; }
                .footer { margin-top: 20px; font-size: 14px; color: #777; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">${isAccepted ? "🎉 Congratulations!" : "❌ Application Update"}</div>
                <p class="message">
                    Dear Candidate,<br><br>
                    ${isAccepted 
                        ? `We are pleased to inform you that your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> has been <strong>accepted</strong>! Our team will contact you soon regarding the next steps.` 
                        : `Thank you for applying for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>. Unfortunately, we have moved forward with other candidates. We encourage you to apply for future opportunities.`}
                </p>
                <a href="#" class="cta-button ${isAccepted ? "accepted" : "rejected"}">
                    ${isAccepted ? "View Next Steps" : "View Other Jobs"}
                </a>
                <p class="footer">Best Regards,<br><strong>${companyName}</strong> HR Team</p>
            </div>
        </body>
        </html>
    `;
};
export default getApplicationEmailTemplate;
