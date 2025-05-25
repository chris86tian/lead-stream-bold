import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, AlertCircle, CheckCircle, Loader2, Settings, Server } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendTestEmail, getEmailServiceStatus } from "@/services/emailService";

interface EmailTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmailTestModal({ isOpen, onClose }: EmailTestModalProps) {
  const { toast } = useToast();
  const [emailData, setEmailData] = useState({
    fromEmail: '',
    fromName: '',
    testEmail: '',
    domain: '',
    method: 'resend' as 'resend' | 'smtp'
  });

  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [serviceStatus, setServiceStatus] = useState<any>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadServiceStatus();
    }
  }, [isOpen]);

  const loadServiceStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const status = await getEmailServiceStatus();
      setServiceStatus(status);
      
      // Auto-select available method
      if (status?.resend.configured) {
        setEmailData(prev => ({ ...prev, method: 'resend' }));
      } else if (status?.smtp.configured) {
        setEmailData(prev => ({ ...prev, method: 'smtp' }));
      }
    } catch (error) {
      console.error('Error loading service status:', error);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailData.testEmail || !emailData.fromEmail || !emailData.fromName) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle erforderlichen Felder aus.",
        variant: "destructive",
      });
      return;
    }

    setTestStatus('testing');
    console.log('Testing email with data:', emailData);

    try {
      const result = await sendTestEmail(emailData);

      if (result.success) {
        setTestStatus('success');
        toast({
          title: "Test erfolgreich!",
          description: result.message || `Test-E-Mail wurde erfolgreich über ${result.method} gesendet.`,
        });
      } else {
        throw new Error(result.error || 'Unbekannter Fehler');
      }
    } catch (error: any) {
      console.error("Error testing email:", error);
      setTestStatus('error');
      toast({
        title: "Test fehlgeschlagen",
        description: error.message || "Der E-Mail-Test konnte nicht durchgeführt werden.",
        variant: "destructive",
      });
    }

    setTimeout(() => setTestStatus('idle'), 5000);
  };

  const extractDomainFromEmail = (email: string) => {
    const domain = email.split('@')[1];
    if (domain && domain !== emailData.domain) {
      setEmailData({ ...emailData, domain });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            E-Mail Service Test
          </DialogTitle>
        </DialogHeader>
        
        {isLoadingStatus ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Lade Service-Status...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Status */}
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Service-Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-blue-400" />
                    <span>Resend API</span>
                  </div>
                  <div className="flex items-center">
                    {serviceStatus?.resend.configured ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="ml-2 text-sm">
                      {serviceStatus?.resend.configured ? 'Konfiguriert' : 'Nicht verfügbar'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                  <div className="flex items-center">
                    <Server className="w-4 h-4 mr-2 text-green-400" />
                    <span>SMTP</span>
                  </div>
                  <div className="flex items-center">
                    {serviceStatus?.smtp.configured ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="ml-2 text-sm">
                      {serviceStatus?.smtp.configured ? 'Konfiguriert' : 'Nicht verfügbar'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Method Selection */}
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">E-Mail-Methode</CardTitle>
              </CardHeader>
              <CardContent>
                <Label className="text-gray-300">Versandmethode</Label>
                <Select 
                  value={emailData.method} 
                  onValueChange={(value: 'resend' | 'smtp') => setEmailData({ ...emailData, method: value })}
                >
                  <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-600 border-gray-500">
                    <SelectItem 
                      value="resend" 
                      disabled={!serviceStatus?.resend.configured}
                    >
                      Resend API {!serviceStatus?.resend.configured && '(Nicht verfügbar)'}
                    </SelectItem>
                    <SelectItem 
                      value="smtp"
                      disabled={!serviceStatus?.smtp.configured}
                    >
                      SMTP {!serviceStatus?.smtp.configured && '(Nicht verfügbar)'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Email Configuration */}
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">E-Mail-Konfiguration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fromName" className="text-gray-300">Absender Name</Label>
                    <Input
                      id="fromName"
                      value={emailData.fromName}
                      onChange={(e) => setEmailData({ ...emailData, fromName: e.target.value })}
                      placeholder="Ihr Unternehmen"
                      className="bg-gray-600 border-gray-500 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="fromEmail" className="text-gray-300">Absender E-Mail</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={emailData.fromEmail}
                      onChange={(e) => {
                        setEmailData({ ...emailData, fromEmail: e.target.value });
                        extractDomainFromEmail(e.target.value);
                      }}
                      placeholder="noreply@ihredomain.de"
                      className="bg-gray-600 border-gray-500 text-white"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="domain" className="text-gray-300">Domain (optional)</Label>
                  <Input
                    id="domain"
                    value={emailData.domain}
                    onChange={(e) => setEmailData({ ...emailData, domain: e.target.value })}
                    placeholder="ihredomain.de"
                    className="bg-gray-600 border-gray-500 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="testEmail" className="text-gray-300">Test E-Mail senden an</Label>
                  <Input
                    id="testEmail"
                    type="email"
                    value={emailData.testEmail}
                    onChange={(e) => setEmailData({ ...emailData, testEmail: e.target.value })}
                    placeholder="test@example.com"
                    className="bg-gray-600 border-gray-500 text-white"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            {testStatus !== 'idle' && (
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="pt-6">
                  {testStatus === 'testing' && (
                    <div className="flex items-center text-blue-400">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span>Sende Test-E-Mail...</span>
                    </div>
                  )}
                  
                  {testStatus === 'success' && (
                    <div className="flex items-center text-green-400">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Test erfolgreich! E-Mail wurde versendet.</span>
                    </div>
                  )}
                  
                  {testStatus === 'error' && (
                    <div className="flex items-center text-red-400">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span>Test fehlgeschlagen. Bitte überprüfen Sie Ihre Einstellungen.</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                Schließen
              </Button>
              <Button
                type="submit"
                disabled={testStatus === 'testing' || !emailData.testEmail || !emailData.fromEmail}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                {testStatus === 'testing' && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Test senden
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
