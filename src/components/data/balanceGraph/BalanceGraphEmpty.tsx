interface BalanceGraphEmptyProps {
  isLoading?: boolean;
}

const BalanceGraphEmpty = ({ isLoading = false }: BalanceGraphEmptyProps) => {
  return (
    <div className="max-h-[300px] flex items-center justify-center text-muted-foreground">
      {isLoading ? "Loading data..." : "No data available"}
    </div>
  );
};

export default BalanceGraphEmpty;

