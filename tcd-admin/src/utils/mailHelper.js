const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//const apiKey = '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'
//sgMail.setApiKey(apiKey);

const sendWelcomeEmail = (emailData) => {
    sgMail.send({
        to: emailData.email,
        from: 'support@thecannabisdiary.co',
        subject: 'Welcome to TCD ',
        text: `Hello,  ${emailData.name} \n\n Welcome to TCD.\n Thank you for registering with us. \n\n Regards,\nTeam TCD`,

    })
}

const resendOTPEmail = (emailData) => {
    sgMail.send({
        to: emailData.email,
        from: 'support@thecannabisdiary.co',
        subject: emailData.subject,
        text: `Hello,  ${emailData.name} \n\n Your email verification code is ${emailData.code} \n\n Regards,\n Team TCD`,

    })
}

const sendForgotPasswordEmail = (emailData) => {
    sgMail.send({
        to: emailData.email,
        from: 'support@thecannabisdiary.co',
        subject: 'Resetpassword OTP',
        text: `Hello  ${emailData.name}, \n\n You have requested for a verification code to reset your password. \n\n The verification code is : ${emailData.OTP}   \n\n Regards,\n Team TCD`,
        //html:'Hi <p></p>'
        /*templateId:'d-21ebbf5619a84e9a92535d9fa4522f32',
        dynamic_template_data: {
            name: emailData.name,
            url: emailData.url,
            footer_text:'Thanks, Hello Total Wellness Team'
        }*/
    })
}

const sendAdminForgotPasswordEmail = (emailData) => {
    sgMail.send({
        to: emailData.email,
        from: 'support@thecannabisdiary.co',
        subject: 'Resetpassword Link',
        html: `Hello,  ${emailData.name} \n\n Your reset password link is <a href="${emailData.url}">Click here</a> . Click on the link to reset your password. \n\n Regards,\n Team TCD`,
        // templateId:'d-21ebbf5619a84e9a92535d9fa4522f32',
        // dynamic_template_data: {
        // name: emailData.name,
        // url: emailData.url,
        // footer_text:'Thanks, TCD Team'
        // }
    })
}


const userBlockedEmail = (emailData) => {
    sgMail.send({
        to: emailData.email,
        from: 'admin@buildup.com',
        subject: 'Your account has been blocked by Administrator',
        text: `Hello ${emailData.name}, \n\n Your account has been blocked by Administrator .For more information please contact site administrator. \n\n Regards,\n Buildup Team`,
        //html:'Hi <p></p>'
    })
}
const adminCreationEmail = (emailData) => {
    sgMail.send({
        to: emailData.email,
        from: 'support@thecannabisdiary.co',
        subject: 'Admin User Creation',
        text: `Hello,  ${emailData.name} \n\n Welcome to Buildup!.\nYou are added as a admin by the administrator. Your login credentials are given below.\n  Email: ${emailData.email} Password: ${emailData.password} .\n Click ${emailData.url} to activate your account and start your journey as a administrator.Your account verification code is ${emailData.code} \n\n Regards,\n Buildup Team`,
        //html:'Hi <p></p>'
    })
}

const sendContactEmail = (emailData) => {
    sgMail.send({
        to: emailData.email,
        from: 'support@thecannabisdiary.co',
        subject: emailData.topic,
        text: `Hello, ${emailData.name} \n\n   You have mentioned your issues as : \n\n${emailData.issue}\n\n We will get back to you shortly. \n\n Regards,\n Team The Cannabis Diary`,
    })
}

const contactSupportEmail = (emailData) => {
    sgMail.send({
        to: 'support@thecannabisdiary.co',
        from: 'support@thecannabisdiary.co',
        subject: emailData.topic,
        text: `Hello, Support Team \n\n   A user ${emailData.name} has logged a new issue. The issue is as follows : \n\n${emailData.issue}\n\n . \n\n Regards,\n Team The Cannabis Diary`,
    })
}

const sendFeedbackEmail = (emailData) => {
    sgMail.send({
        to: 'support@tcd.com',
        from: 'support@thecannabisdiary.co',
        subject: 'Notification for new Feedback',
        text: `Hello, \n\n administrator.\n A new feedback has been sent by a user, please check.  \n\n Regards,\n TCD Team`,
    })
}

const subAdminCreationEmail = (emailData) => {
    sgMail.send({
        to: emailData.email,
        from: 'support@thecannabisdiary.co',
        subject: 'Sub Admin User Creation',
        text: `Hello,  ${emailData.name} \n\n Welcome to TCD!.\n You are added as a sub admin by the administrator.\n Your login credentials are given below.\n Email: ${emailData.email}\n Password: ${emailData.password} .\n \n Regards,\n TCD Team`,
        //html:'Hi <p></p>'
    })
}

const communityUpdateEmail = (emailData) => {
    sgMail.send({
        to: emailData.email,
        from: 'support@thecannabisdiary.co',
        subject: 'Notification for administrator',
        text: `Hello, \n\n ${emailData.name}.\n Administrator has answered your community question, please check.  \n\n Regards,\n TCD Team`,
    })
}

const userAccountDeleteMail = (emailData) => {
    sgMail.send({
        to: emailData.email,
        from: 'support@thecannabisdiary.co',
        //cc:'farzina.ncrts@gmail.com',
        subject: 'Your TCD account has been deleted',
        text: `Hello, \n\n ${emailData.name}.\n Administrator has deleted your account with TCD.  \n\n Regards,\n TCD Team`,
    })
}

const twoFactorMail = (emailData) => {
    sgMail.send({
        to: emailData.email,
        from: 'support@thecannabisdiary.co',
        subject: 'Your 2FA Login Code',
        text: `Hello, \n\n ${emailData.name}.\n Your login code is ${emailData.code}.  \n\n Regards,\n TCD Team`,
    })
}

const sendCommunityQuestionMail = (emailData) => {
    sgMail.send({
        to: 'tcdmohali@mailinator.com',
        from: 'support@thecannabisdiary.co',
        subject: 'User requested answer for the question',
        html: `Hello Admin, <br/> ${emailData.userName} user has requested answer for the question.<br/><br/> <b> Category: </b> ${emailData.category} <br/> <b> Question: </b>  ${emailData.question}  <br/><br/> Regards,<br/> TCD Team`,
    })
}

const partnerAdminCreationEmail = (emailData) => {
    sgMail.send({
        to: emailData.email,
        from: 'support@thecannabisdiary.co',
        subject: 'Partner Admin User Creation',
        text: `Hello,  ${emailData.name} \n\n Welcome to TCD!.\n You are added as a partner admin by the administrator.\n Your login credentials are given below.\n Email: ${emailData.email}\n Password: ${emailData.password} .\n \n Regards,\n TCD Team`,
        //html:'Hi <p></p>'
    })
}

const partnerCreationEmail = (emailData) => {
    sgMail.send({
        to: emailData.email,
        from: 'support@thecannabisdiary.co',
        subject: 'Partner Admin User Creation',
        text: `Hello,  ${emailData.name} \n\n Welcome to TCD!.\n You are added as a partner by the administrator.\n Your login credentials are given below.\n Email: ${emailData.email}\n Password: ${emailData.password} .\n \n Regards,\n TCD Team`,
        //html:'Hi <p></p>'
    })
}

const partnerSupportEmail = (emailData) => {
    sgMail.send({
        to: 'support@thecannabisdiary.co',
        from: 'support@thecannabisdiary.co',
        subject: emailData.subject,
        text: `Hello \n\n  ${emailData.name} wants support on \n\n Topic: ${emailData.topic} \n \n Message: ${emailData.message}. \n \n Regards,\n TCD Team`,
    })
}

const sendPartnerForgotPasswordEmail = (emailData) => {
    sgMail.send({
        to: emailData.email,
        from: 'support@thecannabisdiary.co',
        subject: 'Reset password Link',
        html: `Hello,  ${emailData.name} \n\n Your reset password link is <a href="${emailData.url}">Click here</a> . Click on the link to reset your password. \n\n Regards,\n Team TCD`,
    })
}

module.exports = {
    sendWelcomeEmail,
    resendOTPEmail,
    sendForgotPasswordEmail,
    userBlockedEmail,
    sendAdminForgotPasswordEmail,
    adminCreationEmail,
    sendContactEmail,
    sendFeedbackEmail,
    subAdminCreationEmail,
    communityUpdateEmail,
    userAccountDeleteMail,
    contactSupportEmail,
    twoFactorMail,
    sendCommunityQuestionMail,
    partnerAdminCreationEmail,
    partnerCreationEmail,
    partnerSupportEmail,
    sendPartnerForgotPasswordEmail
}