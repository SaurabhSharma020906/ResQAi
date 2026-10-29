import { FaShieldAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        <Link to="/" className="flex items-center gap-2">
          <FaShieldAlt className="text-red-500 text-2xl" />
          <h1 className="text-2xl font-bold">
            ResQ<span className="text-red-500">AI</span>
          </h1>
        </Link>

        <ul className="hidden md:flex gap-8">
          <li className="hover:text-red-400 cursor-pointer">Home</li>
          <li className="hover:text-red-400 cursor-pointer">Features</li>
          <li className="hover:text-red-400 cursor-pointer">About</li>
          <li className="hover:text-red-400 cursor-pointer">Contact</li>
        </ul>

        <button
          onClick={() => navigate("/login")}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg"
        >
          Login
        </button>

      </div>
    </nav>
  );
}

export default Navbar;