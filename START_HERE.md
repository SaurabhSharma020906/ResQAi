# ResQAI – Start Here

## 1. Start the backend

```bash
cd server
npm install
npm run dev
```

## 2. Start the frontend in a second terminal

```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Important fix included

The frontend socket provider contains JSX, so it is stored as `client/src/socket.jsx` rather than `socket.js`.
The client also no longer imports `leaflet-defaulticon-compatibility`, because that package was not declared in the client package dependencies. Leaflet marker icons are configured explicitly where needed.
