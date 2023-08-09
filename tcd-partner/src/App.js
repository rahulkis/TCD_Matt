import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import HomeRoutes from "./components/Home";
import EntriesRoutes from "./components/Entries";
import ConsumersRoute from "./components/Consumers";
import Login from "./components/Login";
import Products from "./components/Product";
import MarketInsightRoutes from "./components/MarketInsight";
import AdvertisementRoutes from "./components/Advertisement";
import SettingsRoutes from "./components/Settings";
import Support from "./components/support";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import AdminRoutes from "./admin";

function App() {
  const history = createBrowserHistory();

  return (
    <div>
      <Router history={history}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/home/*" element={<HomeRoutes />} />
          <Route path="/entries/*" element={<EntriesRoutes />} />
          <Route path="/consumers/*" element={<ConsumersRoute />} />
          <Route path="products/*" element={<Products />} />
          <Route path="market-insight/*" element={<MarketInsightRoutes />} />
          <Route path="advertisement/*" element={<AdvertisementRoutes />} />
          <Route path="settings/*" element={<SettingsRoutes />} />
          <Route path="/support/*" element={<Support />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={() => "404 NOT FOUND"} />
        </Routes>
      </Router>

      <div>
        <ToastContainer hideProgressBar={true} autoClose={2000} pauseOnHover />
      </div>
    </div>
  );
}

export default App;
