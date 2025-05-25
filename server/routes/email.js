import express from 'express';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const router = express.Router();

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// SMTP transporter
let smtpTransporter = null;
if (process.env.SMTP_HOST) {
  smtpTransporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Test email endpoint
router.post('/test', async (req, res) => {
  try {
    const { fromEmail, fromName, testEmail, domain, method = 'resend' } = req.body;

    if (!fromEmail || !fromName || !testEmail) {
      return res.status(400).json({
        success: false,
        error: 'Alle Felder sind erforderlich'
      });
    }

    const emailContent = {
      subject: 'Test E-Mail von Ihrem CRM System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Test E-Mail erfolgreich!</h2>
          <p>Diese Test-E-Mail wurde erfolgreich über ${method === 'resend' ? 'Resend' : 'SMTP'} gesendet.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p><strong>Absender:</strong> ${fromName} (${fromEmail})</p>
          <p><strong>Domain:</strong> ${domain || 'Nicht spezifiziert'}</p>
          <p><strong>Zeitpunkt:</strong> ${new Date().toLocaleString('de-DE')}</p>
          <p><strong>Methode:</strong> ${method === 'resend' ? 'Resend API' : 'SMTP'}</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;"><em>Diese Nachricht wurde automatisch generiert.</em></p>
        </div>
      `,
    };

    let result;

    if (method === 'resend' && resend) {
      // Send via Resend
      result = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: [testEmail],
        ...emailContent,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      res.json({
        success: true,
        id: result.data?.id,
        method: 'resend',
        message: 'E-Mail erfolgreich über Resend gesendet'
      });

    } else if (method === 'smtp' && smtpTransporter) {
      // Send via SMTP
      result = await smtpTransporter.sendMail({
        from: `${fromName} <${fromEmail}>`,
        to: testEmail,
        ...emailContent,
      });

      res.json({
        success: true,
        id: result.messageId,
        method: 'smtp',
        message: 'E-Mail erfolgreich über SMTP gesendet'
      });

    } else {
      // No email service configured
      res.status(500).json({
        success: false,
        error: `${method === 'resend' ? 'Resend API-Key' : 'SMTP-Konfiguration'} ist nicht verfügbar`
      });
    }

  } catch (error) {
    console.error('Email sending error:', error);
    
    let errorMessage = 'Unbekannter Fehler beim Senden der E-Mail';
    
    if (error.message.includes('Invalid API key')) {
      errorMessage = 'Ungültiger Resend API-Key';
    } else if (error.message.includes('Domain not found')) {
      errorMessage = 'Domain ist nicht in Resend verifiziert';
    } else if (error.message.includes('SMTP')) {
      errorMessage = 'SMTP-Konfigurationsfehler';
    } else if (error.message.includes('authentication')) {
      errorMessage = 'E-Mail-Authentifizierung fehlgeschlagen';
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      details: error.message
    });
  }
});

// Get email service status
router.get('/status', (req, res) => {
  res.json({
    resend: {
      available: !!resend,
      configured: !!process.env.RESEND_API_KEY
    },
    smtp: {
      available: !!smtpTransporter,
      configured: !!(process.env.SMTP_HOST && process.env.SMTP_USER)
    }
  });
});

export default router;
