
import React from "react";

interface StressBarProps {
  stressLevel: number;
}

const StressBar: React.FC<StressBarProps> = ({ stressLevel }) => (
  <div className="w-full h-3 bg-gray-700">
    <div
      className="h-full bg-gradient-to-r from-gray-400 to-red-500 transition-all duration-300"
      style={{ width: `${stressLevel}%` }}
    ></div>
  </div>
);

export default StressBar;
