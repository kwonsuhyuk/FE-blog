"use client";

import { motion } from "framer-motion";

export default function About() {
  const career = [
    {
      period: "2025.07 - 2025.12",
      title: "Futurescolle 퓨쳐스콜레 (인턴)",
      role: "Frontend Developer / Liveclass & Internal Backoffice Dev",
    },
    {
      period: "2024.11 - 2025.01",
      title: "Codeit 코드잇 (인턴)",
      role: "Frontend Intern / Visual Website Builder Interface",
    }
  ];

  const projectsAndActivities = [
    {
      period: "2024.07 - 2024.09",
      title: "travelevart",
      role: "AI Travel Itinerary Service / Frontend Lead",
    },
    {
      period: "2023.11 - 2025.06",
      title: "OnAndOff",
      role: "Construction Attendance Service / Personal Project",
    }
  ];

  const education = [
    {
      period: "2020.03 - 2026.02",
      title: "Hanyang University 한양대학교",
      role: "B.S. in New Industry Software (신산업소프트웨어)",
    },
    {
      period: "2024.11 - 2025.01",
      title: "Codeit 코드잇",
      role: "Frontend Advanced Course 5th Generation",
    },
    {
      period: "2024.03 - 2024.09",
      title: "Programmers 프로그래머스",
      role: "Full-stack Devcourse 2nd Generation",
    }
  ];

  return (
    <main className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-text-main">
      {/* Intro Header */}
      <section className="mb-32 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-black tracking-tight mb-8"
        >
          권수혁
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="max-w-2xl mx-auto space-y-4"
        >
          <p className="text-lg md:text-xl font-light leading-relaxed text-text-muted">
            사용자 경험(UX)과 개발자 경험(DX)의 조화를 추구하며, <br className="hidden md:block" />
            효율적인 프로세스 구축을 통해 비즈니스 가치를 창출하는 프론트엔드 개발자입니다.
          </p>
          <p className="text-base font-light text-text-dim">
            TypeScript, React, Next.js 기반의 견고한 아키텍처 설계를 선호합니다.
          </p>
        </motion.div>
      </section>

      {/* Career Section */}
      <section className="mb-32">
        <h2 className="text-3xl font-extralight tracking-[0.2em] uppercase text-center mb-20 text-text-light">
          Career
        </h2>
        
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-[30%] md:left-[35%] top-2 bottom-2 w-[1px] bg-border-main"></div>

          <div className="space-y-16">
            {career.map((item, index) => (
              <div key={index} className="relative flex items-start">
                <div className="w-[30%] md:w-[35%] pr-6 md:pr-10 text-right pt-1">
                  <span className="text-sm md:text-base font-medium text-text-dim tracking-wider">
                    {item.period}
                  </span>
                </div>
                <div className="absolute left-[30%] md:left-[35%] top-2 -translate-x-1/2 w-2 h-2 rounded-full border border-slate-300 bg-white z-10"></div>
                <div className="w-[70%] md:w-[65%] pl-8 md:pl-12">
                  <h3 className="text-xl md:text-2xl font-black text-text-main mb-2 tracking-tight leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base font-medium text-text-muted">
                    {item.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity & Project Section */}
      <section className="mb-32">
        <h2 className="text-3xl font-extralight tracking-[0.2em] uppercase text-center mb-20 text-text-light">
          Activity & Project
        </h2>
        
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-[30%] md:left-[35%] top-2 bottom-2 w-[1px] bg-border-main"></div>

          <div className="space-y-16">
            {projectsAndActivities.map((item, index) => (
              <div key={index} className="relative flex items-start">
                <div className="w-[30%] md:w-[35%] pr-6 md:pr-10 text-right pt-1">
                  <span className="text-sm md:text-base font-medium text-text-dim tracking-wider">
                    {item.period}
                  </span>
                </div>
                <div className="absolute left-[30%] md:left-[35%] top-2 -translate-x-1/2 w-2 h-2 rounded-full border border-slate-300 bg-white z-10"></div>
                <div className="w-[70%] md:w-[65%] pl-8 md:pl-12">
                  <h3 className="text-xl md:text-2xl font-black text-text-main mb-2 tracking-tight leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base font-medium text-text-muted">
                    {item.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="mb-32">
        <h2 className="text-3xl font-extralight tracking-[0.2em] uppercase text-center mb-20 text-text-light">
          Education
        </h2>
        
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-[30%] md:left-[35%] top-2 bottom-2 w-[1px] bg-border-main"></div>

          <div className="space-y-16">
            {education.map((item, index) => (
              <div key={index} className="relative flex items-start">
                <div className="w-[30%] md:w-[35%] pr-6 md:pr-10 text-right pt-1">
                  <span className="text-sm md:text-base font-medium text-text-dim tracking-wider">
                    {item.period}
                  </span>
                </div>
                <div className="absolute left-[30%] md:left-[35%] top-2 -translate-x-1/2 w-2 h-2 rounded-full border border-slate-300 bg-white z-10"></div>
                <div className="w-[70%] md:w-[65%] pl-8 md:pl-12">
                  <h3 className="text-xl md:text-2xl font-black text-text-main mb-2 tracking-tight leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base font-medium text-text-muted">
                    {item.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="mt-32 pt-20 border-t border-border-main text-center">
        <h2 className="text-xl font-black tracking-widest uppercase mb-10 text-text-light">
          Contact
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-16">
          <a href="mailto:supersuhyuk@gmail.com" className="text-lg font-bold text-text-muted hover:text-primary transition-colors">
            supersuhyuk@gmail.com
          </a>
          <a href="https://github.com/kwonsuhyuk" target="_blank" rel="noreferrer" className="text-lg font-bold text-text-muted hover:text-primary transition-colors tracking-tight">
            github.com/kwonsuhyuk
          </a>
        </div>
      </section>
    </main>
  );
}
