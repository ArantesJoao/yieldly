import NewAccountButton from "./newAccountButton"

const Controls = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Minhas Contas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie suas contas e investimentos
        </p>
      </div>
      <NewAccountButton />
    </div>
  )
}

export default Controls
