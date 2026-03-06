declare module "lucide-react" {
    import { FC, SVGProps } from "react";
    export interface IconProps extends SVGProps<SVGSVGElement> {
        size?: string | number;
        absoluteStrokeWidth?: boolean;
    }
    export const Download: FC<IconProps>;
    export const Instagram: FC<IconProps>;
    export const Loader2: FC<IconProps>;
    export const ArrowRight: FC<IconProps>;
}
