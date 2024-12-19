import { useState } from 'react';

function App() {
  const [progress, setProgress] = useState(0);
  const [questions] = useState([
    "What is your target market?",
    "What products do you offer?",
    "Who are your competitors?",
    "What is your marketing strategy?",
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [chat, setChat] = useState<{ type: string; text: string }[]>([]);

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).elements.namedItem('message') as HTMLInputElement;
    const inputValue = input.value;
    if (!inputValue.trim()) return;

    setChat([...chat, { type: "user", text: inputValue }]);

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setChat((prevChat) => [
          ...prevChat,
          { type: "agent", text: questions[currentQuestionIndex + 1] },
        ]);
        setProgress(((currentQuestionIndex + 2) / questions.length) * 100);
      }, 1000);
    } else {
      setProgress(100);
    }

    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="App min-h-screen h-screen flex flex-col bg-gray-300">
      <div className="question-view-container w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-center text-purple-800 mb-4">Current Question</h1>
        <div className="question-window h-24 flex items-center justify-center border rounded p-4 bg-gray-200 mb-4">
          <p className="text-lg text-gray-800">{questions[currentQuestionIndex]}</p>
        </div>
        <form className="flex items-center space-x-2" onSubmit={handleSend}>
          <input
            type="text"
            name="message"
            placeholder="Type your answer..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Send
          </button>
        </form>
      </div>

      <div className="chat-view-container w-full max-w-4xl h-full bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
        <h1 className="text-2xl font-bold text-center text-purple-800 mb-4">Chat System</h1>
        <div className="chat-window flex-1 overflow-y-auto border rounded p-4 mb-4 bg-gray-200">
          {chat.map((message, index) => (
            <div key={index} className={`message mb-2 ${message.type === "user" ? "text-right" : "text-left"}`}>
              <div className={`${message.type === "user" ? "bg-purple-500 text-white ml-auto" : "bg-green-200 text-gray-800"} p-2 rounded w-max max-w-xs`}> 
                {message.text}
              </div>
            </div>
          ))}
        </div>
        {progress >= 100 && (
          <button
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 mt-4"
          >
            Generate Report
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
