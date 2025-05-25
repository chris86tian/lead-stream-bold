import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/crm/DashboardHeader";
import { StatsOverview } from "@/components/crm/StatsOverview";
import { LeadsTable } from "@/components/crm/LeadsTable";
import { LeadDetails } from "@/components/crm/LeadDetails";
import { Sidebar } from "@/components/crm/Sidebar";
import { Lead } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useContacts } from "@/hooks/useContacts";

const Index = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { contacts, isLoading } = useContacts();

  // Activate dark mode on component mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-green-950/20 dark flex items-center justify-center">
        <div className="text-white">Lade Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-green-950/20 dark">
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <DashboardHeader />
          
          <main className="p-6 space-y-6">
            <StatsOverview leads={contacts} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20 shadow-2xl shadow-green-500/5">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-green-500/10">
                    <CardTitle className="text-lg font-semibold text-white">
                      Neueste Leads
                    </CardTitle>
                    <Link to="/leads">
                      <Button variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-400/50">
                        <Users className="w-4 h-4 mr-2" />
                        Alle Leads
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent className="p-0">
                    <LeadsTable 
                      leads={contacts.slice(0, 3)} 
                      onSelectLead={setSelectedLead}
                      selectedLead={selectedLead}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-1">
                <LeadDetails lead={selectedLead} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
