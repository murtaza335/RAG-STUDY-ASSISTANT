import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center relative">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 animate-pulse"></div>
        
        {/* Main content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          {/* Title with neon effect */}
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-pulse">
            RAG Assistant
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the future of AI-powered document retrieval and generation. 
            Get instant, accurate answers from your knowledge base with cutting-edge technology.
          </p>
          
          {/* CTA Button with neon border */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
            <Link href="/chat/new">
              <button className="relative bg-black border-2 border-transparent rounded-full px-12 py-4 text-xl font-semibold text-white hover:scale-105 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/50">
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  Start Chat
                </span>
              </button>
            </Link>
          </div>
          
          {/* Scroll indicator */}
          
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gradient-to-b from-pink-500 to-cyan-500 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Why Choose Our RAG System?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover the powerful features that make our RAG assistant the perfect solution for your needs
          </p>
        </div>

        {/* Features grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-black border border-gray-800 rounded-xl p-8 hover:border-purple-500 transition-all duration-300">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold mb-4 text-purple-400">Lightning Fast</h3>
              <p className="text-gray-300 leading-relaxed">
                Get instant responses with our optimized retrieval system. Advanced indexing ensures sub-second query processing.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-black border border-gray-800 rounded-xl p-8 hover:border-cyan-500 transition-all duration-300">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">Precise Accuracy</h3>
              <p className="text-gray-300 leading-relaxed">
                State-of-the-art embedding models ensure highly relevant and contextually accurate responses every time.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-black border border-gray-800 rounded-xl p-8 hover:border-pink-500 transition-all duration-300">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-2xl font-bold mb-4 text-pink-400">Smart Learning</h3>
              <p className="text-gray-300 leading-relaxed">
                Continuously improves with each interaction, learning from your preferences and feedback patterns.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-black border border-gray-800 rounded-xl p-8 hover:border-green-500 transition-all duration-300">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-2xl font-bold mb-4 text-green-400">Multi-Format Support</h3>
              <p className="text-gray-300 leading-relaxed">
                Process PDFs, documents, web pages, and more. Our system handles diverse content types seamlessly.
              </p>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-black border border-gray-800 rounded-xl p-8 hover:border-orange-500 transition-all duration-300">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-4 text-orange-400">Enterprise Security</h3>
              <p className="text-gray-300 leading-relaxed">
                Bank-level encryption and privacy controls. Your data stays secure with advanced access management.
              </p>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-black border border-gray-800 rounded-xl p-8 hover:border-indigo-500 transition-all duration-300">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-4 text-indigo-400">Real-time Updates</h3>
              <p className="text-gray-300 leading-relaxed">
                Dynamic knowledge base that updates in real-time. Always access the most current information available.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
            Powered by Cutting-Edge Technology
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Tech items */}
            {[
              { name: "Next.js", icon: "⚛️" },
              { name: "tRPC", icon: "🔗" },
              { name: "Vector DB", icon: "🗄️" },
              { name: "OpenAI", icon: "🤖" }
            ].map((tech, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative bg-black border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-all duration-300">
                  <div className="text-3xl mb-2">{tech.icon}</div>
                  <h3 className="text-lg font-semibold text-white">{tech.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-cyan-900/30"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of users who have revolutionized their document processing with our RAG assistant.
          </p>
          
          <div className="relative group inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
            <Link href="/chat/new">
              <button className="relative bg-black border-2 border-transparent rounded-full px-16 py-5 text-2xl font-bold text-white hover:scale-105 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/50">
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  Get Started Now
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
