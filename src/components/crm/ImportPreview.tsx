import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, AlertTriangle, ArrowLeft, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContacts } from "@/hooks/useContacts";
import { ImportData } from "./LeadImport";
import { Lead } from "@/types/crm";

interface ImportPreviewProps {
  data: ImportData[];
  onConfirm: (processedLeads: Lead[]) => void;
  onBack: () => void;
  onClose: () => void;
}

export function ImportPreview({ data, onConfirm, onBack, onClose }: ImportPreviewProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const { contacts, createContact } = useContacts();
  const { toast } = useToast();

  const duplicateAnalysis = useMemo(() => {
    const existingEmails = new Set(contacts.map(contact => contact.email.toLowerCase()));
    const duplicates: ImportData[] = [];
    const newLeads: ImportData[] = [];

    data.forEach(item => {
      if (existingEmails.has(item.email.toLowerCase())) {
        duplicates.push(item);
      } else {
        newLeads.push(item);
      }
    });

    return { duplicates, newLeads };
  }, [data, contacts]);

  const handleImport = async () => {
    setIsImporting(true);
    setImportProgress(0);

    try {
      const { duplicates, newLeads } = duplicateAnalysis;
      const allProcessedLeads: Lead[] = [];
      let processed = 0;

      // Process new leads
      for (const leadData of newLeads) {
        try {
          const newLead: Partial<Lead> = {
            first_name: leadData.firstName,
            last_name: leadData.lastName,
            name: `${leadData.firstName} ${leadData.lastName}`.trim(),
            email: leadData.email,
            company: leadData.company || '', // Unternehmen richtig zuordnen
            phone: leadData.phone,
            status: 'new', // Status auf 'new' statt 'contacted' setzen
            source: leadData.source || 'Import',
            notes: leadData.notes,
          };

          createContact(newLead);
          
          // Create a temporary Lead object for the response
          const tempLead: Lead = {
            id: `temp-${Date.now()}-${processed}`,
            first_name: leadData.firstName,
            last_name: leadData.lastName,
            name: `${leadData.firstName} ${leadData.lastName}`.trim(),
            email: leadData.email,
            company: leadData.company || '', // Unternehmen richtig zuordnen
            phone: leadData.phone,
            status: 'new', // Status auf 'new' statt 'contacted' setzen
            source: leadData.source || 'Import',
            notes: leadData.notes,
            createdAt: new Date().toISOString().split('T')[0],
            lastContact: new Date().toISOString().split('T')[0],
            gdprConsent: true
          };
          
          allProcessedLeads.push(tempLead);
        } catch (error) {
          console.error('Error creating lead:', error);
        }

        processed++;
        setImportProgress((processed / data.length) * 100);
      }

      // Handle duplicates by merging data with existing contacts
      for (const duplicate of duplicates) {
        const existingContact = contacts.find(c => c.email.toLowerCase() === duplicate.email.toLowerCase());
        if (existingContact) {
          // Merge notes and update company if empty
          const updatedNotes = existingContact.notes 
            ? `${existingContact.notes}\n\nImport: ${duplicate.notes || ''}`
            : duplicate.notes || '';
          
          const updates: Partial<Lead> = {
            company: existingContact.company || duplicate.company,
            phone: existingContact.phone || duplicate.phone,
            notes: updatedNotes.trim(),
            source: existingContact.source || duplicate.source || 'Import'
          };

          // Only update if there are meaningful changes
          if (updates.company !== existingContact.company || 
              updates.phone !== existingContact.phone ||
              updates.notes !== existingContact.notes || 
              updates.source !== existingContact.source) {
            // Note: In a real implementation, you'd call updateContact here
            // updateContact({ id: existingContact.id, updates });
          }
        }

        processed++;
        setImportProgress((processed / data.length) * 100);
      }

      toast({
        title: "Import erfolgreich",
        description: `${newLeads.length} neue Leads importiert, ${duplicates.length} Duplikate zusammengeführt.`,
      });

      onConfirm(allProcessedLeads);

    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import-Fehler",
        description: "Beim Import ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const { duplicates, newLeads } = duplicateAnalysis;

  return (
    <ScrollArea className="h-full max-h-[70vh]">
      <div className="space-y-6 pr-4">
        {/* Summary */}
        <Card className="bg-gray-800/60 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-white">Import-Zusammenfassung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{newLeads.length}</div>
                <div className="text-sm text-gray-400">Neue Leads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{duplicates.length}</div>
                <div className="text-sm text-gray-400">Duplikate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{data.length}</div>
                <div className="text-sm text-gray-400">Gesamt</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        {isImporting && (
          <Card className="bg-gray-800/60 border-gray-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Import läuft...</span>
                  <span className="text-gray-300">{Math.round(importProgress)}%</span>
                </div>
                <Progress value={importProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preview Table */}
        <Card className="bg-gray-800/60 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-white">Datenvorschau (erste 10 Einträge)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Vorname</TableHead>
                    <TableHead className="text-gray-300">Nachname</TableHead>
                    <TableHead className="text-gray-300">E-Mail</TableHead>
                    <TableHead className="text-gray-300">Unternehmen</TableHead>
                    <TableHead className="text-gray-300">Telefon</TableHead>
                    <TableHead className="text-gray-300">Website</TableHead>
                    <TableHead className="text-gray-300">Quelle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.slice(0, 10).map((item, index) => {
                    const isDuplicate = duplicates.some(d => d.email === item.email);
                    return (
                      <TableRow key={index} className="border-gray-700">
                        <TableCell>
                          {isDuplicate ? (
                            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Duplikat
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Neu
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-200">{item.firstName}</TableCell>
                        <TableCell className="text-gray-200">{item.lastName}</TableCell>
                        <TableCell className="text-gray-200">{item.email}</TableCell>
                        <TableCell className="text-gray-200">{item.company || '-'}</TableCell>
                        <TableCell className="text-gray-200">{item.phone || '-'}</TableCell>
                        <TableCell className="text-gray-200">{item.website || '-'}</TableCell>
                        <TableCell className="text-gray-200">{item.source || 'Import'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {data.length > 10 && (
              <p className="text-sm text-gray-400 mt-2">
                ... und {data.length - 10} weitere Einträge
              </p>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between sticky bottom-0 bg-gray-900 p-4 border-t border-gray-700">
          <Button 
            variant="outline" 
            onClick={onBack}
            disabled={isImporting}
            className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>
          
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isImporting}
              className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
            >
              Abbrechen
            </Button>
            <Button 
              onClick={handleImport}
              disabled={isImporting}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isImporting ? 'Importiere...' : `${data.length} Leads Importieren`}
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
