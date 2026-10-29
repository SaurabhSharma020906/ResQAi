# ResQAI Client

## Run the client

```bash
cd client
npm install
npm run dev
```

The client uses Leaflet directly. The project does **not** require `leaflet-defaulticon-compatibility` in the client; marker icons are configured explicitly in the map components.

If Vite is already running, stop it with `Ctrl+C` and restart after installing dependencies.

## Environment

Create `.env` from `.env.example` if needed. Set the API and Socket.IO URLs to the running backend, for example:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```
