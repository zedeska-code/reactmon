import { SvgIconComponent } from "@mui/icons-material";
import Link from "next/link";

export default function IconLink({
  Icon,
  size = "7xl",
  className,
  href,
}: {
  Icon: SvgIconComponent;
  size?: string;
  className?: string;
  href: string;
}) {
  return (
    <Link href={{ href }} className={`w-fit text-${size}`}>
      <Icon
        fontSize="inherit"
        className={`rounded-3xl aspect-square w-fit bg-secondary text-on-secondary shadow-md shadow-shadow ${className}`}
      />
    </Link>
  );
}
