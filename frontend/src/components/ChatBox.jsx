import { MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import axiosInstance from '../lib/axios.js';

export const ChatBox = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await axiosInstance.post("/chats", { message: input });
      const aiMsg = { role: "assistant", content: res.data.reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("ChatBox Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-500 p-4 rounded-full shadow-lg text-white hover:bg-blue-600"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {open && (
        <div className="bg-white shadow-2xl rounded-2xl w-80 h-96 flex flex-col">
          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="font-semibold text-blue-600">AI Assistant</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.role === "user" ? "text-right" : "text-left"}
              >
                <div
                  className={`inline-block p-2 rounded-xl ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatBox;