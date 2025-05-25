import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, Phone, BarChart3, Shield, Target, Zap, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthModal } from "@/components/auth/AuthModal";

const Landing = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup attempt:", { email, name });
    // TODO: Implement actual signup logic
  };

  const scrollToHowItWorks = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Mail,
      title: "Value-basierte E-Mail-Sequenz",
      description: "Individuelle, wertorientierte E-Mail-Strecke. Keine Standard-Floskeln, sondern relevante Impulse und konkrete Lösungen."
    },
    {
      icon: Target,
      title: "Interesse durch Klicks",
      description: "Nur Leads, die durch Link-Klicks echtes Interesse zeigen, gehen in die nächste Runde. Kein Blindflug mehr."
    },
    {
      icon: Phone,
      title: "KI-Qualifizierungs-Call",
      description: "Auto-Caller klärt letzte Fragen und liefert alle Infos. Im Beratungsgespräch geht's nur noch um das 'Wie' und 'Wann'."
    },
    {
      icon: BarChart3,
      title: "Prozess auf Autopilot",
      description: "E-Mail, Klick-Analyse, KI-Call, Beratung – alles aus einer Hand. Kein Chaos, keine Zeitverschwendung."
    },
    {
      icon: Shield,
      title: "Messbarer Vertriebserfolg",
      description: "Jeder Schritt wird getrackt und reportet. Sie wissen jederzeit, wo Ihre Leads stehen – und warum sie kaufen."
    },
    {
      icon: Zap,
      title: "100% Fokus auf kaufbereite Kunden",
      description: "Sie sprechen nur mit Entscheidern, die wirklich wollen. Kein Vertriebsteam, das Leads 'warmquatscht'."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-green-950/20 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/25">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              CRMbase
            </span>
          </div>
          <Button 
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25"
          >
            Anmelden
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30 mb-8">
            <span className="text-green-400 font-semibold">Die SmartQual-Sequence™ von CRMbase</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Weg mit <span className="text-red-400">Kaltakquise</span>.
            <br />
            Willkommen in der <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">Zukunft</span> der Lead-Qualifizierung.
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Vergiss das klassische Callcenter-Gewurschtel. Mit unserer SmartQual-Sequence™ holen Sie nur noch die heißesten Leads ans Telefon – und das vollautomatisch.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg shadow-lg shadow-green-500/25"
            >
              Jetzt kostenlos testen
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={scrollToHowItWorks}
              className="bg-gray-900/80 border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-400/50 px-8 py-4 text-lg"
            >
              Mehr erfahren
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Wie funktioniert's?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Drei Schritte zur perfekten Lead-Qualifizierung
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20 text-center hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 group hover:border-green-400/30">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white">1. Value-basierte E-Mail-Sequenz</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Jeder Lead erhält eine individuelle, wertorientierte E-Mail-Strecke. Keine Standard-Floskeln, sondern relevante Impulse und konkrete Lösungen.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20 text-center hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 group hover:border-green-400/30">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white">2. Interesse durch Klicks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Kein Blindflug mehr: Nur Leads, die durch Link-Klicks echtes Interesse zeigen, gehen in die nächste Runde.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20 text-center hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 group hover:border-green-400/30">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-600/25 group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white">3. KI-Qualifizierungs-Call</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Auto-Caller klärt letzte Fragen, beantwortet Einwände. Im Beratungsgespräch geht's nur noch ums "Wie" und "Wann".
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Die CRMbase Vorteile auf einen Blick
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Mehr Abschluss, weniger Aufwand.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-900/80 backdrop-blur-sm border-green-500/20 hover:bg-gray-900/90 hover:border-green-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
              <CardHeader>
                <feature.icon className="w-8 h-8 text-green-400 mb-2" />
                <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Jetzt Vertrieb neu denken.
          </h2>
          <p className="text-2xl text-gray-300 mb-8">
            SmartQual-Sequence™ by CRMbase – Das ist die Zukunft.
          </p>
          <p className="text-xl text-green-400 mb-12 font-semibold">
            Sind Sie bereit?
          </p>

          <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20 max-w-md mx-auto shadow-2xl shadow-green-500/10">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Kostenlos registrieren</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-800/50 border-green-500/30 text-white focus:border-green-400 focus:ring-green-400/20"
                    placeholder="Ihr Name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-300">E-Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800/50 border-green-500/30 text-white focus:border-green-400 focus:ring-green-400/20"
                    placeholder="ihre@email.de"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 shadow-lg shadow-green-500/25"
                >
                  Jetzt starten
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-500/20 py-12 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/25">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                CRMbase
              </span>
            </div>
            
            <div className="flex space-x-6">
              <Link 
                to="/impressum" 
                className="text-gray-300 hover:text-green-400 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-green-500/10"
              >
                Impressum
              </Link>
              <Link 
                to="/datenschutz" 
                className="text-gray-300 hover:text-green-400 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-green-500/10"
              >
                Datenschutz
              </Link>
            </div>
          </div>
          
          <div className="text-center mt-8 text-gray-400 font-medium">
            © 2025 CRMbase. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Landing;
