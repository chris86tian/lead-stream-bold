import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, Globe, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Datenschutz = () => {
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
            Datenschutzerklärung
          </h1>

          <div className="grid gap-8">
            {/* Einleitung */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center">
                  <Shield className="w-6 h-6 text-green-400 mr-2" />
                  Datenschutz im Überblick
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Der Schutz Ihrer persönlichen Daten ist uns sehr wichtig. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Die Nutzung unserer CRM-Software erfolgt im Einklang mit der Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz (BDSG).
                </p>
              </CardContent>
            </Card>

            {/* Verantwortlicher */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Verantwortlicher</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-300">
                    <strong className="text-green-400">Lipa LIFE (Einzelunternehmen)</strong><br />
                    Christian Götz<br />
                    Obertraubenbach 3<br />
                    93489 Schorndorf<br />
                    Deutschland
                  </p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-green-400" />
                    <a href="mailto:mail@lipalife.de" className="text-green-400 hover:text-green-300 transition-colors">
                      mail@lipalife.de
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-green-400" />
                    <a href="https://www.lipalife.de" className="text-green-400 hover:text-green-300 transition-colors">
                      www.lipalife.de
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Datenerfassung */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Datenerfassung auf unserer Website</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-green-400 font-semibold mb-3">Cookies</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Unsere Internetseiten verwenden teilweise so genannte Cookies. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren. Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen. Die meisten der von uns verwendeten Cookies sind so genannte "Session-Cookies", die nach Ende Ihres Besuchs automatisch gelöscht werden.
                  </p>
                </div>

                <div>
                  <h3 className="text-green-400 font-semibold mb-3">Server-Log-Dateien</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
                  </p>
                  <ul className="text-gray-300 list-disc pl-6 mt-2 space-y-1">
                    <li>Browsertyp und Browserversion</li>
                    <li>verwendetes Betriebssystem</li>
                    <li>Referrer URL</li>
                    <li>Hostname des zugreifenden Rechners</li>
                    <li>Uhrzeit der Serveranfrage</li>
                    <li>IP-Adresse</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-green-400 font-semibold mb-3">Kontaktformular und Registrierung</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Wenn Sie uns per Kontaktformular Anfragen zukommen lassen oder sich registrieren, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* CRM-spezifische Datenverarbeitung */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">CRM-Datenverarbeitung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-green-400 font-semibold mb-3">Lead-Management</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Wir verwenden Ihre Daten zur Verwaltung von Leads und Kundenbeziehungen. Hierzu gehören:
                  </p>
                  <ul className="text-gray-300 list-disc pl-6 mt-2 space-y-1">
                    <li>Name, Telefonnummer, E-Mail-Adresse</li>
                    <li>Unternehmensinformationen</li>
                    <li>Kommunikationshistorie</li>
                    <li>Interaktionsdaten und Aktivitätsstatus</li>
                    <li>Kaufhistorie und Präferenzen</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-green-400 font-semibold mb-3">E-Mail-Marketing</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Für unser E-Mail-Marketing verwenden wir automatisierte E-Mail-Sequenzen über n8n. Ihre E-Mail-Adresse wird nur mit Ihrer ausdrücklichen Einwilligung für den Versand von Marketing-E-Mails verwendet. Sie können diese Einwilligung jederzeit widerrufen.
                  </p>
                </div>

                <div>
                  <h3 className="text-green-400 font-semibold mb-3">Telefonische Kontaktaufnahme</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Wir verwenden KI-gestützte Anrufsysteme über n8n für die Qualifizierung von Leads. Anrufe erfolgen nur mit Ihrer vorherigen Einwilligung. Gesprächsdaten werden protokolliert und können zu Qualitätssicherungszwecken aufgezeichnet werden.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* n8n Integration */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">n8n Workflow-Automation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Wir verwenden n8n für die Automatisierung unserer CRM-Prozesse. Diese Plattform verarbeitet Ihre Daten zur:
                </p>
                <ul className="text-gray-300 list-disc pl-6 space-y-1">
                  <li>Automatisierten E-Mail-Versendung</li>
                  <li>Lead-Qualifizierung und -Bewertung</li>
                  <li>Terminvereinbarung und Follow-up</li>
                  <li>Datenintegration zwischen verschiedenen Systemen</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) oder zur Erfüllung eines Vertrags (Art. 6 Abs. 1 lit. b DSGVO).
                </p>
              </CardContent>
            </Card>

            {/* Ihre Rechte */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Ihre Rechte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
                </p>
                <ul className="text-gray-300 list-disc pl-6 space-y-2">
                  <li><strong className="text-green-400">Recht auf Auskunft</strong> über die gespeicherten Daten</li>
                  <li><strong className="text-green-400">Recht auf Berichtigung</strong> unrichtiger Daten</li>
                  <li><strong className="text-green-400">Recht auf Löschung</strong> ("Recht auf Vergessenwerden")</li>
                  <li><strong className="text-green-400">Recht auf Einschränkung</strong> der Verarbeitung</li>
                  <li><strong className="text-green-400">Recht auf Datenübertragbarkeit</strong></li>
                  <li><strong className="text-green-400">Widerspruchsrecht</strong> gegen die Verarbeitung</li>
                  <li><strong className="text-green-400">Recht auf Widerruf</strong> erteilter Einwilligungen</li>
                </ul>
              </CardContent>
            </Card>

            {/* Datensicherheit */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Datensicherheit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren (Secure Socket Layer) in Verbindung mit der jeweils höchsten Verschlüsselungsstufe, die von Ihrem Browser unterstützt wird. Zusätzlich sichern wir unsere Website und sonstigen Systeme durch technische und organisatorische Maßnahmen gegen Verlust, Zerstörung, Zugriff, Veränderung oder Verbreitung Ihrer Daten durch unbefugte Personen.
                </p>
              </CardContent>
            </Card>

            {/* Speicherdauer */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Speicherdauer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Personenbezogene Daten werden nur so lange gespeichert, wie es für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungsfristen bestehen. Nach Wegfall des Zwecks oder Ablauf der Fristen werden die entsprechenden Daten routinemäßig gelöscht.
                </p>
              </CardContent>
            </Card>

            {/* Änderungen */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Änderungen der Datenschutzerklärung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-green-400">Stand:</strong> Januar 2025
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

export default Datenschutz;
