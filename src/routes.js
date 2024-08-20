import { BrowserRouter, Route, Routes  } from "react-router-dom"
import Home from "./modules/home/home";
import Workspace from "./modules/workspace/workspace";

const RoutesApp = (props) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Workspace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/workspace" element={<Workspace />} />
                
            </Routes>
        </BrowserRouter>
    );

}

export default RoutesApp;