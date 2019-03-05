import nodemailer, { SentMessageInfo } from "nodemailer";
import { MailOptions } from "nodemailer/lib/stream-transport";

export interface SendEmailOptions {
	email: string;
	subject?: string;
	text?: string;
	html?: string;
}

const trasporter = nodemailer.createTransport({
	// cutted
});

export const sendEmail = (options: SendEmailOptions): Promise<SentMessageInfo> => {
	return new Promise((resolve, reject) => {
		const mailOptions: MailOptions = {
			from: "cutted",
			to: options.email,
			subject: options.subject,
			text: options.text,
			html: options.html,
		};

		trasporter.sendMail(mailOptions, (error, info: SentMessageInfo) => {
			if (error) {
				return reject(error);
			}
			return resolve(info);
		});
	});
};
