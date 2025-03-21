import { Route, Routes } from "react-router-dom";
import Login from "./Components/Authorization/Login";
import Navbar from "./Components/Home/Navbar";
import ServiceProviderReg from "./Components/Service Provider Reg";
import Signup from "./Components/Authorization/SignUp";
import HomePage from "./Components/Home/HomePage";
import Footer from "./Components/Home/Footer";
import Services from "./Components/User/Services";
import UserProfile from "./Components/UserProfile";
import { SocketProvider } from "./Components/Context/SocketContext";
import Message from "./Components/Home/Message";
import Page404 from "./Components/Home/Page404";
import AuthRoute from "./Components/Routes/AuthRoute";
import UserRoute from "./Components/Routes/UserRoute";
import ServiceProviderRoute from "./Components/Routes/ServiceProviderRoute";

function App() {
  return (
    <SocketProvider>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<ServiceProviderReg />} />

        <Route
          path="/*"
          element={
            <AuthRoute>
              <Routes>
                <Route path="/" element={<HomePage />} />

                <Route
                  path="/services"
                  element={
                    <UserRoute>
                      <Services />
                    </UserRoute>
                  }
                />
                <Route
                  path="/UserProfile"
                  element={
                    <ServiceProviderRoute>
                      <UserProfile />
                    </ServiceProviderRoute>
                  }
                />

                <Route path="*" element={<Page404 />} />
              </Routes>
            </AuthRoute>
          }
        />
      </Routes>
      <Footer />
      <Message />
    </SocketProvider>
  );
}

export default App;
