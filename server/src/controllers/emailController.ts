// emailController.ts
import nodemailer from "nodemailer";
import crypto from "crypto";
import { User } from '../models/User';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const createEmailTemplate = (verificationCode: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code - Cinemas</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0A1210 0%, #000000 50%, #047857 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(16, 185, 129, 0.2);
        }
        
        .email-header {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .email-header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .logo {
            font-size: 32px;
            font-weight: 700;
            color: white;
            margin-bottom: 10px;
            position: relative;
            z-index: 2;
        }
        
        .logo-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            font-weight: 400;
            position: relative;
            z-index: 2;
        }
        
        .email-content {
            padding: 40px 30px;
            color: #1f2937;
        }
        
        .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 16px;
        }
        
        .message {
            font-size: 16px;
            line-height: 1.6;
            color: #4b5563;
            margin-bottom: 30px;
        }
        
        .verification-code {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            font-size: 48px;
            font-weight: 700;
            text-align: center;
            padding: 30px;
            border-radius: 12px;
            letter-spacing: 8px;
            margin: 30px 0;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .expiry-notice {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 16px;
            margin: 20px 0;
            text-align: center;
            color: #92400e;
            font-size: 14px;
        }
        
        .security-tip {
            background: #eff6ff;
            border: 1px solid #3b82f6;
            border-radius: 8px;
            padding: 16px;
            margin: 20px 0;
            color: #1e40af;
            font-size: 14px;
        }
        
        .email-footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer-text {
            color: #64748b;
            font-size: 12px;
            line-height: 1.5;
            margin-bottom: 15px;
        }
        
        .contact-info {
            color: #94a3b8;
            font-size: 12px;
            margin-top: 15px;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 15px;
            }
            
            .email-header {
                padding: 30px 20px;
            }
            
            .email-content {
                padding: 30px 20px;
            }
            
            .verification-code {
                font-size: 36px;
                padding: 20px;
                letter-spacing: 6px;
            }
            
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <div class="logo">Cinemas</div>
            <div class="logo-subtitle">Your Ultimate Movie Experience</div>
        </div>
        
        <!-- Content -->
        <div class="email-content">
            <h1 class="greeting">Hello Movie Lover!</h1>
            
            <p class="message">
                Thank you for choosing Viva Cinema! To complete your booking and ensure the security of your account, 
                please use the following verification code:
            </p>
            
            <div class="verification-code">
                ${verificationCode}
            </div>
            
            <div class="expiry-notice">
                This code will expire in <strong>10 minutes</strong> for your security.
            </div>
            
            <div class="security-tip">
              <strong>Security Tip:</strong> Never share this code with anyone. Viva Cinema will never ask for your verification code.
            </div>
            
            <p class="message">
                If you didn't request this code, please ignore this email or contact our support team immediately.
            </p>
        </div>
        
        <!-- Footer -->
        <div class="email-footer">
            <div class="footer-text">
                Cinemas. All rights reserved.
            </div>
            
            <div class="contact-info">
                Cinemas Support • support@cinemas.com<br>
                +1 (555) 123-4567 • Mon-Sun 9:00 AM - 11:00 PM
            </div>
        </div>
    </div>
</body>
</html>
  `;
};

export const sendVerificationCode = async (email: string) => {
  try {
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000);

    await User.findOneAndUpdate(
      { email },
      { verificationCode, codeExpires },
      { new: true, upsert: false }
    );

    const emailTemplate = createEmailTemplate(verificationCode);

    const info = await transporter.sendMail({
      from: `"Viva Cinema" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: "🎬 Your Viva Cinema Verification Code",
      html: emailTemplate,
      text: `Your Viva Cinema verification code is: ${verificationCode}. This code will expire in 10 minutes.`
    });

    console.log("Email sent successfully:", info.messageId);
    return verificationCode;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification code.");
  }
};

export const verifyCode = async (email: string, code: string) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { isValid: false, error: "User not found." };
    }

    if (user.verificationCode !== code) {
      return { isValid: false, error: "Invalid verification code." };
    }

    const currentTime = new Date();
    if (currentTime > user.codeExpires) {
      return { isValid: false, error: "Verification code has expired." };
    }

    await User.findOneAndUpdate(
      { email },
      { verificationCode: null, codeExpires: null }
    );

    return { isValid: true };
  } catch (error) {
    console.error("Error verifying code:", error);
    return { isValid: false, error: "Error verifying code." };
  }
};