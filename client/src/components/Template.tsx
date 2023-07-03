import { Layout, Menu } from "antd";

import React, { useEffect, useState } from "react";

import BookTable, { Bookintro } from "./BookTable";
import BookView from "./Book_View";
import PrivateLogin from "./PrivateLogin";
// import { Private_Table } from "./Private_Table";
import Newform from "./Newbook";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Login_form from "./Login";
import SignUp from "./Signup";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logOut } from "../redux/userSlice";
import {
  Check_Login,
  Check_Refresh,
  User_Logout,
} from "../controllers/user_handler";
import ProtectedRoutes from "../ProtectedRoutes";
import Homepage from "./Homepage";
import AdvanceEdit from "./Advance_Edit";
import NewBulkBook from "./Newbulkbooks";
import NewBook from "./Newbook";
import Dashboard from "./Dashboard";

// ====> drawer amd hamburger
import { Spin as Hamburger } from "hamburger-react";

import "react-modern-drawer/dist/index.css";
import Book_View from "./Book_View";
import { Private_Table } from "./Private_Table";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
// ROUTER needs to be improve
const { Header, Content, Footer } = Layout;
const Template = () => {
  const [users, setUsers] = useState<any | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nav = document.getElementsByClassName("ant-menu-submenu");
  const nav1 = document.getElementsByClassName("ant-menu-submenu-hidden");

  async function IsLogin(loop = false) {
    try {
      var token = await Check_Login();

      if (token.Email) {
        dispatch(loginSuccess(token));
      } else {
        await Check_Refresh();
        await sleep(2000);

        var token2 = await Check_Login();

        if (token2.Email) {
          dispatch(loginSuccess(token2));
        } else {
          dispatch(logOut());
          navigate("/");
          return;
        }
      }
    } catch (error) {}
  }

  const user = useSelector((state: any) => state.user.currentUser);
  // console.log(user);
  useEffect(function effectFunction() {
    async function fetchUser() {
      await IsLogin();
    }

    fetchUser();
  }, []);

  const logout = async () => {
    // if used in more components, this should be in context
    // axios to /logout endpoint
    var ok = await User_Logout();
    // console.log(ok)
    if (ok != null) {
      return ok;
    }

    dispatch(logOut());
    navigate("/");
  };

  const CheckAuth = (role: any, Utype: string[]) => {
    // if used in more components, this should be in context
    //console.log(Utype)

    let ulen = Utype.length;
    if (role != null) {
      //console.log(role.User_type);
      if (role.User_type != null) {
        //console.log(role.User_type, " typeof", typeof role.User_type);

        let x = 0;
        for (x; x < ulen; x++) {
          //console.log(Utype[x])
          if (role.User_type == Utype[x]) {
            return true;
          }
        }
      }
    }
    //console.log("FALSE");
    return false;
  };

  function nav_trigger() {
    // console.log("ACTIVE")
    //console.log(nav)
    if (nav.length > 0) {
      for (let x = 0; x < nav.length; x++) {
        nav[x].classList.add("ant-menu-submenu-active");
        nav[x].classList.add("ant-menu-submenu-open");
      }
    }
  }
  const [isOpen, setIsOpen] = useState(false);


useEffect(() => {
    const handleScroll = () => {
        const mainIntro = document.querySelector('.main-intro') as HTMLElement;
        const navTop = document.querySelector('.nav-top') as HTMLElement;

        if (mainIntro && navTop) {
            const triggerHeight = mainIntro.offsetTop + mainIntro.offsetHeight / 2;
            const scrollPosition = window.scrollY;
            const maxOpacity = 1;

            // Calculate the opacity based on how far the user has scrolled
            let opacity = scrollPosition / triggerHeight * maxOpacity;

            // Cap the opacity at the maximum value
            if (opacity > maxOpacity) {
                opacity = maxOpacity;
            }

            // Set the background color with the calculated opacity
            navTop.style.backgroundColor = `rgba(12,36,64, ${opacity})`; // Change the RGB values according to your desired color
        }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
}, []);



  return (
    <div className="w-full">
      <div className="w-full nav-top  fixed top-0 h-[70px] flex justify-center items-center z-20">
        <div className=" w-full max-w-[1340px] flex flex-row m-auto justify-between items-center z-20  sm:px-4">
          <div className="hidden md:flex gap-10 justify-center items-center ">
            <Link
              key={0}
              to="/"
              className="text-orange-400 text-[16px] hover:text-white-main hover:duration-500"
            >
              Main
            </Link>
            {!user && (
              <Link
                key={1}
                className="text-orange-400 text-[16px] hover:text-white-main hover:duration-500"
                to="/login"
              >
                Log In
              </Link>
            )}
            {!user && (
              <Link
                key={2}
                className="text-orange-400 text-[16px] hover:text-white-main hover:duration-500"
                to="/signup"
              >
                Sign Up
              </Link>
            )}
            {CheckAuth(user, ["ADMIN"]) && (
              <Link
                key={3}
                className="text-orange-400 text-[16px] hover:text-white-main hover:duration-500"
                to="/new"
              >
                New
              </Link>
            )}

            {CheckAuth(user, ["ADMIN"]) && (
              <Link
                key={4}
                className="text-orange-400 text-[16px] hover:text-white-main hover:duration-500"
                to="/newbulk"
              >
                New Bulk
              </Link>
            )}

            {CheckAuth(user, ["ADMIN"]) && (
              <Link
                key={5}
                className="text-orange-400 text-[16px] hover:text-white-main hover:duration-500"
                to="/PrivateTable"
              >
                Private Table
              </Link>
            )}

            {CheckAuth(user, ["ADMIN", "USER"]) && (
              <Link
                key={6}
                className="text-orange-400 text-[16px] hover:text-white-main hover:duration-500"
                to="/booktable"
              >
                BookTable
              </Link>
            )}

            {user && (
              <span
                key={7}
                className="text-orange-400 text-[16px] hover:text-white-main hover:duration-500"
                onClick={logout}
              >
                Logout
              </span>
            )}
          </div>
          {/* =====> drawer for small screen */}
          <div className="md:hidden flex justify-center items-center relative text-center">
            <Hamburger
              color="#1d4e89"
              rounded
              size={30}
              toggled={isOpen}
              toggle={setIsOpen}
            />
            <div className={`nav-menu ${isOpen ? "open" : ""}`}>
              {/* =========>links */}
              <div className="flex w-full flex-col gap-4 justify-center items-end px-4 py-6 text-center">
                <div className="flex w-full flex-col gap-4 justify-center items-end px-4 py-6 text-end">
                  <Link key={0} to="/" onClick={() => setIsOpen(false)}>
                    Main
                  </Link>
                </div>
                {!user && (
                  <div>
                    <Link key={1} to="/login" onClick={() => setIsOpen(false)}>
                      Log In
                    </Link>
                  </div>
                )}
                {!user && (
                  <div>
                    <Link key={2} to="/signup" onClick={() => setIsOpen(false)}>
                      Sign Up
                    </Link>
                  </div>
                )}
                {CheckAuth(user, ["ADMIN"]) && (
                  <div className="text-center flex justify-center items-center">
                    <Link key={3} to="/new" onClick={() => setIsOpen(false)}>
                      New
                    </Link>
                  </div>
                )}
                {CheckAuth(user, ["ADMIN"]) && (
                  <div className="text-center">
                    <Link
                      key={4}
                      to="/newbulk"
                      onClick={() => setIsOpen(false)}
                    >
                      New Bulk
                    </Link>
                  </div>
                )}
                {CheckAuth(user, ["ADMIN"]) && (
                  <div className="text-center">
                    <Link
                      key={5}
                      to="/PrivateTable"
                      onClick={() => setIsOpen(false)}
                    >
                      Private Table
                    </Link>
                  </div>
                )}
                {CheckAuth(user, ["ADMIN", "USER"]) && (
                  <div>
                    <Link
                      key={6}
                      to="/booktable"
                      onClick={() => setIsOpen(false)}
                    >
                      BookTable
                    </Link>
                  </div>
                )}
                {user && (
                  <div key={7} onClick={logout}>
                    <span>Logout</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        
        </div>
          <h3 className="absolute left-1/2 transform -translate-x-1/2 text-[2em] font-bold md:text-[1.9rem] text-orange-400">
            Library Xpress
          </h3>
      </div>
      <Content className="px-0 sm:px-[50px] bg-gradient">

        {/* <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb>
              */}{" "}
        <div className="">
          <Routes>
            {/* <Route path="/New" element={<NewItem />} /> */}
            <Route path="/booktable" element={<Bookintro />} />
          </Routes>

          <Routes>
            {/* <Route path="/New" element={<NewItem />} /> */}
            <Route path="/" element={<Homepage />} />
          </Routes>

          <Routes>
            <Route
              path="/booktable"
              element={
                <ProtectedRoutes props={["ADMIN", "USER"]} direction={"/"} />
              }
            >
              <Route path="/booktable" element={<BookTable />} />
            </Route>

            <Route
              path="/bookview"
              element={
                <ProtectedRoutes props={["ADMIN", "USER"]} direction={"/"} />
              }
            >
              <Route path="/bookview" element={<BookView />} />
            </Route>

            <Route
              path="/new"
              element={<ProtectedRoutes props={["ADMIN"]} direction={"/"} />}
            >
              <Route path="/new" element={<Newform />} />
            </Route>

            <Route
              path="/newbulk"
              element={<ProtectedRoutes props={["ADMIN"]} direction={"/"} />}
            >
              <Route path="/newbulk" element={<NewBulkBook />} />
            </Route>

            <Route
              path="/PrivateTable"
              element={<ProtectedRoutes props={["ADMIN"]} direction={"/"} />}
            >
              <Route path="/PrivateTable" element={<Private_Table />} />
            </Route>

            <Route path="/signup" element={<SignUp />} />
            <Route path="/private/login" element={<PrivateLogin />} />

            {/* <Route
              path="/PrivateTable"
              element={<ProtectedRoutes props={["ADMIN"]} direction={"/"} />}
            >
              <Route path="/PrivateTable" element={<Private_Table />} />
            </Route> */}

            <Route
              path="/advance_edit"
              element={<ProtectedRoutes props={["ADMIN"]} direction={"/"} />}
            >
              <Route path="/advance_edit" element={<AdvanceEdit />} />
            </Route>

            <Route
              path="/advance_edit"
              element={<ProtectedRoutes props={["ADMIN"]} direction={"/"} />}
            ></Route>

            <Route path="/login" element={<Login_form />} />

            {/* <Route path="/" element={<Dashboard />} /> */}
            {/* <Route path="/" element={<Private_Table />} /> */}
          </Routes>
        </div>
        </Content>
      <p className="text-black text-[14px] bg-[#f5f5f5] text-center h-[60px] flex justify-center items-center">
        Ant Design ©2018 Created by Ant UED
      </p>
    </div>
  );
};

export default Template;
