import React from "react";
import auth from "./../auth/auth-helper";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Menu.module.css";
import { AiFillHome } from "react-icons/ai";
// import { withRouter } from "react-router";

// const isActive = (history, path) => {
//   if (history.location.pathname == path) return { color: "#ff4081" };
//   else return { color: "#ffffff" };
// };
const Menu = () => {
  const navigate = useNavigate();
  return (
    <div className={classes.menu}>
      <h1>MERN SKELETON</h1>
      <nav className={classes.navbar}>
        <Link to="/" className={classes.link}>
          <button style={{ all: "unset" }}>
            <AiFillHome />
          </button>
        </Link>
        <Link to="/users" className={classes.link}>
          <button style={{ all: "unset" }}>Users</button>
        </Link>
        {auth.isAuthenticated() ? (
          <>
            <Link
              to={"/user/" + auth.isAuthenticated().user._id}
              className={classes.link}
            >
              <button style={{ all: "unset" }}>My Profile</button>
            </Link>
            <button
              className={classes.link}
              color="inherit"
              onClick={() => {
                auth.clearJWT(() => navigate("/"));
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/signup" className={classes.link}>
              <button style={{ all: "unset" }}>Sign up</button>
            </Link>
            <Link to="/signin" className={classes.link}>
              <button style={{ all: "unset" }}>Sign In</button>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
  // return (
  //   <AppBar position="static">
  //     <Toolbar>
  //       <Typography variant="h6" color="inherit">
  //         MERN Skeleton
  //       </Typography>
  //       <Link to="/">
  //         <IconButton aria-label="Home" style={{ color: "#ffffff" }}>
  //           <HomeIcon />
  //         </IconButton>
  //       </Link>
  //       <Link to="/users">
  //         <Button style={{ color: "#ffffff" }}>Users</Button>
  //       </Link>
  //       {!auth.isAuthenticated() && (
  //         <span>
  //           <Link to="/signup">
  //             <Button style={{ color: "#ffffff" }}>Sign up</Button>
  //           </Link>
  //           <Link to="/signin">
  //             <Button style={{ color: "#ffffff" }}>Sign In</Button>
  //           </Link>
  //         </span>
  //       )}
  //       {auth.isAuthenticated() && (
  //         <span>
  //           <Link to={"/user/" + auth.isAuthenticated().user._id}>
  //             <Button style={{ color: "#ffffff" }}>My Profile</Button>
  //           </Link>
  //           <Button
  //             color="inherit"
  //             onClick={() => {
  //               auth.clearJWT(() => navigate("/"));
  //             }}
  //           >
  //             Sign out
  //           </Button>
  //         </span>
  //       )}
  //     </Toolbar>
  //   </AppBar>
  // );
};

export default Menu;
