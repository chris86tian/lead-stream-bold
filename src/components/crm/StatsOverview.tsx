import { TrendingUp, Users, Target, Euro, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead } from "@/types/crm";

interface StatsOverviewProps {
  leads: Lead[];
}

export function StatsOverview({ leads }: StatsOverviewProps) {
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    interested: leads.filter(l => l.status === 'interested').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    totalValue: leads.reduce((sum, lead) => sum + lead.value, 0),
    conversionRate: 24.5 // Mock data
  };

  const statCards = [
    {
      title: "Gesamt Leads",
      value: stats.total,
      icon: Users,
      trend: "+12%",
      trendUp: true,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Neue Leads",
      value: stats.new,
      icon: Target,
      trend: "+5%",
      trendUp: true,
      gradient: "from-green-400 to-green-600"
    },
    {
      title: "Interessiert",
      value: stats.interested,
      icon: TrendingUp,
      trend: "+18%",
      trendUp: true,
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      title: "Pipeline Wert",
      value: `€${stats.totalValue.toLocaleString()}`,
      icon: Euro,
      trend: "+7%",
      trendUp: true,
      gradient: "from-green-600 to-emerald-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden bg-gray-900/80 backdrop-blur-sm border-green-500/20 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 group hover:border-green-400/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className="flex items-center text-sm">
              {stat.trendUp ? (
                <ArrowUp className="w-4 h-4 text-green-400 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-400 mr-1" />
              )}
              <span className={stat.trendUp ? "text-green-400" : "text-red-400"}>
                {stat.trend}
              </span>
              <span className="text-gray-400 ml-1">vs. letzter Monat</span>
            </div>
          </CardContent>
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
        </Card>
      ))}
    </div>
  );
}
