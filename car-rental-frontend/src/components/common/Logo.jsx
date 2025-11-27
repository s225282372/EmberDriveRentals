const Logo = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Car Icon */}
      <path 
        d="M20 60 L30 40 L70 40 L80 60 M20 60 L20 75 L30 75 M80 60 L80 75 L70 75 M30 75 A5 5 0 1 0 40 75 M60 75 A5 5 0 1 0 70 75 M40 40 L45 30 L55 30 L60 40" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="35" cy="75" r="3" fill="currentColor" />
      <circle cx="65" cy="75" r="3" fill="currentColor" />
      <path d="M35 50 L40 45 L60 45 L65 50" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
};

export default Logo;

