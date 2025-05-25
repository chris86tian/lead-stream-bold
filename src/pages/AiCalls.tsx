import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/crm/DashboardHeader";
import { Sidebar } from "@/components/crm/Sidebar";
import { AiCallsTable } from "@/components/crm/ai-calls/AiCallsTable";
import { useAiCalls } from "@/hooks/useAiCalls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Search, Filter, Download } from "lucide-react";
import { AiCall } from "@/types/aiCalls";

export default function AiCalls() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [filteredCalls, setFilteredCalls] = useState<AiCall[]>([]);

  const { aiCalls, isLoading } = useAiCalls();

  // Activate dark mode on component mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Filter calls based on search term and filters
  useEffect(() => {
    let filtered = aiCalls;

    if (searchTerm) {
      filtered = filtered.filter(call => {
        const contactName = call.contact ? 
          `${call.contact.first_name || ''} ${call.contact.last_name || ''}`.trim()
          : '';
        const company = call.contact?.company || '';
        const email = call.contact?.email || '';
        
        return contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               company.toLowerCase().includes(searchTerm.toLowerCase()) ||
               email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               (call.summary && call.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
               (call.notes && call.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(call => call.status === statusFilter);
    }

    setFilteredCalls(filtered);
  }, [searchTerm, statusFilter, aiCalls]);

  // Calculate statistics
  const stats = {
    total: aiCalls.length,
    successful: aiCalls.filter(call => call.status === 'successful').length,
    failed: aiCalls.filter(call => call.status === 'failed').length,
    totalDuration: aiCalls.reduce((acc, call) => acc + (call.duration || 0), 0)
  };

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black dark flex items-center justify-center">
        <div className="text-white">Lade AI-Calls...</div>
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  KI-Anrufe
                </h1>
                <p className="text-gray-300 mt-1">
                  Übersicht über alle KI-gesteuerten Anrufe
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button variant="outline" className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-white">Gesamt Anrufe</CardTitle>
                    <Phone className="w-5 h-5 text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-white">Erfolgreich</CardTitle>
                    <Phone className="w-5 h-5 text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{stats.successful}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-white">Fehlgeschlagen</CardTitle>
                    <Phone className="w-5 h-5 text-red-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">{stats.failed}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-white">Gesprächszeit</CardTitle>
                    <Phone className="w-5 h-5 text-yellow-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">{formatTotalDuration(stats.totalDuration)}</div>
                </CardContent>
              </Card>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative col-span-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Anrufe durchsuchen (Name, Unternehmen, E-Mail, Notizen)..."
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
                      <SelectItem value="successful">Erfolgreich</SelectItem>
                      <SelectItem value="failed">Fehlgeschlagen</SelectItem>
                      <SelectItem value="no_answer">Nicht erreicht</SelectItem>
                      <SelectItem value="busy">Besetzt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            {/* AI Calls Table */}
            <AiCallsTable aiCalls={filteredCalls} />
          </main>
        </div>
      </div>
    </div>
  );
}
