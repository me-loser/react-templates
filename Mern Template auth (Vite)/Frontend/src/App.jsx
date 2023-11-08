import AllRoutes from "./AllRoutes";
import NotificationProvider from "./components/contexts/NotificationProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";

function App() {
  return (
    <div className="App">
      <GoogleOAuthProvider
        clientId={`${import.meta.env.VITE_GOOGLE_CLIENT_ID}`}
      >
        <NotificationProvider>
          <AllRoutes />
        </NotificationProvider>
      </GoogleOAuthProvider>
    </div>
  );
}
export default App;
