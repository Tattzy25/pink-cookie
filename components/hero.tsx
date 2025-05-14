"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="w-full pt-4 pb-12 md:pt-6 md:pb-24 bg-[#e783bd] relative overflow-hidden">
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

        .revolution-text {
          font-family: 'Great Vibes', cursive !important;
          font-size: 4.2rem !important;
          line-height: 1 !important;
          margin-top: -0.1em;
          font-weight: normal !important;
          padding-top: 0.1em;
        }
        
        @media (min-width: 640px) {
          .revolution-text {
            font-size: 6.5rem !important;
          }
        }
        
        @media (min-width: 1280px) {
          .revolution-text {
            font-size: 8rem !important;
          }
        }

        /* Bubble Animation Styles */
        .container-bubbles {
          z-index: 0;
        }

        .bubble {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          box-shadow: inset 0 0 25px rgba(255, 255, 255, 0.25);
          animation: animate_4010 8s ease-in-out infinite;
        }

        .bubble:nth-child(1) {
          top: 20%;
          left: 20%;
        }

        .bubble:nth-child(2) {
          position: absolute;
          zoom: 0.45;
          left: 10%;
          top: 60%;
          animation-delay: -4s;
        }

        .bubble:nth-child(3) {
          position: absolute;
          zoom: 0.45;
          right: 15%;
          top: 30%;
          animation-delay: -6s;
        }

        .bubble:nth-child(4) {
          position: absolute;
          zoom: 0.35;
          left: 40%;
          bottom: 20%;
          animation-delay: -3s;
        }

        .bubble:nth-child(5) {
          position: absolute;
          zoom: 0.5;
          right: 25%;
          top: 70%;
          animation-delay: -5s;
        }

        @keyframes animate_4010 {
          0%,100% {
            transform: translateY(-20px);
          }

          50% {
            transform: translateY(20px);
          }
        }

        .bubble::before {
          content: '';
          position: absolute;
          top: 50px;
          left: 45px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #fff;
          z-index: 10;
          filter: blur(2px);
        }

        .bubble::after {
          content: '';
          position: absolute;
          top: 80px;
          left: 80px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fff;
          z-index: 10;
          filter: blur(2px);
        }

        .bubble span {
          position: absolute;
          border-radius: 50%;
        }

        .bubble span:nth-child(1) {
          inset: 10px;
          border-left: 15px solid #0fb4ff;
          filter: blur(8px);
        }

        .bubble span:nth-child(2) {
          inset: 10px;
          border-right: 15px solid #ff4484;
          filter: blur(8px);
        }

        .bubble span:nth-child(3) {
          inset: 10px;
          border-top: 15px solid #ffeb3b;
          filter: blur(8px);
        }

        .bubble span:nth-child(4) {
          inset: 30px;
          border-left: 15px solid #ff4484;
          filter: blur(12px);
        }

        .bubble span:nth-child(5) {
          inset: 10px;
          border-bottom: 10px solid #fff;
          filter: blur(8px);
          transform: rotate(330deg);
        }
      `}</style>
      <div className="container px-4 md:px-6">
        <div className="relative max-w-3xl mx-auto">
          <div
            className="absolute inset-0 rounded-[49px]"
            style={{
              background: "#e783bd",
              boxShadow: "27px 27px 54px #6d2849",
              transform: "translateY(10px)",
              zIndex: 0,
            }}
          >
            {/* Add bubbles inside the card background */}
            <div className="container-bubbles absolute inset-0 w-full h-full overflow-hidden pointer-events-none rounded-[49px]">
              <div className="bubble">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="bubble">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="bubble">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="bubble">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="bubble">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex flex-col justify-center items-center text-center space-y-6 p-6 md:p-10">
            <div className="space-y-0">
              <h1
                className="hero-heading text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none"
                style={{
                  background: "linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0px 2px 4px rgba(0, 0, 0, 0.3), 0px 0px 1px rgba(0, 0, 0, 0.7)",
                  position: "relative",
                  overflow: "hidden",
                  animation: "shimmer 2.5s infinite",
                }}
              >
                Unleash the Flavor
              </h1>
              <h2
                className="revolution-text"
                style={{
                  background: "linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0px 2px 4px rgba(0, 0, 0, 0.3), 0px 0px 1px rgba(0, 0, 0, 0.7)",
                  position: "relative",
                  overflow: "hidden",
                  animation: "shimmer 2.5s infinite",
                  fontFamily: "'Great Vibes', cursive",
                }}
              >
                Revolution
              </h2>
              <p className="max-w-[600px] mx-auto text-black md:text-xl mt-4 font-medium">- Elevate your taste buds</p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/customization-suite">
                <Button
                  className="rounded-full text-black font-bold px-8 py-6 text-lg transition-all"
                  style={{
                    background: "linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)",
                    boxShadow: "0px 4px 15px rgba(186, 143, 33, 0.5), 0px 0px 10px rgba(255, 215, 0, 0.3)",
                  }}
                >
                  Start Designing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
