interface LogoProps {
  color?: string;
  className?: string;
}

export default function PMTLogo({ color: _color = "currentColor", className = "" }: LogoProps) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return (
    <img
      src={`${base}/pol-marsol-logo.svg`}
      alt="Pol Marsol logo"
      className={className}
      draggable={false}
      decoding="async"
    />
  );
}
