interface SendTestEmailRequest {
  fromEmail: string;
  fromName: string;
  testEmail: string;
  domain?: string;
  method?: 'resend' | 'smtp';
}

interface SendTestEmailResponse {
  success: boolean;
  error?: string;
  id?: string;
  method?: string;
  message?: string;
}

interface EmailServiceStatus {
  resend: {
    available: boolean;
    configured: boolean;
  };
  smtp: {
    available: boolean;
    configured: boolean;
  };
}

export const sendTestEmail = async (params: SendTestEmailRequest): Promise<SendTestEmailResponse> => {
  try {
    const response = await fetch('/api/email/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Server-Fehler: ${response.status}`
      };
    }

    return data;
  } catch (error) {
    console.error('Error sending test email:', error);
    return {
      success: false,
      error: 'Netzwerkfehler: Kann nicht mit dem Server kommunizieren'
    };
  }
};

export const getEmailServiceStatus = async (): Promise<EmailServiceStatus | null> => {
  try {
    const response = await fetch('/api/email/status');
    if (!response.ok) {
      throw new Error('Failed to fetch email service status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching email service status:', error);
    return null;
  }
};
