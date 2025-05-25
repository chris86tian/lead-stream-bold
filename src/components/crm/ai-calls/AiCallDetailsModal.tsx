import { AiCall } from "@/types/aiCalls";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Phone, Clock, User, Calendar, Play, FileText, MessageSquare } from "lucide-react";

interface AiCallDetailsModalProps {
  call: AiCall;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'successful':
      return 'default';
    case 'failed':
      return 'destructive';
    case 'no_answer':
      return 'secondary';
    case 'busy':
      return 'outline';
    default:
      return 'secondary';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'successful':
      return 'Erfolgreich';
    case 'failed':
      return 'Fehlgeschlagen';
    case 'no_answer':
      return 'Nicht erreicht';
    case 'busy':
      return 'Besetzt';
    default:
      return status;
  }
};

const formatDuration = (seconds?: number) => {
  if (!seconds) return 'Keine Angabe';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} Min ${remainingSeconds} Sek`;
};

export function AiCallDetailsModal({ call, isOpen, onClose }: AiCallDetailsModalProps) {
  const contactName = call.contact ? 
    `${call.contact.first_name || ''} ${call.contact.last_name || ''}`.trim() || 'Unbekannter Kontakt'
    : 'Unbekannter Kontakt';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center">
            <Phone className="w-5 h-5 mr-2" />
            AI-Call Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <User className="w-4 h-4 mr-2" />
              Kontakt Information
            </h3>
            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Name:</span>
                  <p className="text-white">{contactName}</p>
                </div>
                {call.contact?.company && (
                  <div>
                    <span className="text-gray-400 text-sm">Unternehmen:</span>
                    <p className="text-white">{call.contact.company}</p>
                  </div>
                )}
                {call.contact?.email && (
                  <div>
                    <span className="text-gray-400 text-sm">E-Mail:</span>
                    <p className="text-white">{call.contact.email}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="bg-gray-600" />

          {/* Call Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Anruf Information
            </h3>
            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Datum & Zeit:</span>
                  <p className="text-white flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(call.call_date).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Dauer:</span>
                  <p className="text-white flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(call.duration)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Status:</span>
                  <div className="mt-1">
                    <Badge variant={getStatusBadgeVariant(call.status)}>
                      {getStatusText(call.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Typ:</span>
                  <p className="text-white">{call.call_type === 'outgoing' ? 'Ausgehend' : 'Eingehend'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recording */}
          {call.recording_url && (
            <>
              <Separator className="bg-gray-600" />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Play className="w-4 h-4 mr-2" />
                  Aufzeichnung
                </h3>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <audio
                    controls
                    className="w-full"
                    src={call.recording_url}
                  >
                    Ihr Browser unterstützt das Audio-Element nicht.
                  </audio>
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-green-600/20 border-green-600/40 text-green-400 hover:bg-green-600/30"
                      onClick={() => window.open(call.recording_url, '_blank')}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      In neuem Tab öffnen
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Summary */}
          {call.summary && (
            <>
              <Separator className="bg-gray-600" />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Zusammenfassung
                </h3>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <p className="text-gray-300 whitespace-pre-wrap">{call.summary}</p>
                </div>
              </div>
            </>
          )}

          {/* Notes */}
          {call.notes && (
            <>
              <Separator className="bg-gray-600" />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Notizen
                </h3>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <p className="text-gray-300 whitespace-pre-wrap">{call.notes}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
