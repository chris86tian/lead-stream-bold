import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Lead } from "@/types/crm";
import { useContacts } from "@/hooks/useContacts";

interface CreateLeadModalProps {
  onLeadCreated?: (lead: Lead) => void;
}

export function CreateLeadModal({ onLeadCreated }: CreateLeadModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    source: "Website",
    status: "contacted" as Lead['status'], // Geändert von "new" zu "contacted"
    notes: ""
  });

  const { createContact, isCreating } = useContacts();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const leadData: Partial<Lead> = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      source: formData.source,
      status: formData.status,
      notes: formData.notes
    };

    createContact(leadData);
    
    // Reset form and close modal
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      source: "Website",
      status: "contacted", // Geändert von "new" zu "contacted"
      notes: ""
    });
    setIsOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Neuer Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-gray-100 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Neuen Lead erstellen
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Erstellen Sie einen neuen Lead für Ihr CRM-System.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-gray-300">Vorname *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="bg-gray-800 border-gray-600 text-gray-100"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-gray-300">Nachname *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="bg-gray-800 border-gray-600 text-gray-100"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-300">E-Mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-gray-800 border-gray-600 text-gray-100"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="text-gray-300">Telefon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="bg-gray-800 border-gray-600 text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="company" className="text-gray-300">Unternehmen</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                className="bg-gray-800 border-gray-600 text-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source" className="text-gray-300">Quelle</Label>
              <Select value={formData.source} onValueChange={(value) => handleInputChange("source", value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                  <SelectItem value="Email">E-Mail</SelectItem>
                  <SelectItem value="Referral">Empfehlung</SelectItem>
                  <SelectItem value="Cold Call">Kaltakquise</SelectItem>
                  <SelectItem value="Event">Veranstaltung</SelectItem>
                  <SelectItem value="Other">Sonstiges</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status" className="text-gray-300">Status</Label>
              <Select value={formData.status} onValueChange={(value: Lead['status']) => handleInputChange("status", value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                  <SelectItem value="contacted">Kontaktiert</SelectItem>
                  <SelectItem value="interested">Interessiert</SelectItem>
                  <SelectItem value="qualified">Qualifiziert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="text-gray-300">Notizen</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="bg-gray-800 border-gray-600 text-gray-100"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Abbrechen
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              {isCreating ? "Wird erstellt..." : "Lead erstellen"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
