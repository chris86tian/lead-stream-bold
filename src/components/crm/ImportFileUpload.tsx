import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, AlertCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ImportData } from "./LeadImport";
import * as XLSX from 'xlsx';

interface ImportFileUploadProps {
  onFileProcessed: (data: ImportData[]) => void;
}

export function ImportFileUpload({ onFileProcessed }: ImportFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const downloadSampleFile = () => {
    const sampleData = [
      ['Vorname', 'Nachname', 'Email', 'Unternehmen', 'Telefon', 'Website', 'Quelle', 'Notizen'],
      ['Max', 'Mustermann', 'max.mustermann@example.com', 'Mustermann GmbH', '+49 123 456789', 'https://mustermann-gmbh.de', 'Website', 'Interessiert an Premium-Paket'],
      ['Anna', 'Schmidt', 'anna.schmidt@techfirma.de', 'TechFirma AG', '+49 987 654321', 'https://techfirma.de', 'Messe', 'Lead von der CeBIT 2024'],
      ['Peter', 'Weber', 'p.weber@startup.com', 'StartUp Innovation', '+49 555 123456', 'https://startup-innovation.com', 'LinkedIn', 'Kontakt über LinkedIn-Kampagne'],
      ['Sarah', 'Johnson', 'sarah@globalcorp.com', 'Global Corp', '+1 555 789012', 'https://globalcorp.com', 'Empfehlung', 'Empfehlung von bestehenden Kunden'],
      ['Klaus', 'Meyer', 'klaus.meyer@consulting.de', 'Meyer Consulting', '+49 444 987654', 'https://meyer-consulting.de', 'Google Ads', 'Interesse an Beratungsleistungen']
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

    // Generate CSV
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'leads_beispiel.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Beispieldatei heruntergeladen",
      description: "Die Beispiel-CSV-Datei wurde erfolgreich heruntergeladen.",
    });
  };

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    
    try {
      const data = await file.arrayBuffer();
      let workbook: XLSX.WorkBook;
      
      if (file.name.endsWith('.csv')) {
        const text = new TextDecoder().decode(data);
        workbook = XLSX.read(text, { type: 'string' });
      } else {
        workbook = XLSX.read(data, { type: 'array' });
      }
      
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
      
      if (jsonData.length < 2) {
        throw new Error('Die Datei muss mindestens eine Header-Zeile und eine Datenzeile enthalten.');
      }
      
      const headers = jsonData[0].map(h => h?.toString().toLowerCase().trim());
      const rows = jsonData.slice(1);
      
      // Find column indices - support both German and English
      const firstNameIndex = headers.findIndex(h => 
        h.includes('vorname') || h.includes('first') || h.includes('firstname') || h === 'first_name'
      );
      const lastNameIndex = headers.findIndex(h => 
        h.includes('nachname') || h.includes('last') || h.includes('lastname') || h === 'last_name' || h.includes('surname')
      );
      const nameIndex = headers.findIndex(h => h.includes('name') && !h.includes('first') && !h.includes('last') && !h.includes('vor') && !h.includes('nach'));
      const emailIndex = headers.findIndex(h => h.includes('email') || h.includes('e-mail'));
      const companyIndex = headers.findIndex(h => h.includes('company') || h.includes('unternehmen') || h.includes('firma'));
      const phoneIndex = headers.findIndex(h => h.includes('phone') || h.includes('telefon') || h.includes('tel'));
      const websiteIndex = headers.findIndex(h => h.includes('website') || h.includes('webseite') || h.includes('url'));
      const sourceIndex = headers.findIndex(h => h.includes('source') || h.includes('quelle'));
      const notesIndex = headers.findIndex(h => h.includes('notes') || h.includes('notizen') || h.includes('bemerkung'));
      
      if (emailIndex === -1) {
        throw new Error('Die Datei muss mindestens eine Spalte für "Email" enthalten.');
      }
      
      if (firstNameIndex === -1 && lastNameIndex === -1 && nameIndex === -1) {
        throw new Error('Die Datei muss mindestens Spalten für "Vorname" und "Nachname" oder "Name" enthalten.');
      }
      
      const processedData: ImportData[] = [];
      const errors: string[] = [];
      
      for (let i = 0; i < rows.length && i < 1000; i++) {
        const row = rows[i];
        const rowNumber = i + 2; // +2 because of header and 0-based index
        
        let firstName = '';
        let lastName = '';
        
        // Handle different name field configurations
        if (firstNameIndex >= 0 && lastNameIndex >= 0) {
          firstName = row[firstNameIndex]?.toString().trim() || '';
          lastName = row[lastNameIndex]?.toString().trim() || '';
        } else if (nameIndex >= 0) {
          const fullName = row[nameIndex]?.toString().trim() || '';
          const nameParts = fullName.split(' ');
          firstName = nameParts[0] || '';
          lastName = nameParts.slice(1).join(' ') || '';
        }
        
        const email = row[emailIndex]?.toString().trim();
        const company = companyIndex >= 0 ? row[companyIndex]?.toString().trim() : '';
        const phone = phoneIndex >= 0 ? row[phoneIndex]?.toString().trim() : '';
        const website = websiteIndex >= 0 ? row[websiteIndex]?.toString().trim() : '';
        const source = sourceIndex >= 0 ? row[sourceIndex]?.toString().trim() : 'Import';
        const notes = notesIndex >= 0 ? row[notesIndex]?.toString().trim() : '';
        
        // Validation
        if (!firstName && !lastName) {
          errors.push(`Zeile ${rowNumber}: Vor- oder Nachname ist erforderlich`);
          continue;
        }
        
        if (!email) {
          errors.push(`Zeile ${rowNumber}: E-Mail ist erforderlich`);
          continue;
        }
        
        if (!validateEmail(email)) {
          errors.push(`Zeile ${rowNumber}: Ungültige E-Mail-Adresse (${email})`);
          continue;
        }
        
        if (phone && !validatePhone(phone)) {
          errors.push(`Zeile ${rowNumber}: Ungültige Telefonnummer (${phone})`);
          continue;
        }
        
        processedData.push({
          firstName,
          lastName,
          email,
          company,
          phone,
          website,
          source,
          notes
        });
      }
      
      if (errors.length > 0) {
        toast({
          title: "Validierungsfehler",
          description: `${errors.length} Fehler gefunden. Erste Fehler: ${errors.slice(0, 3).join(', ')}`,
          variant: "destructive",
        });
      }
      
      if (processedData.length === 0) {
        throw new Error('Keine gültigen Daten zum Importieren gefunden.');
      }
      
      if (rows.length > 1000) {
        toast({
          title: "Datei zu groß",
          description: `Nur die ersten 1000 Zeilen werden importiert. Ihre Datei enthält ${rows.length} Zeilen.`,
        });
      }
      
      onFileProcessed(processedData);
      
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Fehler beim Verarbeiten der Datei",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onFileProcessed, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.type.includes('csv') || file.type.includes('sheet') || file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      processFile(file);
    } else {
      toast({
        title: "Ungültiger Dateityp",
        description: "Bitte wählen Sie eine CSV- oder Excel-Datei aus.",
        variant: "destructive",
      });
    }
  }, [processFile, toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Datei-Upload
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={downloadSampleFile}
              className="bg-blue-600 border-blue-500 text-white hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Beispieldatei
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-blue-400 bg-blue-400/10' : 'border-gray-600 hover:border-gray-500'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-200 mb-2">
              Datei hier ablegen oder klicken zum Auswählen
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Unterstützte Formate: CSV, Excel (.xlsx)
            </p>
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
              disabled={isProcessing}
            />
            <Button 
              asChild 
              variant="outline" 
              className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
              disabled={isProcessing}
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                {isProcessing ? 'Verarbeite...' : 'Datei auswählen'}
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Hinweise zum Dateiformat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-300">
          <p><strong>Erforderliche Spalten:</strong> Email und (Vorname/Nachname oder Name)</p>
          <p><strong>Name-Formate:</strong> Entweder separate "Vorname" und "Nachname" Spalten oder eine "Name" Spalte</p>
          <p><strong>Optionale Spalten:</strong> Unternehmen, Telefon, Website, Quelle, Notizen</p>
          <p><strong>Sprachen:</strong> Deutsche und englische Spaltennamen werden erkannt</p>
          <p><strong>Maximum:</strong> 1000 Leads pro Import</p>
          <p><strong>Duplikate:</strong> Werden anhand der E-Mail-Adresse erkannt und zusammengeführt</p>
          <p><strong>Tipp:</strong> Laden Sie die Beispieldatei herunter, um das korrekte Format zu sehen</p>
        </CardContent>
      </Card>
    </div>
  );
}
