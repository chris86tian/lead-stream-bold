import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { ImportPreview } from "./ImportPreview";
import { ImportFileUpload } from "./ImportFileUpload";
import { Lead } from "@/types/crm";

interface LeadImportProps {
  onImportComplete: (importedLeads: Lead[]) => void;
}

export interface ImportData {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  phone?: string;
  website?: string;
  source?: string;
  notes?: string;
}

export function LeadImport({ onImportComplete }: LeadImportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [importData, setImportData] = useState<ImportData[]>([]);
  const [step, setStep] = useState<'upload' | 'preview' | 'importing'>('upload');

  const handleFileProcessed = (data: ImportData[]) => {
    setImportData(data);
    setStep('preview');
  };

  const handleImportConfirm = (processedLeads: Lead[]) => {
    onImportComplete(processedLeads);
    setIsOpen(false);
    setStep('upload');
    setImportData([]);
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep('upload');
    setImportData([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-gray-100 max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Leads Importieren
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto">
          {step === 'upload' && (
            <ImportFileUpload onFileProcessed={handleFileProcessed} />
          )}
          
          {step === 'preview' && (
            <ImportPreview 
              data={importData} 
              onConfirm={handleImportConfirm}
              onBack={() => setStep('upload')}
              onClose={handleClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
