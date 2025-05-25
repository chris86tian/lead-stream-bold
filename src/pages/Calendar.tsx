import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/crm/DashboardHeader";
import { Sidebar } from "@/components/crm/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Search, Clock, User, Building, Mail, Phone } from "lucide-react";
import { useContacts } from "@/hooks/useContacts";
import { Lead } from "@/types/crm";
import { useToast } from "@/hooks/use-toast";

const Calendar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [filteredAppointments, setFilteredAppointments] = useState<Lead[]>([]);
  
  const { contacts, isLoading } = useContacts();
  const { toast } = useToast();

  // Activate dark mode on component mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Filter appointments based on search term and date filter
  useEffect(() => {
    // Filter for leads with appointment-related status
    let appointmentLeads = contacts.filter(lead => 
      lead.status?.toLowerCase().includes('termin') || 
      lead.status?.toLowerCase().includes('appointment') ||
      lead.status === 'qualified' ||
      lead.status === 'interested'
    );

    if (searchTerm) {
      appointmentLeads = appointmentLeads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter !== "all") {
      const today = new Date();
      const filterDate = new Date(today);
      
      switch (dateFilter) {
        case "today":
          filterDate.setHours(23, 59, 59, 999);
          appointmentLeads = appointmentLeads.filter(lead => {
            const leadDate = new Date(lead.createdAt || lead.created_at || '');
            return leadDate.toDateString() === today.toDateString();
          });
          break;
        case "week":
          filterDate.setDate(today.getDate() + 7);
          appointmentLeads = appointmentLeads.filter(lead => {
            const leadDate = new Date(lead.createdAt || lead.created_at || '');
            return leadDate >= today && leadDate <= filterDate;
          });
          break;
        case "month":
          filterDate.setMonth(today.getMonth() + 1);
          appointmentLeads = appointmentLeads.filter(lead => {
            const leadDate = new Date(lead.createdAt || lead.created_at || '');
            return leadDate >= today && leadDate <= filterDate;
          });
          break;
      }
    }

    setFilteredAppointments(appointmentLeads);
  }, [searchTerm, dateFilter, contacts]);

  const handleEmailClick = (lead: Lead) => {
    if (lead.email) {
      window.open(`mailto:${lead.email}`, '_blank');
      toast({
        title: "E-Mail geöffnet",
        description: `E-Mail-Client für ${lead.name} wird geöffnet.`,
      });
    }
  };

  const handlePhoneClick = (lead: Lead) => {
    if (lead.phone) {
      window.open(`tel:${lead.phone}`, '_blank');
      toast({
        title: "Anruf gestartet",
        description: `Anruf an ${lead.name} wird eingeleitet.`,
      });
    }
  };

  const handleScheduleAppointment = (lead: Lead) => {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Termin mit ${lead.name}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=Termin mit ${lead.name} von ${lead.company || 'Unbekanntes Unternehmen'}`;
    
    window.open(calendarUrl, '_blank');
    toast({
      title: "Kalenderereignis erstellt",
      description: `Termin mit ${lead.name} wird im Kalender erstellt.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'qualified':
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case 'interested':
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black dark flex items-center justify-center">
        <div className="text-white">Lade Termine...</div>
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent flex items-center">
                  <CalendarIcon className="w-8 h-8 mr-3 text-green-400" />
                  Termine
                </h1>
                <p className="text-gray-300 mt-1">
                  Verwalten Sie alle geplanten Termine mit Ihren Leads
                </p>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/60">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Gesamt Termine</CardTitle>
                  <CalendarIcon className="w-4 h-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{filteredAppointments.length}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/60">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Qualifizierte Leads</CardTitle>
                  <User className="w-4 h-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {filteredAppointments.filter(lead => lead.status === 'qualified').length}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/60">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Interessierte Leads</CardTitle>
                  <Clock className="w-4 h-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {filteredAppointments.filter(lead => lead.status === 'interested').length}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/60">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Termine heute</CardTitle>
                  <CalendarIcon className="w-4 h-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {filteredAppointments.filter(lead => {
                      const leadDate = new Date(lead.createdAt || lead.created_at || '');
                      return leadDate.toDateString() === new Date().toDateString();
                    }).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/60">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Filter & Suche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Termine durchsuchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-700/50 border-gray-600/60 text-gray-100 placeholder:text-gray-400"
                    />
                  </div>
                  
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600/60 text-gray-100">
                      <SelectValue placeholder="Zeitraum wählen" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                      <SelectItem value="all">Alle Zeiträume</SelectItem>
                      <SelectItem value="today">Heute</SelectItem>
                      <SelectItem value="week">Diese Woche</SelectItem>
                      <SelectItem value="month">Dieser Monat</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm("");
                        setDateFilter("all");
                      }}
                      className="bg-gray-700/50 border-gray-600/60 text-gray-300 hover:bg-gray-700"
                    >
                      Filter zurücksetzen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appointments List */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Geplante Termine ({filteredAppointments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2 p-6">
                  {filteredAppointments.length === 0 ? (
                    <div className="text-center py-12">
                      <CalendarIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-300 mb-2">
                        Keine Termine gefunden
                      </h3>
                      <p className="text-gray-500">
                        Es wurden keine Leads mit Termin-Status gefunden.
                      </p>
                    </div>
                  ) : (
                    filteredAppointments.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-4 rounded-xl border-2 border-green-500/20 bg-gray-800/40 hover:border-green-400/40 hover:bg-gray-800/60 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-3">
                              <h3 className="font-semibold text-white text-lg">{lead.name}</h3>
                              <Badge variant="outline" className={getStatusColor(lead.status)}>
                                {lead.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                              <div className="flex items-center space-x-2">
                                <Building className="w-4 h-4 text-gray-400" />
                                <div>
                                  <span className="font-medium text-gray-400 block">Unternehmen:</span>
                                  <p className="text-gray-200 font-medium">{lead.company || 'Nicht angegeben'}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <div>
                                  <span className="font-medium text-gray-400 block">E-Mail:</span>
                                  <p className="text-gray-200">{lead.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <div>
                                  <span className="font-medium text-gray-400 block">Erstellt:</span>
                                  <p className="text-gray-200">
                                    {new Date(lead.createdAt || lead.created_at || '').toLocaleDateString('de-DE')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 hover:bg-green-500/10 hover:text-green-400"
                              onClick={() => handleEmailClick(lead)}
                              title="E-Mail senden"
                            >
                              <Mail className="w-4 h-4 text-gray-300" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 hover:bg-green-500/10 hover:text-green-400"
                              onClick={() => handlePhoneClick(lead)}
                              title="Anrufen"
                            >
                              <Phone className="w-4 h-4 text-gray-300" />
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleScheduleAppointment(lead)}
                            >
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              Termin planen
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
