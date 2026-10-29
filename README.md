# ResQAI

ResQAI is an emergency incident reporting and response-management web application. It provides citizen registration/login, GPS-based incident reporting with image upload, AI-style severity/dispatch recommendations, nearby emergency-service discovery, an admin incident control center, responder assignment data, and Socket.IO live updates.

## Stack
- Frontend: React + Vite + Tailwind CSS v4 + React Router + Leaflet
- Backend: Node.js + Express + MongoDB/Mongoose + JWT + Socket.IO
- Maps/services: Leaflet, OpenStreetMap/Nominatim, Geoapify

## Run locally
1. Install Node.js 20+ and MongoDB/Atlas access.
2. Copy `server/.env.example` to `server/.env` and fill in your own credentials/API keys.
3. Copy `client/.env.example` to `client/.env` if you need non-default URLs.
4. Install dependencies:
   - `cd server && npm install`
   - `cd ../client && npm install`
5. Start backend: `cd server && npm run dev`
6. Start frontend in another terminal: `cd client && npm run dev`
7. Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## Main flows
- Citizen: Register → Login → Dashboard → Report Incident → My Incidents
- Admin: Login with an account whose role is `Admin` → Admin Dashboard → open incident → inspect map/AI recommendation → dispatch nearby service → update status

## Important
The repository should never contain real MongoDB, Geoapify, or JWT secrets. If credentials were previously committed/shared, rotate them before submission or deployment.


## V3 Assignment Fix
The Admin Dashboard green assignment button now opens an Assign Responder dialog. The backend includes PUT /api/responders/assign/:id to assign an available responder, mark it Busy, set the incident to Assigned, and broadcast Socket.IO updates.
