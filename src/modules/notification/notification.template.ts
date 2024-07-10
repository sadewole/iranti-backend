export const notificationType = {
  emailVerification: {
    sendCode: true,
    header: 'Email verification',
    body: 'Use this code in the verification form to confirm it is you.',
  },
  emailVerified: {
    sendCode: undefined,
    header: 'Email verified',
    body: 'You can now enjoy exclusive features on Iranti. This email would serve as your account recovery detail.',
  },
  thankYouSignUp: {
    sendCode: true,
    header: 'Thank you for signing up',
    body: 'To enjoy exclusive features on Iranti, please use the code below to confirm your email',
  },
  passwordReset: {
    sendCode: true,
    header: 'Password reset',
    body: 'You have requested password reset for your Iranti account. Use the code below to reset your password',
  },
};

export function HTMLTemplate(
  notification_id: keyof typeof notificationType,
  message: string,
): string {
  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title></title>
<!--[if mso]>
<noscript>
  <xml>
    <o:OfficeDocumentSettings>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
</noscript>
<![endif]-->
  <style>
      table,
      td,
      div,
      h1,
      p {
        font-family: Arial, sans-serif;
      }
  </style>
</head>
<body style="margin:0;padding:0;">
    <center style="height:100dvh; background:#f6f6f6">
    <table role="presentation"
      style="width:100%;height:60%;border-collapse:collapse;border:0;border-spacing:0;">
      <tr>
        <td align="center" style="padding:20px;">
          <table role="presentation" style="width:602px;border-collapse:collapse;border:none;border-spacing:0;text-align:left;">
            <tr>
              <td style="padding:36px 30px 0px 30px;background:#FFFFFF;border-bottom:1px solid #E6E9F2;">
                <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                  <tr>
                    <td style="padding:0 0 36px 0;color:#666E81;text-align:center;">
                      <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Helvetica, arial, sans-serif;font-size:24px;">
                        ${notificationType[notification_id]['header']}
                      </h1>
                      <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Helvetica, arial, sans-serif;font-size:17px;color:#666E81;">
                         ${notificationType[notification_id]['body']}
                      </p>
                        ${
                          notificationType[notification_id]['sendCode']
                            ? `<h3 style="margin:30px 0;font-size:25px;line-height:25px;letter-spacing:0.3rem;font-family:Helvetica, arial, sans-serif;text-align:center;color:#6180DD;">${message}</h3>`
                            : `<p>${message}</p>`
                        }
                           
                 <p style="margin-top:50px">______</p>
                      <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Habanera;font-size:12px;color:#666E81;text-align:center;">
                        Do not reply this message.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <table border="0" cellpadding="0"
        cellspacing="0" class="wrapper-mobile"
        style="text-align:center;">
        <tbody>
            <tr>
            <td align="center"
                bgcolor="#f5f8fd"
                class="inner-td"
                style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                <a href="https://xmusic.netlify.app/"
                    style="background-color:#A5B4D9; border:1px solid #A5B4D9; border-color:#A5B4D9; border-radius:25px; border-width:1px; color:#f6f6f6; display:inline-block; font-size:10px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:5px 18px 5px 18px; text-align:center; text-decoration:none; border-style:solid; font-family:helvetica,sans-serif;"
                    target="_blank">♥
                    Iranti. &copy; 2024 - All
                    right reserved</a></td>
            </tr>
        </tbody>
    </table>
    </center>
</body>
</html>`;

  return html;
}
