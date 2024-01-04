import { Outlet, useNavigate } from "react-router-dom";
import Navigation from "../layout/Navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "../App";

export default function Root() {
  const navigate = useNavigate();

  const [loggedUser, setLoggedUser] = useState<any>({
    isLogged: false,
    username: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    let user = localStorage.getItem("user");
    if (user) {
      let userTemp = JSON.parse(user);
      setLoggedUser({
        isLogged: true,
        username: userTemp.properties?.username,
        name: userTemp.properties?.name,
        surname: userTemp.properties?.surname,
      });
    } else {
      navigate("/login");
    }
    setLoading(false);
  }, []);

  /*useEffect(() => {
    if (!loading)
      navigate("/home")
  },[loading])
*/
  return (
    <>
      <UserContext.Provider
        value={{ loggedUser: loggedUser, setLoggedUser: setLoggedUser }}
      >
        {/* all the other elements */}
        
        <Navigation />
        {!loading && <Outlet />}
      </UserContext.Provider>{" "}
    </>
  );
}
