# Duelovky
Online herní platforma se sociálními prkvy. Je tvořena s myšlenkou náhradit/zmodernizovat starší web hry.cz později duelovky.cz, který byl závislý na Adobe Flash Player a nyní je více méně nefunkční.

## Funkcionality
✅ - implementováno
❌ - Plánováno pro budoucí verzi
#### Obecné
- Přihlašování ✅
- Systém přátel ✅
- Privátní chatování ✅
- Chatovací místnosti + správa ✅
- Notifikace ✅

#### Herní  
- 1v1 online hry ❌ (Prší ✅)
- Matchmaking ✅
- Ranking system ✅
- Vytvoření soukromé hry pomocí kódu ✅

## Technologie
- **Frontend** - Svelte 5
- **Backend (API)** - Java Spring Boot
- **Backend (websockets)** - Node.js Socket.io
- **Databáze**: PostgreSQL
- **RabbitMQ** - pro notifikace

## Návod ke spuštění lokálně
1. Naklonujte repozitář
2. Doplňte `.env` soubory pro jednotlivé části aplikace (backend, sockets) podle `.env.example`
3. Spusťte příkaz make run-dev pro spuštění všech částí aplikace pomocí Dockeru
   ```bash
   make run-dev
   ```
4. Aplikace by měla být dostupná na `http://localhost:5173`
