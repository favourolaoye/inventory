import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import SideMenu from "./SideMenu";

function Layout() {
  const location = useLocation();
  const isInvoicePage = location.pathname.startsWith('/invoice/');

  return (
    <>
      {!isInvoicePage && (
        <div className="md:h-16">
          <Header />
        </div>
      )}
      <div className="grid grid-cols-12 bg-gray-100 items-baseline">
        {!isInvoicePage && (
          <div className="col-span-2 h-screen sticky top-0 hidden lg:flex">
            <SideMenu />
          </div>
        )}
        <div className={isInvoicePage ? 'col-span-12' : 'col-span-10'}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
