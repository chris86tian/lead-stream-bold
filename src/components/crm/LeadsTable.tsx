import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, Mail, Phone, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Lead } from "@/types/crm";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { EditLeadModal } from "@/components/crm/EditLeadModal";
import { LeadDetailsPopup } from "@/components/crm/LeadDetailsPopup";
import { useContacts } from "@/hooks/useContacts";

interface LeadsTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  selectedLead: Lead | null;
}

const statusConfig = {
  new: { label: "Neu", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  contacted: { label: "Kontaktiert", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  interested: { label: "Interessiert", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  qualified: { label: "Qualifiziert", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  proposal: { label: "Angebot", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  "closed-won": { label: "Gewonnen", color: "bg-green-600/20 text-green-300 border-green-600/30" },
  "closed-lost": { label: "Verloren", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  // Add common status values from database
  Lead: { label: "Lead", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  Customer: { label: "Kunde", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  Prospect: { label: "Interessent", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" }
};

// Fallback for unknown status
const getStatusConfig = (status: string) => {
  return statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    color: "bg-gray-500/20 text-gray-400 border-gray-500/30"
  };
};

export function LeadsTable({ leads, onSelectLead, selectedLead }: LeadsTableProps) {
  const { toast } = useToast();
  const { deleteContact } = useContacts();
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [detailsLead, setDetailsLead] = useState<Lead | null>(null);
  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);

  const handleLeadClick = (lead: Lead) => {
    setDetailsLead(lead);
    setIsDetailsPopupOpen(true);
  };

  const handleEmailClick = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    if (lead.email) {
      window.open(`mailto:${lead.email}`, '_blank');
      toast({
        title: "E-Mail geöffnet",
        description: `E-Mail-Client für ${lead.name} wird geöffnet.`,
      });
    } else {
      toast({
        title: "Keine E-Mail verfügbar",
        description: "Für diesen Lead ist keine E-Mail-Adresse hinterlegt.",
        variant: "destructive",
      });
    }
  };

  const handlePhoneClick = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    if (lead.phone) {
      window.open(`tel:${lead.phone}`, '_blank');
      toast({
        title: "Anruf gestartet",
        description: `Anruf an ${lead.name} wird eingeleitet.`,
      });
    } else {
      toast({
        title: "Keine Telefonnummer verfügbar",
        description: "Für diesen Lead ist keine Telefonnummer hinterlegt.",
        variant: "destructive",
      });
    }
  };

  const handleCalendarClick = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    // Create a calendar event URL (works with Google Calendar)
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Termin mit ${lead.name}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=Termin mit ${lead.name} von ${lead.company || 'Unbekanntes Unternehmen'}`;
    
    window.open(calendarUrl, '_blank');
    toast({
      title: "Kalenderereignis erstellt",
      description: `Termin mit ${lead.name} wird im Kalender erstellt.`,
    });
  };

  const handleEditClick = (lead: Lead) => {
    setEditingLead(lead);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (lead: Lead) => {
    if (window.confirm(`Möchten Sie den Lead "${lead.name}" wirklich löschen?`)) {
      deleteContact(lead.id);
    }
  };

  const handleDuplicateClick = (lead: Lead) => {
    toast({
      title: "Duplizieren",
      description: `Lead ${lead.name} wird dupliziert (Feature wird entwickelt).`,
    });
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingLead(null);
  };

  const handleDetailsPopupClose = () => {
    setIsDetailsPopupOpen(false);
    setDetailsLead(null);
  };

  return (
    <>
      <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            Aktuelle Leads ({leads.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2 p-6">
            {leads.map((lead) => {
              const statusInfo = getStatusConfig(lead.status);
              return (
                <div
                  key={lead.id}
                  onClick={() => handleLeadClick(lead)}
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-green-500/10",
                    selectedLead?.id === lead.id
                      ? "border-green-500/50 bg-green-500/10 shadow-lg shadow-green-500/20"
                      : "border-green-500/20 bg-gray-800/40 hover:border-green-400/40 hover:bg-gray-800/60"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="font-semibold text-white text-lg">{lead.name}</h3>
                        <Badge 
                          variant="outline" 
                          className={statusInfo.color}
                        >
                          {statusInfo.label}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                        <div className="min-w-0">
                          <span className="font-medium text-gray-400 block">Unternehmen:</span>
                          <p className="text-gray-200 font-medium text-base truncate" title={lead.company || 'Nicht angegeben'}>
                            {lead.company || 'Nicht angegeben'}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-400 block">E-Mail:</span>
                          <p className="text-gray-200 truncate" title={lead.email}>{lead.email}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-gray-400 block">Quelle:</span>
                            <p className="text-gray-200">{lead.source || 'Nicht angegeben'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-400 block">Wert:</span>
                            <p className="font-semibold text-green-400">€{lead.value?.toLocaleString() || '0'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-green-500/10 hover:text-green-400"
                        onClick={(e) => handleEmailClick(lead, e)}
                        title="E-Mail senden"
                      >
                        <Mail className="w-4 h-4 text-gray-300" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-green-500/10 hover:text-green-400"
                        onClick={(e) => handlePhoneClick(lead, e)}
                        title="Anrufen"
                      >
                        <Phone className="w-4 h-4 text-gray-300" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-green-500/10 hover:text-green-400"
                        onClick={(e) => handleCalendarClick(lead, e)}
                        title="Termin erstellen"
                      >
                        <Calendar className="w-4 h-4 text-gray-300" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-green-500/10 hover:text-green-400"
                            title="Weitere Optionen"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-4 h-4 text-gray-300" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          className="bg-gray-800 border-gray-700 text-gray-100"
                          align="end"
                        >
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(lead);
                            }}
                            className="hover:bg-gray-700 cursor-pointer"
                          >
                            Bearbeiten
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateClick(lead);
                            }}
                            className="hover:bg-gray-700 cursor-pointer"
                          >
                            Duplizieren
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(lead);
                            }}
                            className="hover:bg-red-600/20 text-red-400 cursor-pointer"
                          >
                            Löschen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <EditLeadModal
        lead={editingLead}
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
      />

      <LeadDetailsPopup
        lead={detailsLead}
        isOpen={isDetailsPopupOpen}
        onClose={handleDetailsPopupClose}
      />
    </>
  );
}
