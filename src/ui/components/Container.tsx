import type { PropsWithChildren } from "react";

const Container = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full h-fauto min-h-screen p-4 flex bg-linear-to-br from-primary/10">
      {children}
    </div>
  );
};

export { Container };
