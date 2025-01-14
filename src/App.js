import {useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useLocation, useNavigate } from 'react-router-dom';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if (code) {
      // API'ye gönderme işlemi veya kullanıcıyı yönlendirme
      console.log('Google OAuth code:', code);
      // Yönlendirme işlemi
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  // return <div>Loading...</div>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
      </Routes>
    </Router>
  );
}

export default App;
