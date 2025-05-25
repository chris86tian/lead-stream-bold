import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lead } from "@/types/crm";
import { Mail, Phone, Calendar, MapPin, Clock, Euro, User, Building, Zap, Shield } from "lucide-react";

interface LeadDetailsProps {
  lead: Lead | null;
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

export function LeadDetails({ lead }: LeadDetailsProps) {
  if (!lead) {
    return (
      <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/60">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-gray-400">
            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Wählen Sie einen Lead aus, um Details anzuzeigen</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusInfo = getStatusConfig(lead.status);

  return (
    <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/60">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white">
            Lead Details
          </CardTitle>
          <Badge 
            variant="outline" 
            className={statusInfo.color}
          >
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Kontaktinformationen */}
        <div>
          <h3 className="font-semibold text-white mb-3 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Kontaktdaten
          </h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Mail className="w-4 h-4 text-gray-400 mr-3" />
              <span className="text-gray-300">{lead.email}</span>
            </div>
            <div className="flex items-center text-sm">
              <Building className="w-4 h-4 text-gray-400 mr-3" />
              <span className="text-gray-300">{lead.company || 'Nicht angegeben'}</span>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Lead-Informationen */}
        <div>
          <h3 className="font-semibold text-white mb-3 flex items-center">
            <Euro className="w-4 h-4 mr-2" />
            Lead-Informationen
          </h3>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Quelle:</span>
              <span className="font-medium text-gray-200">{lead.source || 'Nicht angegeben'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Wert:</span>
              <span className="font-semibold text-green-400">€{lead.value?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Berater:</span>
              <span className="font-medium text-gray-200">{lead.assignedTo || 'Nicht zugewiesen'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Erstellt:</span>
              <span className="font-medium text-gray-200">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('de-DE') : 'Nicht angegeben'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Letzter Kontakt:</span>
              <span className="font-medium text-gray-200">{lead.lastContact ? new Date(lead.lastContact).toLocaleDateString('de-DE') : 'Nicht angegeben'}</span>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* DSGVO Status */}
        <div>
          <h3 className="font-semibold text-white mb-3 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            DSGVO Compliance
          </h3>
          <div className="flex items-center text-sm">
            <div className={`w-2 h-2 rounded-full mr-2 ${lead.gdprConsent ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-gray-300">
              {lead.gdprConsent ? 'Einverständnis erteilt' : 'Kein Einverständnis'}
            </span>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Notizen */}
        <div>
          <h3 className="font-semibold text-white mb-3">Notizen</h3>
          <p className="text-sm text-gray-300 bg-gray-700/50 p-3 rounded-lg">
            {lead.notes || 'Keine Notizen verfügbar'}
          </p>
        </div>

        {/* Aktionen */}
        <div className="space-y-2">
          <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
            <Mail className="w-4 h-4 mr-2" />
            E-Mail senden
          </Button>
          <Button variant="outline" className="w-full bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700">
            <Calendar className="w-4 h-4 mr-2" />
            Termin vereinbaren
          </Button>
          <Button variant="outline" className="w-full bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700">
            <Zap className="w-4 h-4 mr-2" />
            Workflow starten
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
