import sgMail from '@sendgrid/mail';
import { getRejectData } from './requirementServices.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function rejectApplication({ name, email }) {

  const { company_name, position } = await getRejectData()

  const rejectionText = `Hi ${name},

    Thank you for your interest in our company ${company_name}. We appreciate the time you took to apply for the ${position}.

    We were very fortunate to have a strong group of applicants to consider for this role and we often have to make tough choices. Unfortunately, after careful consideration, we have decided to move forward with other candidates.

    New positions open up regularly at ${company_name}. We will hold onto your application, and if a position opens that closely matches your skillset, we may contact you directly.

    Thank you,
    ${company_name} Recruiting Team`;


  await sgMail.send({
    to: email,
    from: process.env.DEFAULT_FROM_EMAIL,
    subject: 'Update on your Application',
    text: rejectionText,
  });
}
