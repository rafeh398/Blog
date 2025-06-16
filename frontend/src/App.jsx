import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BlogProvider } from "./context/BlogContext";
import BlogList from "./pages/BlogList";
import PostDetail from "./pages/PostDetail";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login"; // Assuming it's in /pages
import Signup from "./pages/Signup";


function App() {
  return (
    <BlogProvider>
      <Router>
        <ToastContainer />
        <Navbar />
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup/>}/>
        </Routes>
      </Router>
    </BlogProvider>
  );
}

export default App;
