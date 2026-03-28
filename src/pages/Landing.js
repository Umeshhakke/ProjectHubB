import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import localImage from '../images/img.png';

export default function Landing() {

  // 🔥 typing animation
  const [text, setText] = useState("");
  const fullText = "> Initializing ProjectGuid System...";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-green-400 min-h-screen font-mono overflow-hidden relative">

      {/* 🌌 GLOW BACKGROUND */}
      <div className="absolute w-[500px] h-[500px] bg-green-500 opacity-20 blur-[120px] top-[-100px] left-[-100px]" />
      <div className="absolute w-[500px] h-[500px] bg-blue-500 opacity-20 blur-[120px] bottom-[-100px] right-[-100px]" />

      {/* 🔥 HERO */}
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 relative z-10">

        <div className="text-6xl mb-6 animate-pulse">
          <img src={localImage} alt="Login illustration" width={400} height={400} />
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-widest text-green-300">
          PROJECT GUID
        </h1>

        <p className="text-lg md:text-xl text-green-400 max-w-2xl mb-6">
          Skip coding stress. Download ready-made projects.  
          Submit faster. Score better.
        </p>

        {/* CTA */}
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            to="/login"
            className="px-6 py-3 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition shadow-lg hover:scale-105"
          >
            Access System
          </Link>

          <Link
            to="/signup"
            className="px-6 py-3 border border-green-400 rounded hover:bg-green-400 hover:text-black transition hover:scale-105"
          >
            Create Identity
          </Link>
        </div>

        {/* TERMINAL */}
        <div className="mt-8 bg-black border border-green-500 px-4 py-2 rounded text-green-400 text-sm shadow-lg">
          {text}
          <span className="animate-pulse">|</span>
        </div>
      </div>

      {/* ⚡ FEATURES */}
      <div className="py-20 px-6 bg-gradient-to-b from-black to-gray-900 text-center">

        <h2 className="text-3xl font-bold mb-12 text-green-300">
          WHY STUDENTS CHOOSE US
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {[
            { title: "⚡ Instant Access", desc: "Download full project immediately after payment." },
            { title: "💸 Low Cost", desc: "Affordable pricing for every student." },
            { title: "🧠 Ready Code", desc: "No need to build. Just modify & submit." }
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 border border-green-500 rounded-lg hover:shadow-green-500/40 hover:shadow-xl transition hover:-translate-y-2"
            >
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}

        </div>
      </div>

      {/* 🎥 VIDEO BLOCK (INFO ONLY) */}
      <div className="py-20 px-6 text-center">

        <h2 className="text-3xl font-bold mb-6 text-green-300">
          🎥 Project Demo Videos Available
        </h2>

        <p className="text-green-400 mb-6 max-w-xl mx-auto">
          Every project comes with an explanation video so you can understand 
          the working before submission.  
          Watch anytime, learn faster, submit smarter.
        </p>

        <div className="max-w-sm mx-auto p-6 border border-green-500 rounded-lg hover:shadow-xl hover:shadow-green-500/40 transition">
          <div className="text-6xl mb-4">🎬</div>
          <p className="font-semibold text-green-300">
            Video demos included with every project
          </p>
        </div>
      </div>

      {/* 🚀 TECH STACK */}
      <div className="py-20 px-6 text-center">

        <h2 className="text-3xl font-bold mb-10 text-green-300">
          AVAILABLE TECH STACKS
        </h2>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">

          {['React', 'Node.js', 'MongoDB', 'AI', 'ML', 'Python', 'Java'].map((tech, i) => (
            <span
              key={i}
              className="px-4 py-2 border border-green-400 rounded hover:bg-green-400 hover:text-black transition cursor-pointer hover:scale-105"
            >
              {tech}
            </span>
          ))}

        </div>
      </div>

      {/* 🎯 CTA */}
      <div className="py-20 bg-gradient-to-r from-green-900 to-black text-center px-6">

        <h2 className="text-4xl font-bold mb-4">
          Too Lazy to Build a Project?
        </h2>

        <p className="mb-6 text-green-300">
          We already did it for you.
        </p>

        <Link
          to="/projects"
          className="px-8 py-4 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition shadow-xl hover:scale-105"
        >
          Browse Projects
        </Link>
      </div>

      {/* FOOTER */}
      <footer className="text-center py-6 text-green-500 border-t border-green-900">
        © 2026 Project Guid • All Systems Operational
      </footer>
    </div>
  );
}