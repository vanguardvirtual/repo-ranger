const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full">
      <div className="min-h-screen h-full max-w-4xl mx-auto overflow-x-hidden py-8">{children}</div>
    </div>
  );
};

export default Wrapper;
