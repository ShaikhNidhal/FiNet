export interface MailOptions {
    to: string;
    name: string;
    role: string;
    setupLink: string;
}

class MailService {
    private readonly API_TOKEN = import.meta.env.VITE_MAILTRAP_API_TOKEN;
    private readonly SENDER_EMAIL = import.meta.env.VITE_MAILTRAP_SENDER_EMAIL || 'no-reply@finet.ai';
    private readonly API_URL = 'https://send.api.mailtrap.io/api/send';

    async sendInvitation({ to, name, role, setupLink }: MailOptions): Promise<boolean> {
        if (!this.API_TOKEN) {
            console.warn('Mailtrap API Token is missing. Email skipped.');
            return false;
        }

        const html = `
            <div style="font-family: sans-serif; background-color: #0f172a; color: #ffffff; padding: 40px; border-radius: 20px;">
                <h1 style="color: #0ea5e9; font-size: 24px; font-weight: 900; margin-bottom: 20px;">Welcome to FiNet</h1>
                <p style="font-size: 16px; line-height: 1.6; color: #94a3b8;">Hello ${name},</p>
                <p style="font-size: 16px; line-height: 1.6; color: #94a3b8;">You have been invited to join the <strong>FiNet Strategic Intelligence</strong> workspace as an <strong>${role}</strong>.</p>
                <div style="margin: 40px 0;">
                    <a href="${setupLink}" style="background-color: #0ea5e9; color: #ffffff; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Complete Account Setup</a>
                </div>
                <p style="font-size: 12px; color: #475569; border-top: 1px solid #1e293b; padding-top: 20px;">
                    If you were not expecting this invitation, please ignore this email.<br/>
                    &copy; 2026 FiNet Intelligence Suite.
                </p>
            </div>
        `;

        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: { email: this.SENDER_EMAIL, name: 'FiNet Security' },
                    to: [{ email: to }],
                    subject: 'Welcome to FiNet: Action Required',
                    html: html,
                    category: 'Invitations'
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Mailtrap Error:', error);
                return false;
            }

            return true;
        } catch (err) {
            console.error('Failed to send email:', err);
            return false;
        }
    }
}

export const mailService = new MailService();
