import Layout from "@/src/components/Layout";
import Home from "@/src/components/Homepage";
import Login from "@/src/components/Login";
import Logout from "@/src/components/Logout";
import Register from "@/src/components/Register";
import Navbar from "@/src/components/Navbar";
import Profile from "@/src/components/Profile";
import Visualize from "@/src/components/Visualise";

const IndexPage = () => {
  return (
    <div>
      <Home />
      <Login />
    </div>
  );
};

export default IndexPage;
