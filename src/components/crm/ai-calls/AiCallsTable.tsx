import { useState } from "react";
import { AiCall } from "@/types/aiCalls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Play, Clock, User, Eye } from "lucide-react";
import { AiCallDetailsModal } from "./AiCallDetailsModal";

interface AiCallsTableProps {
  aiCalls: AiCall[];
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
  if (!seconds) return '-';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export function AiCallsTable({ aiCalls }: AiCallsTableProps) {
  const [selectedCall, setSelectedCall] = useState<AiCall | null>(null);

  return (
    <>
      <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/60">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center">
            <Phone className="w-5 h-5 mr-2" />
            AI-Calls Übersicht
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiCalls.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Keine AI-Calls gefunden.
              </div>
            ) : (
              aiCalls.map((call) => (
                <div
                  key={call.id}
                  className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-medium">
                          {call.contact ? 
                            `${call.contact.first_name || ''} ${call.contact.last_name || ''}`.trim() || 'Unbekannter Kontakt'
                            : 'Unbekannter Kontakt'
                          }
                        </span>
                        {call.contact?.company && (
                          <span className="text-gray-400 text-sm">({call.contact.company})</span>
                        )}
                      </div>
                      
                      <Badge variant={getStatusBadgeVariant(call.status)}>
                        {getStatusText(call.status)}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(call.duration)}</span>
                      </div>
                      
                      <span className="text-gray-400 text-sm">
                        {new Date(call.call_date).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>

                      {call.recording_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-600/20 border-green-600/40 text-green-400 hover:bg-green-600/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(call.recording_url, '_blank');
                          }}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Aufzeichnung
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-600/20 border-gray-600/40 text-gray-300 hover:bg-gray-600/30"
                        onClick={() => setSelectedCall(call)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>

                  {call.summary && (
                    <div className="mt-3 pt-3 border-t border-gray-600/30">
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {call.summary}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {selectedCall && (
        <AiCallDetailsModal
          call={selectedCall}
          isOpen={!!selectedCall}
          onClose={() => setSelectedCall(null)}
        />
      )}
    </>
  );
}
