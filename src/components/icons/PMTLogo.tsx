import Image from "next/image";

interface LogoProps {
  color?: string;
  className?: string;
}

export default function PMTLogo({ color: _color = "currentColor", className = "" }: LogoProps) {
  return (
    <Image
      src="/pol-marsol-logo.svg"
      alt="Pol Marsol logo"
      width={40}
      height={40}
      className={className}
      draggable={false}
      decoding="async"
      unoptimized
    />
  );
}
