"use client";

import Header from "@/components/Header";
import Terminal from "@/components/Terminal";
import Character from "@/components/Character";
import SkillTree from "@/components/SkillTree";
import Quests from "@/components/Quests";
import Journey from "@/components/Journey";
import DeployRun from "@/components/DeployRun";
import Contact from "@/components/Contact";
import Resume from "@/components/Resume";
import Toasts from "@/components/Toasts";
import { useStore } from "@/lib/store";

export default function Page() {
  const { mode, konami } = useStore();

  return (
    <div
      className={
        konami ? "transition-[filter] duration-500 [filter:hue-rotate(150deg)_saturate(1.4)]" : ""
      }
    >
      <Header />
      {mode === "play" ? (
        <main>
          <Terminal />
          <Character />
          <SkillTree />
          <Quests />
          <Journey />
          <DeployRun />
          <Contact />
        </main>
      ) : (
        <Resume />
      )}
      <Toasts />
    </div>
  );
}
