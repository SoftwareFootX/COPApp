import { useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

interface PropsModal {
  data: Props;
}

const AlertaModal = ({ data }: PropsModal) => {
  const { isOpen, onClose, title } = data;

  useEffect(() => {
    if (!isOpen) return;

    const timeout = setTimeout(() => {
      onClose();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-primary/30 via-primary-400/20 to-primary-400/30 blur-xl opacity-70"></div>

        <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-800">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
};

export { AlertaModal };
