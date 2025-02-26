import "./App.css";

function App() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-700 text-xl font-bold">
          Esports Dashboard
        </div>
        <nav className="flex-1">
          <ul>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">Overview</li>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">Stats</li>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">
              Tournaments
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-100 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center px-4">
          <h1 className="text-xl font-semibold">Dashboard Header</h1>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Welcome to the Esports Dashboard
          </h2>
          <p className="mb-4">
            Here you can view Esports statistics, interactive visualizations,
            and more.
          </p>
          {/* Insert your charts, data tables, or other dashboard components here */}
        </main>
      </div>
    </div>
  );
}

export default App;
