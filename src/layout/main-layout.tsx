import { ReactNode } from "react";

import { Montserrat } from "next/font/google";

import Navbar from "@/layout/navbar";
import Footer from "@/layout/footer";
import { routes } from "@/data/navigationRoutes";
import { classNames } from "@/utility/classNames";

const montserrat = Montserrat({
  subsets: ["latin"],
});

export interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout(props: MainLayoutProps) {
  return (
    <>
      <div
        className={classNames(
          "flex min-h-screen flex-col",
          montserrat.className,
        )}
      >
        <Navbar routes={routes} />
        <main className="flex flex-grow flex-col">{props.children}</main>
        <Footer />
      </div>
    </>
  );
}
