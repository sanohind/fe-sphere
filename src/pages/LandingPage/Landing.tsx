import PageMeta from "../../components/common/PageMeta";
import LandingHeader from "../../components/header/LandingHeader";
import { useSignInRedirect } from "../../hooks/useSignInRedirect";

export default function Landing() {
  const redirectToSignIn = useSignInRedirect();

  return (
    <>
      <PageMeta title="Everything you need, all in SPHERE" description="Powerful admin dashboard solution designed for modern businesses" />
      <div className="relative h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
        <div className="absolute bottom-0 right-0 overflow-hidden lg:inset-y-0">
          <img className="w-auto h-full" src="https://d33wubrfki0l68.cloudfront.net/1e0fc04f38f5896d10ff66824a62e466839567f8/699b5/images/hero/3/background-pattern.png" alt="" />
        </div>

        <LandingHeader />

        <section className="relative flex-1 overflow-hidden flex items-center justify-center">
          <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 gap-y-8 lg:items-center lg:grid-cols-2 sm:gap-y-20 xl:grid-cols-5">
              <div className="text-center xl:col-span-2 lg:text-left md:px-16 lg:px-0">
                <div className="max-w-sm mx-auto sm:max-w-md md:max-w-full">
                  <h1 className="text-4xl font-bold leading-tight text-gray-900 dark:text-white sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight font-pj">Everything you need, all in Sphere</h1>

                  <div className="mt-8 lg:mt-12 lg:flex lg:items-center">
                    <div className="flex justify-center flex-shrink-0 -space-x-4 overflow-hidden lg:justify-start">
                      <img
                        className="inline-block rounded-full w-14 h-14 ring-2 ring-white dark:ring-gray-800"
                        src="https://d33wubrfki0l68.cloudfront.net/3bfa6da479d6b9188c58f2d9a8d33350290ee2ef/301f1/images/hero/3/avatar-male.png"
                        alt=""
                      />
                      <img
                        className="inline-block rounded-full w-14 h-14 ring-2 ring-white dark:ring-gray-800"
                        src="https://d33wubrfki0l68.cloudfront.net/b52fa09a115db3a80ceb2d52c275fadbf84cf8fc/7fd8a/images/hero/3/avatar-female-1.png"
                        alt=""
                      />
                      <img
                        className="inline-block rounded-full w-14 h-14 ring-2 ring-white dark:ring-gray-800"
                        src="https://d33wubrfki0l68.cloudfront.net/8a2efb13f103a5ae2909e244380d73087a9c2fc4/31ed6/images/hero/3/avatar-female-2.png"
                        alt=""
                      />
                    </div>

                    <p className="mt-4 text-lg text-gray-900 dark:text-gray-300 lg:mt-0 lg:ml-4 font-pj">
                      Join with <span className="font-bold">4600+ Developers</span> and start getting feedbacks right now
                    </p>
                  </div>
                </div>

                <div className="mt-8 sm:flex sm:items-center sm:justify-center lg:justify-start sm:space-x-5 lg:mt-12">
                  <button
                    onClick={redirectToSignIn}
                    className="inline-flex items-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 dark:bg-gray-800 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-gray-700 font-pj justif-center hover:bg-gray-700 dark:hover:bg-gray-700"
                  >
                    Get Started
                  </button>
                </div>
              </div>

              <div className="xl:col-span-3">
                {/* <img className="w-full mx-auto scale-110" src="https://d33wubrfki0l68.cloudfront.net/29c501c64b21014b3f2e225abe02fe31fd8f3a5c/f866d/images/hero/3/illustration.png" alt="" /> */}
                <img className="w-full mx-auto scale-110" src="/images/brand/tult-landing-10.png" alt="" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
