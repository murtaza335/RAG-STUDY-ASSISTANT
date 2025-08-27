"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { api } from "~/trpc/react";
import Markdown from "react-markdown";

export default function ChatPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [messages, setMessages] = useState<Array<{id: string, type: 'user' | 'assistant', content: string}>>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [fileUploadStatus, setFileUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendChat = api.newChat.sendChat.useMutation();

  const handleFileUpload = async (file: File) => {
    console.log("in handle file upload");
    console.log(file);
    
    setIsFileUploading(true);
    setFileUploadStatus('uploading');
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/uploadFile`, {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        setFileUploadStatus('processing');
        const data = await response.json();
        console.log("File uploaded successfully:", data);
        
        // Simulate processing time (you can remove this if your API provides real-time updates)
        setTimeout(() => {
          setFileUploadStatus('completed');
          setIsFileUploading(false);
        }, 2000);
        
      } else {
        console.error("File upload failed:", response.statusText);
        setFileUploadStatus('error');
        setIsFileUploading(false);
        return;
      }
    } catch (error) {
      console.error("File upload error:", error);
      setFileUploadStatus('error');
      setIsFileUploading(false);
      return;
    }
    
    setUploadedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && !uploadedFile && !isFileUploading && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setIsFileUploading(false);
    setFileUploadStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: currentMessage
    };
    
    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage("");
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(async () => {
      const response = await sendChat.mutateAsync({ question: currentMessage, fileName: uploadedFile?.name ?? "" });
      const message = {
        id: Date.now().toString(),
        type: 'assistant' as const,
        content: response
      };
      console.log(response);
      setMessages(prev => [...prev, message]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800/30 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          {/* New Chat Button */}
          <Link 
            href="/chat/new"
            className="bg-gray-900/50 hover:bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 rounded-lg px-4 py-2 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <span className="text-gray-400">+</span>
            <span className="text-gray-300">New Chat</span>
          </Link>

          {/* Title */}
          <h1 className="text-xl font-medium text-gray-100">
            RAG Assistant
          </h1>

          {/* Home Button */}
          <Link 
            href="/"
            className="bg-gray-900/50 hover:bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 rounded-lg px-4 py-2 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <span className="text-gray-400">←</span>
            <span className="text-gray-300">Home</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8 min-h-[calc(100vh-120px)]">
        {/* Sidebar - File Upload */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900/30 border border-gray-800/50 rounded-lg p-6 h-fit">
            <h2 className="text-lg font-medium mb-6 text-gray-200">Document</h2>
            
            {!uploadedFile && !isFileUploading ? (
              <div 
                className={`border border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                  isDragOver 
                    ? 'border-blue-400/50 bg-blue-500/5' 
                    : 'border-gray-600/50 hover:border-gray-500/50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="text-2xl mb-3 text-gray-400">📄</div>
                <p className="text-gray-400 mb-4 text-sm">
                  Drop your document here
                </p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600 rounded-lg px-4 py-2 transition-all duration-300 text-sm text-gray-300"
                >
                  Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && !isFileUploading) handleFileUpload(file);
                  }}
                />
                <p className="text-xs text-gray-500 mt-3">
                  PDF, DOC, DOCX, TXT
                </p>
              </div>
            ) : isFileUploading ? (
              <div className="space-y-4">
                {/* Upload Progress */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin text-blue-400 text-sm">⚡</div>
                    <div>
                      <p className="text-blue-400 font-medium text-sm">
                        {fileUploadStatus === 'uploading' ? 'Uploading...' : 
                         fileUploadStatus === 'processing' ? 'Processing...' : 'Uploading...'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {fileUploadStatus === 'uploading' ? 'Sending file to server' :
                         fileUploadStatus === 'processing' ? 'Analyzing document content' : 'Please wait'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-gray-400 text-xs">
                      {fileUploadStatus === 'uploading' ? 'Uploading document...' : 'Processing for RAG...'}
                    </div>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div 
                      className={`bg-blue-500 h-2 rounded-full transition-all duration-1000 ${
                        fileUploadStatus === 'uploading' ? 'w-1/3' : 
                        fileUploadStatus === 'processing' ? 'w-2/3' : 'w-full'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* File Preview */}
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-lg text-blue-400">📄</div>
                      <div>
                        <p className="font-medium text-gray-200 truncate max-w-[120px] text-sm">
                          {uploadedFile?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {uploadedFile ? (uploadedFile.size / 1024).toFixed(1) : '0'} KB
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={removeFile}
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Success Status */}
                <div className={`rounded-lg p-4 ${
                  fileUploadStatus === 'completed' 
                    ? 'bg-green-500/10 border border-green-500/20' 
                    : fileUploadStatus === 'error'
                    ? 'bg-red-500/10 border border-red-500/20'
                    : 'bg-blue-500/10 border border-blue-500/20'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`text-sm ${
                      fileUploadStatus === 'completed' ? 'text-green-400' :
                      fileUploadStatus === 'error' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {fileUploadStatus === 'completed' ? '✓' : 
                       fileUploadStatus === 'error' ? '✗' : '⚡'}
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${
                        fileUploadStatus === 'completed' ? 'text-green-400' :
                        fileUploadStatus === 'error' ? 'text-red-400' : 'text-blue-400'
                      }`}>
                        {fileUploadStatus === 'completed' ? 'Ready to Chat' :
                         fileUploadStatus === 'error' ? 'Upload Failed' : 'Processing...'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {fileUploadStatus === 'completed' ? 'Document ready for questions' :
                         fileUploadStatus === 'error' ? 'Please try uploading again' : 'Preparing document...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-4 flex flex-col h-[calc(100vh-140px)]">
          <div className="bg-gray-900/20 border border-gray-800/50 rounded-lg flex-1 flex flex-col overflow-hidden">
            
            {/* Chat Messages - Scrollable */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-32">
                  <div className="text-4xl mb-4 text-gray-500">💬</div>
                  <h3 className="text-lg font-medium mb-2 text-gray-300">Start a conversation</h3>
                  <p className="text-gray-500">Upload a document and ask questions about it</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`rounded-lg p-4 ${
                        message.type === 'user' 
                          ? 'bg-blue-600/20 border border-blue-500/30' 
                          : 'bg-gray-800/50 border border-gray-700/50'
                      }`}>
                        {message.type === 'user' ? (
                          <p className="text-gray-100 leading-relaxed">{message.content}</p>
                        ) : (
                          <div className="markdown-content">
                            <Markdown
                              components={{
                                // Custom styling for markdown elements
                                h1: ({...props}) => <h1 className="text-xl font-bold text-gray-100 mb-3" {...props} />,
                                h2: ({...props}) => <h2 className="text-lg font-semibold text-gray-100 mb-2" {...props} />,
                                h3: ({...props}) => <h3 className="text-base font-medium text-gray-100 mb-2" {...props} />,
                                p: ({...props}) => <p className="text-gray-100 mb-2 last:mb-0" {...props} />,
                                ul: ({...props}) => <ul className="list-disc list-inside text-gray-100 mb-2 space-y-1" {...props} />,
                                ol: ({...props}) => <ol className="list-decimal list-inside text-gray-100 mb-2 space-y-1" {...props} />,
                                li: ({...props}) => <li className="text-gray-100" {...props} />,
                                code: ({inline, ...props}: {inline?: boolean} & any) => 
                                  inline ? (
                                    <code className="bg-gray-700/50 text-gray-200 px-1 py-0.5 rounded text-sm" {...props} />
                                  ) : (
                                    <code className="block bg-gray-700/50 text-gray-200 p-3 rounded text-sm overflow-x-auto" {...props} />
                                  ),
                                pre: ({...props}) => <pre className="bg-gray-700/50 text-gray-200 p-3 rounded text-sm overflow-x-auto mb-2" {...props} />,
                                blockquote: ({...props}) => <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-300 mb-2" {...props} />,
                                strong: ({...props}) => <strong className="font-semibold text-gray-100" {...props} />,
                                em: ({...props}) => <em className="italic text-gray-100" {...props} />,
                                a: ({...props}) => <a className="text-blue-400 hover:text-blue-300 underline" {...props} />,
                              }}
                            >
                              {message.content}
                            </Markdown>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full animation-delay-100"></div>
                      <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full animation-delay-200"></div>
                      <p className="text-gray-400 ml-2">Thinking...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input - Fixed at bottom */}
            <div className="border-t border-gray-800/50 p-6 bg-gray-900/20">
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg focus-within:border-gray-600 transition-all duration-300">
                <div className="flex items-center gap-3 p-4">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={uploadedFile && fileUploadStatus === 'completed' ? "Ask a question about your document..." : "Upload and process a document to start chatting..."}
                    disabled={!uploadedFile || fileUploadStatus !== 'completed'}
                    className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 outline-none"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || !uploadedFile || isLoading || fileUploadStatus !== 'completed'}
                    className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-500/50 rounded-lg p-2 disabled:opacity-50 disabled:hover:bg-blue-600/20 disabled:hover:border-blue-500/30 transition-all duration-300"
                  >
                    <span className="text-blue-400">→</span>
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Press Enter to send
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
