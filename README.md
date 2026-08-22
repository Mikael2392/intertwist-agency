# Intertwist — professioneller Firebase Starter

## Enthalten
- Responsive Agentur-Website
- Getrennte Leistungsbereiche Mikael / Paula
- 3 Projektpakete + monatliche Betreuung
- Referenzen und eure Portfolios
- Firebase Firestore Anfrageformular
- Honeypot-Spamschutz
- Firestore Security Rules
- Firebase Hosting Konfiguration
- Cloud Function für automatische Bestätigung an den Kunden + interne Benachrichtigung
- Impressum/Datenschutz als Platzhalter

## Firebase verbinden
1. Firebase Console öffnen und neues Projekt `intertwist-agency` erstellen.
2. Firestore Database aktivieren.
3. Web-App registrieren.
4. Firebase Config in `firebase-config.js` einsetzen.

## Firebase CLI
```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules
```

## Automatische E-Mail
Die Cloud Function nutzt Resend, damit kein API-Key im Browser liegt.

```bash
cd functions
npm install
firebase functions:secrets:set RESEND_API_KEY
cd ..
firebase deploy --only functions
```

Beim Deploy setzt ihr:
- FROM_EMAIL = z. B. `Intertwist <hello@eure-domain.de>`
- CONTACT_TO_EMAIL = eure interne E-Mail

Die Absenderdomain muss beim E-Mail-Anbieter verifiziert werden.

## Hosting + eure gekaufte Domain
```bash
firebase deploy --only hosting
```
Danach in Firebase Hosting → Add custom domain und eure Domain verbinden.

## Vor dem echten Launch
- Domain verbinden
- FROM_EMAIL einrichten
- Impressum vervollständigen
- Datenschutz rechtlich prüfen
- Optional: Firebase App Check für zusätzlichen Spamschutz

## Firestore
Collection: `inquiries`

Nächster Ausbau: Admin-Dashboard mit Firebase Auth und Status `new → contacted → offer → won/lost`.
