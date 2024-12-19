import { useState } from 'react';
import './App.css';

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
  const [generalQuestion, setGeneralQuestion] = useState('');

  const handleQuestionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).elements.namedItem('questionAnswer') as HTMLInputElement;
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

    input.value = '';
  };

  const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!generalQuestion.trim()) return;

    setChat([...chat, { type: "user", text: generalQuestion }]);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: generalQuestion }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setChat(prevChat => [
        ...prevChat,
        { type: "agent", text: data.response }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setChat(prevChat => [
        ...prevChat,
        { type: "agent", text: "Sorry, there was an error processing your request." }
      ]);
    }

    setGeneralQuestion('');
  };

  const handleGenerateReport = async () => {
    try {
      const response = await fetch('/generate-report');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'business_report.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black flex items-center justify-center fixed inset-0">
      {/* Accent lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-pulse-slow absolute top-20 left-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="animate-pulse-slow animation-delay-2000 absolute bottom-20 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main container */}
      <div className="w-[400px] h-[750px] bg-gradient-to-b from-gray-900/95 to-gray-900/80 backdrop-blur-xl rounded-[40px] overflow-hidden flex flex-col relative border border-emerald-900/20 shadow-2xl">
        {/* Header */}
        <div className="p-8 bg-gradient-to-b from-emerald-950/30 to-transparent">
          <h1 className="text-2xl font-semibold text-emerald-50 text-center tracking-tight mb-1">Accomplish</h1>
          <p className="text-purple-300/70 text-sm text-center mb-4">Strategic Planning Assistant</p>
          <div className="w-full bg-gray-800/50 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Section */}
        <div className="px-6 py-4">
          <div className="bg-gradient-to-br from-emerald-950/20 to-purple-950/20 rounded-2xl p-5 backdrop-blur-sm border border-emerald-800/20">
            <p className="text-emerald-50/90 text-sm leading-relaxed">
              {questions[currentQuestionIndex]}
            </p>
          </div>
          <form onSubmit={handleQuestionSubmit} className="mt-4 flex gap-2">
            <input
              type="text"
              name="questionAnswer"
              placeholder="Enter your response..."
              className="flex-1 px-5 py-3 text-sm rounded-xl bg-emerald-950/20 border border-emerald-800/20 text-white placeholder-emerald-400/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-3 rounded-xl text-sm font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center shadow-lg shadow-emerald-950/20"
            >
              Send
            </button>
          </form>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4 mb-4">
              {chat.map((message, index) => (
                <div key={index} 
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div className={`rounded-2xl px-5 py-3 max-w-[85%] text-sm leading-relaxed ${
                    message.type === "user" 
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-950/20" 
                      : "bg-gradient-to-br from-emerald-950/20 to-purple-950/20 text-emerald-50 border border-emerald-800/20"
                  }`}>
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bg-gradient-to-t from-gray-900 to-transparent backdrop-blur-sm border-t border-emerald-900/30">
            {progress >= 100 && (
              <div className="px-6 pt-4">
                <button
                  onClick={handleGenerateReport}
                  className="w-full bg-gradient-to-r from-emerald-600 to-purple-600 text-white py-3 rounded-xl text-sm font-medium hover:from-emerald-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                >
                  <span>Generate Business Report</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
              </div>
            )}

            {/* Chat Input */}
            <div className="p-6">
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={generalQuestion}
                  onChange={(e) => setGeneralQuestion(e.target.value)}
                  placeholder="Ask a business-related question..."
                  className="flex-1 px-5 py-3 text-sm rounded-xl bg-emerald-950/30 border border-emerald-800/30 text-white placeholder-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-3 rounded-xl text-sm font-medium hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center"
                >
                  Ask
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
