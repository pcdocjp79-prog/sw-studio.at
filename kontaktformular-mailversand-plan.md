# Kontaktformular Mailversand - Planungsnotiz

Dieses Dokument beschreibt die geplante Einrichtung des Kontaktformulars mit Mailversand. Ziel ist, dass Anfragen aus dem Formular spaeter per E-Mail an `pcdocjp79@gmail.com` gesendet werden. Die Umsetzung ist fuer `Vercel + Resend` vorgesehen, inklusive Pruefung der Pflichtfelder vor dem Versand. Die finale technische Einrichtung erfolgt erst, sobald die passende Absender-Mail bzw. Domain eingerichtet ist.

## Aktueller Status

Die technische Umsetzung fuer den echten Mailversand ist noch nicht aktiviert. Diese Datei dient vorerst als kompakte Referenz fuer die geplante Einrichtung und die dafuer benoetigten Schritte.

## Geplante Umsetzung

- Das Kontaktformular soll Anfragen spaeter per `POST` an eine Vercel-API-Route senden.
- Der Mailversand soll ueber `Resend` erfolgen.
- Pflichtfelder sind `Name` und `E-Mail`.
- Wenn Pflichtfelder fehlen, darf die Anfrage nicht verschickt werden.
- Bei unvollstaendigen Angaben soll im Formular ein klarer Hinweis erscheinen, dass Daten fehlen.
- Nach erfolgreichem Versand soll das bestehende Erfolgsverhalten erhalten bleiben, zum Beispiel die Weiterleitung auf die Danke-Seite.

## Benoetigte spaetere Einrichtung

- Eine passende Absender-Mail-Adresse bzw. verifizierte Domain muss eingerichtet werden.
- Der `Resend API Key` darf spaeter nur als Umgebungsvariable in Vercel hinterlegt werden.
- Der API-Key darf nicht im Frontend oder in statischen Dateien eingebunden werden.
- Die Empfaengeradresse bleibt vorerst `pcdocjp79@gmail.com`.
- Die finale Inbetriebnahme erfolgt erst, wenn die Absender-Mail oder Domain einsatzbereit ist.

## Hinweise

- Der aktuell im Chat genannte API-Key gilt spaeter als zu ersetzen bzw. zu rotieren.
- Diese Datei beschreibt bewusst nur den Planungsstand und noch keine aktive Live-Konfiguration.
- Es wird derzeit keine technische Implementierung in den Formularcode geschrieben; die Einrichtung folgt spaeter.
