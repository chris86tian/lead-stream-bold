import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/crm/DashboardHeader";
import { LeadsTable } from "@/components/crm/LeadsTable";
import { Sidebar } from "@/components/crm/Sidebar";
import { LeadImport } from "@/components/crm/LeadImport";
import { CreateLeadModal } from "@/components/crm/CreateLeadModal";
import { Lead } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContacts } from "@/hooks/useContacts";
import { useToast } from "@/hooks/use-toast";

const Leads = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  
  const { contacts, isLoading } = useContacts();
  const { toast } = useToast();

  // Activate dark mode on component mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Filter leads based on search term and filters
  useEffect(() => {
    let filtered = contacts;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (sourceFilter !== "all") {
      filtered = filtered.filter(lead => lead.source === sourceFilter);
    }

    setFilteredLeads(filtered);
  }, [searchTerm, statusFilter, sourceFilter, contacts]);

  const uniqueSources = Array.from(new Set(contacts.map(lead => lead.source)));

  const handleImportComplete = (importedLeads: Lead[]) => {
    toast({
      title: "Import erfolgreich",
      description: `${importedLeads.length} Leads wurden erfolgreich importiert.`,
    });
    // The contacts will be automatically refreshed by the useContacts hook
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black dark flex items-center justify-center">
        <div className="text-white">Lade Leads...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black dark">
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <DashboardHeader />
          
          <main className="p-6 space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Leads Verwaltung
                </h1>
                <p className="text-gray-300 mt-1">
                  Verwalten Sie alle Ihre Leads an einem Ort
                </p>
              </div>
              
              <div className="flex space-x-3">
                <LeadImport onImportComplete={handleImportComplete} />
                <Button variant="outline" className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <CreateLeadModal />
              </div>
            </div>

            {/* Filters and Search */}
            <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/60">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filter & Suche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Leads durchsuchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-700/50 border-gray-600/60 text-gray-100 placeholder:text-gray-400"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600/60 text-gray-100">
                      <SelectValue placeholder="Status wählen" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                      <SelectItem value="all">Alle Status</SelectItem>
                      <SelectItem value="new">Neu</SelectItem>
                      <SelectItem value="contacted">Kontaktiert</SelectItem>
                      <SelectItem value="interested">Interessiert</SelectItem>
                      <SelectItem value="qualified">Qualifiziert</SelectItem>
                      <SelectItem value="proposal">Angebot</SelectItem>
                      <SelectItem value="closed-won">Gewonnen</SelectItem>
                      <SelectItem value="closed-lost">Verloren</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600/60 text-gray-100">
                      <SelectValue placeholder="Quelle wählen" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                      <SelectItem value="all">Alle Quellen</SelectItem>
                      {uniqueSources.map(source => (
                        <SelectItem key={source} value={source}>{source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                        setSourceFilter("all");
                      }}
                      className="bg-gray-700/50 border-gray-600/60 text-gray-300 hover:bg-gray-700"
                    >
                      Filter zurücksetzen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Leads Overview - Now full width */}
            <div className="w-full">
              <LeadsTable 
                leads={filteredLeads} 
                onSelectLead={setSelectedLead}
                selectedLead={selectedLead}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Leads;
