import PageMeta from "../../components/common/PageMeta";
import CardSwap, {Card} from "../../components/card_swap/CardSwarp";
import LandingHeader from "../../components/header/LandingHeader";
import Shuffle from "../../components/effects/Shuffle";
import { useSignInRedirect } from "../../hooks/useSignInRedirect";

export default function Landing() {
  const redirectToSignIn = useSignInRedirect();
  return (
    <>
      <PageMeta
        title="Everything you need, all in SPHERE"
        description="Powerful admin dashboard solution designed for modern businesses"
      />
      
      {/* Layout Container */}
      <div className="h-screen bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
        {/* Navbar */}
        <LandingHeader />
        
        {/* Hero Section - Takes remaining space */}
        <section className="relative flex-1 flex items-center overflow-hidden">
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              
              {/* Left Content - With Padding */}
              <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-24 py-20 lg:py-0">
                <div className="max-w-xl space-y-6">
                  
                  <h1 className="text-4xl md:text-5xl font-medium leading-tight text-gray-900 dark:text-white">
                    Everything You Need,<br/> All in <br/>
                        <Shuffle
                            text="SPHERE"
                            shuffleDirection="right"
                            duration={0.35}
                            animationMode="evenodd"
                            shuffleTimes={1}
                            ease="power3.out"
                            stagger={0.03}
                            threshold={0.1}
                            triggerOnce={true}
                            triggerOnHover={true}
                            respectReducedMotion={true}
                            className="text-brand-600 text-3xl font-semibold dark:text-brand-500"
                        />
                  </h1>
                  

                  {/* Sign In button */}
                  <button onClick={redirectToSignIn} className="inline-flex items-center px-10 py-4 rounded-lg shadow-sm text-xl font-medium text-gray-700 transition-colors bg-gray-100 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                    Get Started
                  </button>
                </div>
              </div>

              {/* Right Content - Card Swap (NO Padding/Margin) */}
              <div className="relative flex items-center justify-center lg:justify-start" style={{ minHeight: '600px' }}>
                <div style={{ height: '600px', width: '100%', position: 'relative' }}>
                  <CardSwap
                    width={800}
                    height={600}
                    cardDistance={60}
                    verticalDistance={70}
                    delay={5000}
                    pauseOnHover={true}
                  >
                    <Card className="p-4 bg-gray/20 rounded-2xl shadow-2xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-2xl">
                          ⚡
                        </div>
                        <h3 className="text-xl text-white font-semibold">Effectiveness</h3>
                      </div>
                      <hr className="border-white/30 mb-4" />
                      <p className="text-base text-white/90 leading-relaxed">
                        Experience blazing-fast performance with our optimized architecture. 
                        Load pages 3x faster and handle millions of data points effortlessly.
                      </p>
                      <div className="mt-6 flex flex-wrap items-center gap-2 text-white/90 text-sm">
                        <span className="px-3 py-1 rounded-full">99.9% Uptime</span>
                        <span className="px-3 py-1 rounded-full">&lt;100ms Response</span>
                      </div>
                    </Card>

                    <Card className="p-4 bg-gray/20 rounded-2xl shadow-2xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-2xl">
                          🛡️
                        </div>
                        <h3 className="text-xl text-white font-semibold">Reliability</h3>
                      </div>
                      <hr className="border-white/30 mb-4" />
                      <p className="text-base text-white/90 leading-relaxed">
                        Your data is protected with enterprise-grade encryption and advanced security protocols. 
                        SOC 2 Type II certified with automatic backups.
                      </p>
                      <div className="mt-6 flex flex-wrap items-center gap-2 text-white/90 text-sm">
                        <span className="bg-white/20 px-3 py-1 rounded-full">256-bit Encryption</span>
                        <span className="bg-white/20 px-3 py-1 rounded-full">SOC 2 Certified</span>
                      </div>
                    </Card>

                    <Card className="p-4 bg-gray/20 rounded-2xl shadow-2xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-2xl">
                          🚀
                        </div>
                        <h3 className="text-xl text-white font-semibold">Efficiency</h3>
                      </div>
                      <hr className="border-white/30 mb-4" />
                      <p className="text-base text-white/90 leading-relaxed">
                        Built to grow with your business. From startup to enterprise, our infrastructure 
                        automatically scales to meet your demands seamlessly.
                      </p>
                      <div className="mt-6 flex flex-wrap items-center gap-2 text-white/90 text-sm">
                        <span className="bg-white/20 px-3 py-1 rounded-full">Auto-Scaling</span>
                        <span className="bg-white/20 px-3 py-1 rounded-full">Unlimited Users</span>
                      </div>
                    </Card>
                  </CardSwap>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </>
  );
}