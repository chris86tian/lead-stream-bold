import { useState } from "react";
import { Sidebar } from "@/components/crm/Sidebar";
import { DashboardHeader } from "@/components/crm/DashboardHeader";
import { CampaignsList } from "@/components/crm/campaigns/CampaignsList";
import { CreateCampaignForm } from "@/components/crm/campaigns/CreateCampaignForm";
import { ResendSettingsModal } from "@/components/crm/campaigns/ResendSettingsModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Settings, Mail } from "lucide-react";

export default function Campaigns() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [resendModalOpen, setResendModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <DashboardHeader />
        
        <main className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">E-Mail Kampagnen</h1>
                <p className="text-gray-400">Erstellen und verwalten Sie Ihre E-Mail-Kampagnen</p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setResendModalOpen(true)}
                  variant="outline"
                  className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  E-Mail Einstellungen
                </Button>
                <Button
                  onClick={() => setCreateModalOpen(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Neue Kampagne
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-white">Aktive Kampagnen</CardTitle>
                  <Mail className="w-5 h-5 text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">12</div>
                <CardDescription className="text-gray-400">Derzeit laufend</CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-white">Gesendete E-Mails</CardTitle>
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">1,234</div>
                <CardDescription className="text-gray-400">Diesen Monat</CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-white">Öffnungsrate</CardTitle>
                  <Mail className="w-5 h-5 text-yellow-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400">24.5%</div>
                <CardDescription className="text-gray-400">Durchschnittlich</CardDescription>
              </CardContent>
            </Card>
          </div>

          <CampaignsList />
        </main>
      </div>

      <CreateCampaignForm 
        isOpen={createModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
      />
      
      <ResendSettingsModal 
        isOpen={resendModalOpen} 
        onClose={() => setResendModalOpen(false)} 
      />
    </div>
  );
}
