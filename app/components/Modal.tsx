export default function Modal({
  title,
  isVisible,
  onClose,
  children,
}: {
  title: string;
  isVisible: boolean;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!isVisible) return null;

  const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const divEl = e.target as HTMLDivElement;
    if (divEl.id === "modalWrapper") {
      onClose();
    }
  };
  return (
    <div
      onClick={handleClose}
      id="modalWrapper"
      className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-30 flex justify-center items-center"
    >
      <div className="w-[600px] bg-white p-4 rounded">
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold">{title}</div>
          <div className="cursor-pointer text-2xl" onClick={() => onClose()}>
            &times;
          </div>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
