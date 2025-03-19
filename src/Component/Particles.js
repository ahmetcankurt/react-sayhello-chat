import Particles from "@tsparticles/react";
import particlesOptions from "../assets/json/particles.json";

function MemoizedParticles() {
  return <Particles id="tsparticles" options={particlesOptions} />;
}

export default MemoizedParticles;
