import { Control } from "./Control";
import "./globals.css";
import Link from "next/link";
import { ReduxProvider } from "../components/ReduxProvider";

export const metadata = {
  title: "Modern Web with Axios",
  description: "Beautiful Next.js application with Axios integration",
};

export default async function RootLayout({ children }) {
  let topics = [];
  try {
    const resp = await fetch("http://localhost:3001/topics/", { cache: 'no-cache' });
    topics = await resp.json();
    console.log('page/layout.js: topics', topics);
  } catch (error) {
    console.log('Failed to fetch topics:', error);
  }
  
  return (
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <ReduxProvider>
          <div className="min-h-screen">
            <main className="container mx-auto px-4 py-6">
            {/* 네비게이션 메뉴 */}
            <nav className="mb-6 p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">🧭</span>
                페이지 네비게이션
              </h3>
              <ul className="flex flex-wrap gap-3">
                <li>
                  <Link href="/" className="inline-flex items-center px-6 py-3 bg-white bg-opacity-80 rounded-xl hover:bg-opacity-100 transition-all duration-300 transform hover:scale-105 shadow-sm border border-gray-200 glitter-effect">
                    <span className="mr-2">🏠</span>
                    <span className="font-medium">홈</span>
                  </Link>
                </li>
                <li>
                  <Link href="/axios-examples" className="inline-flex items-center px-6 py-3 bg-white bg-opacity-80 rounded-xl hover:bg-opacity-100 transition-all duration-300 transform hover:scale-105 shadow-sm border border-gray-200 glitter-effect">
                    <span className="mr-2">⚡</span>
                    <span className="font-medium">Axios 예제</span>
                  </Link>
                </li>
                <li>
                  <Link href="/create" className="inline-flex items-center px-6 py-3 bg-white bg-opacity-80 rounded-xl hover:bg-opacity-100 transition-all duration-300 transform hover:scale-105 shadow-sm border border-gray-200 glitter-effect">
                    <span className="mr-2">✏️</span>
                    <span className="font-medium">생성</span>
                  </Link>
                </li>
                <li>
                  <Link href="/update/1" className="inline-flex items-center px-6 py-3 bg-white bg-opacity-80 rounded-xl hover:bg-opacity-100 transition-all duration-300 transform hover:scale-105 shadow-sm border border-gray-200 glitter-effect">
                    <span className="mr-2">🔄</span>
                    <span className="font-medium">수정</span>
                  </Link>
                </li>
              </ul>
            </nav>
            
            {/* 기존 주제 목록 */}
            {topics.length > 0 && (
              <div className="window p-6 mb-6">
                <div className="window-controls">
                  <div className="window-control red"></div>
                  <div className="window-control yellow"></div>
                  <div className="window-control green"></div>
                </div>
                <div className="pt-8">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <span className="text-2xl mr-2">📚</span>
                    Topics (기존 데이터)
                  </h3>
                  <ol className="space-y-2">
                    {topics.map((topic, index) => {
                      return (
                        <li key={topic.id} style={{ animationDelay: `${index * 0.1}s` }}>
                          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white hover:bg-opacity-50 transition-all duration-300">
                            <Link href={`/read/${topic.id}`} className="flex-1 glitter-effect">
                              <span className="font-medium text-gray-800">{topic.title}</span>
                            </Link>
                            <Link 
                              href={`/update/${topic.id}`} 
                              className="ml-3 inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-300 transform hover:scale-105 text-sm"
                            >
                              <span className="mr-1">✏️</span>
                              수정
                            </Link>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            )}
            
            {children}
          </main>

          <footer className="mt-auto py-8 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="container mx-auto px-4">
              <Control />
              <div className="text-center mt-6 text-gray-600 text-sm">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span>Built with</span>
                  <span className="text-blue-600 font-semibold">Next.js</span>
                  <span>&</span>
                  <span className="text-purple-600 font-semibold">Axios</span>
                  <span>•</span>
                  <span>Modern Web Development</span>
                </div>
                <div className="flex items-center justify-center space-x-4 text-xs">
                  <span>🚀 Fast</span>
                  <span>✨ Beautiful</span>
                  <span>📱 Responsive</span>
                  <span>🎨 Modern</span>
                </div>
              </div>
            </div>
          </footer>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
