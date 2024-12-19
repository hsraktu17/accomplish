function App() {
  return (
    <div className="App min-h-screen h-screen flex items-center justify-center bg-gray-300">
      <div className="mobile-view-container w-full max-w-sm h-screen p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-purple-800 mb-4">
          Chat Screen
        </h1>
        <div className="chat-window h-4/5 overflow-y-auto border rounded p-4 mb-4 bg-gray-200">
          <div className="message mb-2">
            <div className="text-left text-sm text-gray-800 bg-green-200 p-2 rounded w-max max-w-xs">
              Hello! How can I help you today?
            </div>
          </div>
          <div className="message mb-2 text-right">
            <div className="text-sm text-white bg-purple-500 p-2 rounded w-max max-w-xs ml-auto">
              I need assistance with my order.
            </div>
          </div>
        </div>
        <form className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
