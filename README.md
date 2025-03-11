# Formula 1 API

Deze API biedt informatie over Formule 1 races, teams, coureurs en circuits. Het project is gebouwd met Node.js, Express, TypeScript en MongoDB.

## Inhoudsopgave

- [Projectstructuur](#projectstructuur)
- [Installatie](#installatie)
- [Configuratie](#configuratie)
- [API Endpoints](#api-endpoints)
- [Modellen](#modellen)
- [Ontwikkeling](#ontwikkeling)
- [Deployment](#deployment)

## Projectstructuur

```
f1-api/
│
├── src/
│   ├── config/             # Configuratie bestanden
│   │   ├── database.ts     # MongoDB verbinding
│   │   └── env.ts          # Environment variabelen
│   │
│   ├── controllers/        # Request handlers
│   │   ├── circuitController.ts
│   │   ├── driverController.ts
│   │   ├── notfoundController.ts
│   │   ├── raceController.ts
│   │   └── teamController.ts
│   │
│   ├── models/             # Mongoose modellen
│   │   ├── circuitModel.ts
│   │   ├── driverModel.ts
│   │   ├── raceModel.ts
│   │   └── teamModel.ts
│   │
│   ├── routes/             # Express routes
│   │   ├── circuitRoutes.ts
│   │   ├── driverRoutes.ts
│   │   ├── notfoundRoutes.ts
│   │   ├── raceRoutes.ts
│   │   └── teamRoutes.ts
│   │
│   ├── types/              # TypeScript type definities
│   │   └── custom.d.ts     # Express type extensies
│   │
│   └── server.ts           # Entry point
│
├── .env                    # Environment variabelen (niet in versiecontrole)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Installatie

Volg deze stappen om het project lokaal op te zetten:

### Stap 1: Project en dependencies installeren

```bash
# Maak een nieuw project directory aan
mkdir f1-api
cd f1-api

# Initialiseer een nieuw npm project
npm init -y

# Installeer dependencies
npm install express mongoose cors dotenv jsonwebtoken

# Installeer TypeScript en type definities
npm install -D typescript ts-node ts-node-dev @types/node @types/express @types/cors @types/jsonwebtoken

# Initialiseer TypeScript
npx tsc --init
```

### Stap 2: Projectstructuur aanmaken

```bash
# Maak de basis structuur aan
mkdir -p src/config src/controllers src/models src/routes src/types
```

### Stap 3: TypeScript configuratie

Pas `tsconfig.json` aan:

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Stap 4: Scripts toevoegen aan package.json

Voeg deze scripts toe aan je `package.json`:

```json
"scripts": {
  "start": "node dist/server.js",
  "build": "tsc",
  "dev": "ts-node-dev --respawn src/server.ts"
}
```

## Configuratie

### Stap 5: Environment variabelen instellen

Maak een `.env` bestand aan in de root van je project:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/f1api
JWT_SECRET=jouw_geheime_sleutel
NODE_ENV=development
```

### Stap 6: Maak config bestanden

Maak het bestand `src/config/env.ts`:

```typescript
// src/config/env.ts
import "dotenv/config";

export const PORT = process.env.PORT || "3000";
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const NODE_ENV = process.env.NODE_ENV || "development";

// Ensure required variables are set
if (!MONGO_URI || !JWT_SECRET) {
  throw new Error("❌ Missing environment variables: MONGO_URI or JWT_SECRET");
}
```

Maak het bestand `src/config/database.ts`:

```typescript
import mongoose from "mongoose";
import { MONGO_URI } from "./env";

const connectToDb = async () => {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectToDb;
```

## Implementatie

### Stap 7: Definieer modellen

Maak de volgende modelbestanden aan:

#### src/models/circuitModel.ts

```typescript
import mongoose from "mongoose";

const circuitSchema = new mongoose.Schema(
  {
    circuit_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    location: {
      country: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
    },
    length_km: {
      type: Number,
      required: true,
    },
    turns: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists to prevent overwriting
const Circuit =
  mongoose.models.Circuit || mongoose.model("Circuit", circuitSchema);

export { Circuit };
```

Maak ook de andere modellen aan volgens de gegeven bronbestanden (driverModel.ts, raceModel.ts, teamModel.ts).

### Stap 8: Implementeer controllers

Maak controllers aan voor elk model volgens de gegeven bronbestanden (circuitController.ts, driverController.ts, raceController.ts, teamController.ts, notfoundController.ts).

### Stap 9: Implementeer routes

Maak routes aan voor elk model volgens de gegeven bronbestanden (circuitRoutes.ts, driverRoutes.ts, raceRoutes.ts, teamRoutes.ts, notfoundRoutes.ts).

### Stap 10: Express app opzetten (server.ts)

```typescript
import express from "express";
import cors from "cors";
import connectToDb from "./config/database";
import raceRoutes from "./routes/raceRoutes";
import teamRoutes from "./routes/teamRoutes";
import driverRoutes from "./routes/driverRoutes";
import circuitRoutes from "./routes/circuitRoutes";
import notFoundRoutes from "./routes/notfoundRoutes";
import { NODE_ENV, PORT } from "./config/env";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/races", raceRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/circuits", circuitRoutes);
app.use(notFoundRoutes); // This handles routes that don't match any of the above

// Start Server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT} 🚀 (${NODE_ENV})`);
  await connectToDb();
});
```

### Stap 11: TypeScript type extensie

Maak het bestand `src/types/custom.d.ts`:

```typescript
// src/types/custom.d.ts
declare namespace Express {
  interface Request {
    user?: { userId: string }; // Het type dat je toevoegt (bijv. userId)
  }
}
```

## API Endpoints

Na implementatie zijn de volgende endpoints beschikbaar:

### Races

- `GET /api/races` - Alle races ophalen

### Teams

- `GET /api/teams` - Alle teams ophalen
- `POST /api/teams` - Een nieuw team aanmaken

### Drivers

- `GET /api/drivers` - Alle coureurs ophalen
- `POST /api/drivers` - Een nieuwe coureur aanmaken

### Circuits

- `GET /api/circuits` - Alle circuits ophalen
- `POST /api/circuits` - Een nieuw circuit aanmaken

## Ontwikkeling

### Stap 12: De applicatie starten

```bash
# Start de ontwikkelingsserver
npm run dev

# Of build en start
npm run build
npm start
```

### Stap 13: MongoDB instellen

Zorg ervoor dat MongoDB lokaal draait of gebruik een MongoDB Atlas account. Update het MONGO_URI in je .env bestand naar de juiste verbindingsstring.

## Datamodellen

Het project gebruikt de volgende datamodellen:

### Circuit

- `circuit_id`: Unieke identifier
- `name`: Naam van het circuit
- `image`: URL naar circuitafbeelding
- `location`: Land en stad
- `length_km`: Lengte in kilometers
- `turns`: Aantal bochten

### Driver

- `driver_id`: Unieke identifier
- `givenName`: Voornaam
- `familyName`: Achternaam
- `nationality`: Nationaliteit
- `dateOfBirth`: Geboortedatum
- `image`: URL naar profielfoto
- `url`: Link naar meer informatie
- `countryCode`: Landcode voor vlag
- `team_id`: Verwijzing naar team

### Race

- `name`: Naam van de race
- `country`: Land
- `countryCode`: Landcode
- `position1_time` tot `position3_time`: Tijden van de top 3
- `driver_id`: Winnende coureur
- `round`: Raceronde in het seizoen
- `circuit_id`: Circuit waar de race plaatsvond
- `date`: Datum van de race
- `sprint_race`: Of het een sprintrace was
- `fastest_lap`: Coureur met de snelste ronde
- `race_results`: Resultaten per coureur (positie, tijd, punten)

### Team

- `team_id`: Unieke identifier
- `name`: Teamnaam
- `principal`: Teambaas
- `base`: Thuisbasis
- `founded_year`: Oprichtingsjaar
- `engine`: Motorleverancier
- `drivers`: Array van coureurs
- `image`: URL naar teamlogo

## Deployment

### Stap 14: Voorbereiden voor productie

1. Zorg ervoor dat alle geheimen (zoals JWT_SECRET) veilig zijn opgeslagen
2. Configureer je productie-database
3. Build de applicatie: `npm run build`

### Stap 15: Deployen

De applicatie kan worden gedeployed naar verschillende platforms:

#### Heroku

```bash
# Installeer Heroku CLI
npm install -g heroku

# Login op Heroku
heroku login

# Maak een nieuwe app
heroku create f1-api

# Push naar Heroku
git push heroku main

# Configureer environment variabelen
heroku config:set MONGO_URI=your_mongo_uri JWT_SECRET=your_jwt_secret NODE_ENV=production
```

#### Docker

```bash
# Maak een Dockerfile
echo "FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "node", "dist/server.js" ]" > Dockerfile

# Build de Docker image
docker build -t f1-api .

# Run de container
docker run -p 3000:3000 f1-api
```

## Tips voor verdere ontwikkeling

1. Voeg authenticatie toe met JWT voor beveiligde endpoints
2. Implementeer uitgebreidere filteren en zoeken op endpoints
3. Voeg paginering toe voor grotere datasets
4. Implementeer gebruikersbeheer (registreren, inloggen)
5. Voeg data validatie toe met een library zoals Joi of Zod
6. Schrijf unit en integratietests
7. Documenteer de API met Swagger of OpenAPI
