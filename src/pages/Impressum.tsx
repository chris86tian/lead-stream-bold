import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Impressum = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-green-950/20 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/25">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              CRMbase
            </span>
          </div>
          <Link to="/">
            <Button variant="outline" className="bg-gray-900/80 border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-400/50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
            Impressum
          </h1>

          <div className="grid gap-8">
            {/* Anschrift und Kontakt */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Anschrift und Kontaktangaben</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-green-400 font-semibold mb-2">Firma:</h3>
                  <p className="text-gray-300">Lipa LIFE (Einzelunternehmen)</p>
                </div>
                <div>
                  <h3 className="text-green-400 font-semibold mb-2">Inhaber:</h3>
                  <p className="text-gray-300">Christian Götz</p>
                </div>
                <div>
                  <h3 className="text-green-400 font-semibold mb-2">Adresse:</h3>
                  <p className="text-gray-300">Obertraubenbach 3<br />93489 Schorndorf<br />Deutschland</p>
                </div>
                <div className="grid md:grid-cols-3 gap-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-green-400" />
                    <a href="https://www.lipalife.de" className="text-green-400 hover:text-green-300 transition-colors">
                      www.lipalife.de
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-green-400" />
                    <a href="mailto:mail@lipalife.de" className="text-green-400 hover:text-green-300 transition-colors">
                      mail@lipalife.de
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-green-400" />
                    <a href="tel:+4994616388778" className="text-green-400 hover:text-green-300 transition-colors">
                      +49 9461 63 88 77 8
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verantwortlicher */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Verantwortlicher für Inhalte</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Verantwortlicher für journalistische und redaktionelle Inhalte der Webseite und unserer Produkte gemäß § 55 Abs. 2 RStV:
                </p>
                <p className="text-green-400 font-semibold mt-2">Christian Götz</p>
              </CardContent>
            </Card>

            {/* Steuerliche Angaben */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Steuerliche Angaben</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-green-400 font-semibold mb-2">Umsatzsteueridentifikationsnummer gemäß § 27a Umsatzsteuergesetz:</h3>
                  <p className="text-gray-300">DE361798217</p>
                </div>
                <div>
                  <h3 className="text-green-400 font-semibold mb-2">Steuernummer:</h3>
                  <p className="text-gray-300">211/167/70501</p>
                </div>
              </CardContent>
            </Card>

            {/* Konzept und Design */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Konzept und Webdesign</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-green-400 font-semibold mb-2">Fotos und Bilder:</h3>
                  <p className="text-gray-300">Die Rechte bzw. die Verantwortung für die entsprechenden Fotos liegen bei Lipa Life.</p>
                </div>
                <div>
                  <h3 className="text-green-400 font-semibold mb-2">Konzept und Webdesign:</h3>
                  <p className="text-gray-300">
                    Lipa LIFE: 
                    <a href="https://www.lipalife.de" className="text-green-400 hover:text-green-300 ml-2 transition-colors">
                      www.lipalife.de
                    </a>
                  </p>
                  <p className="text-gray-300">
                    E-Mail: 
                    <a href="mailto:mail@lipalife.de" className="text-green-400 hover:text-green-300 ml-2 transition-colors">
                      mail@lipalife.de
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Haftungsausschluss */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Haftungsausschluss</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-green-400 font-semibold mb-3">Haftung für Inhalte</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Die Inhalte der Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Als Diensteanbieter besteht gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen eine Verantwortlichkeit. Nach §§ 8 bis 10 TMG besteht jedoch keine Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden entsprechende Inhalte entfernt.
                  </p>
                </div>

                <div>
                  <h3 className="text-green-400 font-semibold mb-3">Haftung für Links</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Diese Webseite enthält Links zu externen Webseiten Dritter, auf deren Inhalte kein Einfluss besteht. Deshalb kann für diese fremden Inhalte auch keine Gewähr übernommen werden. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden derartige Links umgehend entfernt.
                  </p>
                </div>

                <div>
                  <h3 className="text-green-400 font-semibold mb-3">Urheberrecht</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitte um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden derartige Inhalte umgehend entfernt.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* EU-Streitschlichtung */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Hinweis auf EU-Streitschlichtung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Die EU-Kommission bietet auf ihrer Webseite eine Plattform zur Online-Streitbeilegung (OS-Plattform) an, die als Anlaufstelle für außergerichtliche Streitbeilegung dient. Sie finden die OS-Plattform unter folgendem Link: 
                  <a 
                    href="https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home.chooseLanguage" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 ml-2 transition-colors underline"
                  >
                    OS-Plattform der EU-Kommission
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-green-500/20 py-8 bg-gray-900/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 Lipa LIFE. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Impressum;
