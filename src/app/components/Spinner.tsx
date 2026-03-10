interface Props {
  loading: boolean;
}
const Spinner = ({ loading }: Props) => {
  return (
    <>
      {loading && (
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </>
  );
};

export { Spinner };
