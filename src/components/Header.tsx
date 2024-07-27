import { Link, useNavigate } from "react-router-dom"
import AvatarDropdown from "./AvatarDropdown";
import supabase from "@/supabase/config";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";



function Header() {

  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.user);

  return (
    <div className="bg-white">
      <div className="container">
      <nav className="min-h-[4rem] py-4 flex justify-between items-center">
        <Link to="/" className="">
          <img src="" className="h-12 " alt="logo"></img>
        </Link>

        <div>
          {!user ?
            <button type="button" onClick={() => navigate('/auth')}
              className="text-white bg-blue-700 hover:bg-blue-800 active:outline-none active:ring-4 active:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">
              Login
            </button>
            : (
              <AvatarDropdown />
            )}
        </div>
      </nav>
    </div>
    </div>
  )
}

export default Header
