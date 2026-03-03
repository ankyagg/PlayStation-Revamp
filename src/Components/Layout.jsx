import React from "react";
import { Outlet } from "react-router-dom";
import GlobalNavbar from "./GlobalNavbar";
import ControllerNavigationProvider from "./ControllerNavigation";

const Layout = () => {
    return (
        <ControllerNavigationProvider>
            <GlobalNavbar />
            <div style={{ paddingTop: "0px", position: "relative" }}>
                <Outlet />
            </div>
        </ControllerNavigationProvider>
    );
};

export default Layout;
