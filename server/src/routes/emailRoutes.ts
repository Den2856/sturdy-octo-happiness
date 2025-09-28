import { Router } from 'express';
import { sendVerificationCode } from '../controllers/emailController';

const router = Router();

router.post('/send-code', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: "Email is required" });
  }

  try {
    const verificationCode = await sendVerificationCode(email);
    res.status(200).json({ message: "Verification code sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send verification code" });
  }
});

export default router;
