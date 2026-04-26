interface LogoProps {
  color?: string;
  className?: string;
}

export default function PMTLogo({ color: _color = "currentColor", className = "" }: LogoProps) {
  return (
    <img
      src="/pol-marsol-logo.svg"
      alt="Pol Marsol logo"
      className={className}
      draggable={false}
      decoding="async"
    />
  );
}
