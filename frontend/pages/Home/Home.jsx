
import Sidebar from "../../src/components/Sidebar/Sidebar.jsx";
import Main from "../../src/components/Main/Main.jsx";
import "./Home.css";

import { useContext, useState } from "react";
import { AuthContext } from "../../src/context/AuthContext.jsx";

const Home = () => {

    const [extended, setExtended] = useState(false);
    const { user } = useContext(AuthContext);
    return (
        <div className="home">

            <Sidebar
                extended={extended}
                setExtended={setExtended}
                 user={user}
            />

            <Main
                setExtended={setExtended}
            />

        </div>
    );
};

export default Home;