import React from "react";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import Silk from "../../components/effects/silk";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 lg:grid">
          <div className="relative w-full h-full">
            <Silk color="#FF2400" speed={15} scale={1} noiseIntensity={0.5} rotation={0} />
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="flex flex-col items-center max-w-xs">
                <Link to="/" className="block mb-4">
                  <img
                    width={210}
                    height={48}
                    src="/images/logo/Logo-sanoh-2-white.png"
                    alt="Logo"
                  />
                </Link>
                <p className="text-center text-white/80">
                  Productivity tools for your business
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
