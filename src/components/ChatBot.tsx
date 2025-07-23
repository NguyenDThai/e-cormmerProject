"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatBot = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = useSession();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const useSerMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, useSerMessage];
    setMessages((prevMessages) => [...prevMessages, useSerMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      if (res.ok) {
        // Phan hoi cua chatbot
        const assistantMessage: Message = {
          role: "assistant",
          content: data.reply,
        };
        setMessages((prevMessage) => [...prevMessage, assistantMessage]);
      } else {
        console.error(data.error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: "Có lỗi xảy ra, vui lòng thử lại." },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "Có lỗi xảy ra, vui lòng thử lại." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMessages([]);
  }, []);

  return (
    <>
      {session && (
        <>
          <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
          {/* Modal chat */}
          {isOpen && (
            <div
              className="w-full max-w-md bg-white shadow-lg rounded-t-lg flex flex-col fixed bottom-10 right-25 z-50"
              style={{ height: "500px" }}
            >
              {/* Header */}
              <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
                <h2 className="text-lg font-bold">Black Store AI</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-gray-200 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Nội dung chat */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 h-full flex items-center justify-center">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-gray-300 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <p>Xin chào! Tôi có thể giúp gì cho bạn?</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.role === "user"
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input chat */}
              <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tin nhắn..."
                    disabled={loading}
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                    disabled={loading}
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ChatBot;
