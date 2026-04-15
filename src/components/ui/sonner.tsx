import { Toaster } from "sonner";

type SonnerProps = React.ComponentProps<typeof Toaster>;

const Sonner = ({ ...props }: SonnerProps) => {
  return <Toaster {...props} />;
};

export { Sonner };