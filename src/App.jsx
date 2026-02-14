import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Entry from './pages/Entry';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Register from './pages/Register';
import SecuritySetup from './pages/SecuritySetup';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Search from './pages/Search';
import Watchlist from './pages/Watchlist';
import History from './pages/History';
import Profile from './pages/Profile';
import Categories from './pages/Categories';
import PodcastDetail from './pages/PodcastDetail';

import Navbar from './components/Navbar'; // Import Navbar to use inside layout if needed, though pages currently import it

// Layout wrapper for authenticated pages to ensure Navbar is present? 
// Or pages can include it. user provided architecture had Navbar in components.
// I will let pages include Navbar for now or simple layout.
// For now, let's keep it simple as implemented in placeholders.

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/entry" element={<Entry />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/security" element={<SecuritySetup />} />
          <Route path="/home" element={<><Home /><Navbar /></>} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/search" element={<Search />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/podcast/:id" element={<PodcastDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
