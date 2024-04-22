import React, { FC } from "react";

const WeatherSkeleton: FC = () => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-20 h-20 text-yellow-500 animate-spin">
      <defs>
        <symbol id="a" viewBox="0 0 375 375">
          {/* core */}
          <circle cx="187.5" cy="187.5" r="84" fill="none" stroke="#fbbf24" strokeMiterlimit="10" strokeWidth="15" />

          {/* rays */}
          <path
            d="M187.5,57.16V7.5m0,360V317.84M279.67,95.33l35.11-35.11M60.22,314.78l35.11-35.11m0-184.34L60.22,60.22M314.78,314.78l-35.11-35.11M57.16,187.5H7.5m360,0H317.84"
            fill="none"
            stroke="#fbbf24"
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="15"
          >
            <animateTransform
              attributeName="transform"
              additive="sum"
              type="rotate"
              values="0 187.5 187.5; 45 187.5 187.5"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>
        </symbol>
      </defs>
      <use width="375" height="375" transform="translate(68.5 68.5)" xlinkHref="#a" />
    </svg>
    </>
  );
};

export default WeatherSkeleton;
