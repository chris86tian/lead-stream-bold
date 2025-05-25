import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Lead } from "@/types/crm";
import { useContacts } from "@/hooks/useContacts";
import { useToast } from "@/hooks/use-toast";

interface EditLeadModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditLeadModal({ lead, isOpen, onClose }: EditLeadModalProps) {
  const { updateContact } = useContacts();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    first_name: lead?.first_name || '',
    last_name: lead?.last_name || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    company: lead?.company || '',
    status: lead?.status || 'new',
    source: lead?.source || '',
    value: lead?.value || 0,
    assignedTo: lead?.assignedTo || '',
    notes: lead?.notes || ''
  });

  // Update form data when lead changes
  useEffect(() => {
    if (lead) {
      setFormData({
        first_name: lead.first_name || '',
        last_name: lead.last_name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        status: lead.status || 'new',
        source: lead.source || '',
        value: lead.value || 0,
        assignedTo: lead.assignedTo || '',
        notes: lead.notes || ''
      });
    }
  }, [lead]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lead) return;

    // Validierung der Pflichtfelder
    if (!formData.first_name.trim()) {
      toast({
        title: "Fehler",
        description: "Vorname ist ein Pflichtfeld.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.last_name.trim()) {
      toast({
        title: "Fehler",
        description: "Nachname ist ein Pflichtfeld.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Fehler",
        description: "E-Mail ist ein Pflichtfeld.",
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Fehler",
        description: "Telefon ist ein Pflichtfeld.",
        variant: "destructive"
      });
      return;
    }

    try {
      const updatedLead = {
        ...formData,
        name: `${formData.first_name} ${formData.last_name}`.trim(),
        lastContact: new Date().toISOString().split('T')[0] // Automatische Aktualisierung des letzten Kontaktdatums
      };

      updateContact({ id: lead.id, updates: updatedLead });
      onClose();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const handleCancel = () => {
    // Formular zurücksetzen
    if (lead) {
      setFormData({
        first_name: lead.first_name || '',
        last_name: lead.last_name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        status: lead.status || 'new',
        source: lead.source || '',
        value: lead.value || 0,
        assignedTo: lead.assignedTo || '',
        notes: lead.notes || ''
      });
    }
    onClose();
  };

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Lead bearbeiten
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-gray-300">
                Vorname *
              </Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                className="bg-gray-700/50 border-gray-600/60 text-gray-100"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-gray-300">
                Nachname *
              </Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className="bg-gray-700/50 border-gray-600/60 text-gray-100"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              E-Mail *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="bg-gray-700/50 border-gray-600/60 text-gray-100"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-300">
              Telefon *
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="bg-gray-700/50 border-gray-600/60 text-gray-100"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-gray-300">
              Unternehmen
            </Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="bg-gray-700/50 border-gray-600/60 text-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-gray-300">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600/60 text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                  <SelectItem value="new">Neu</SelectItem>
                  <SelectItem value="contacted">Kontaktiert</SelectItem>
                  <SelectItem value="interested">Interessiert</SelectItem>
                  <SelectItem value="qualified">Qualifiziert</SelectItem>
                  <SelectItem value="proposal">Angebot</SelectItem>
                  <SelectItem value="closed-won">Gewonnen</SelectItem>
                  <SelectItem value="closed-lost">Verloren</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source" className="text-gray-300">
                Quelle
              </Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => handleInputChange('source', e.target.value)}
                className="bg-gray-700/50 border-gray-600/60 text-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value" className="text-gray-300">
                Wert (€)
              </Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => handleInputChange('value', Number(e.target.value))}
                className="bg-gray-700/50 border-gray-600/60 text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo" className="text-gray-300">
                Berater
              </Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                className="bg-gray-700/50 border-gray-600/60 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-300">
              Notizen
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="bg-gray-700/50 border-gray-600/60 text-gray-100 min-h-[100px]"
              placeholder="Zusätzliche Notizen zum Lead..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="bg-gray-700/50 border-gray-600/60 text-gray-300 hover:bg-gray-700"
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Speichern
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
