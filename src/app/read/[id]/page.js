import Link from "next/link";
import { formatKoreanDate, formatRelativeTime, formatDateTime, getCurrentKoreanTime } from "../../../lib/moment-utils";

export default async function Read({ params }) {
    // params를 직접 await
    const { id } = await params;
    
    let topic = null;
    let error = null;
    
    try {
        const resp = await fetch(`http://localhost:3001/topics/${id}`, { cache: 'no-cache' });
        if (!resp.ok) {
            throw new Error(`HTTP error! status: ${resp.status}`);
        }
        topic = await resp.json();
    } catch (err) {
        error = err.message;
        console.error('Error fetching topic:', err);
    }
    
    if (error) {
        return (
            <div className="container mx-auto p-4 max-w-3xl fade-in">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold mb-4 text-red-600">오류 발생</h2>
                    <p className="text-lg text-gray-600">주제를 불러올 수 없습니다</p>
                </div>

                <div className="window">
                    <div className="window-controls">
                        <div className="window-control red"></div>
                        <div className="window-control yellow"></div>
                        <div className="window-control green"></div>
                    </div>
                    <div className="pt-8 p-6">
                        <div className="alert alert-error mb-6">
                            <div className="flex items-center">
                                <span className="text-2xl mr-3">⚠️</span>
                                <div>
                                    <strong>주제를 찾을 수 없습니다</strong>
                                    <p className="mt-1">ID: {id}</p>
                                    <p className="mt-1 text-sm">에러: {error}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-center">
                            <Link 
                                href="/"
                                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 inline-block"
                            >
                                <span className="flex items-center">
                                    <span className="mr-2">🏠</span>
                                    홈으로 돌아가기
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!topic) {
        return (
            <div className="container mx-auto p-4 max-w-3xl fade-in">
                <div className="window">
                    <div className="window-controls">
                        <div className="window-control red"></div>
                        <div className="window-control yellow"></div>
                        <div className="window-control green"></div>
                    </div>
                    <div className="pt-8 p-6">
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                            <p className="text-lg text-gray-600">주제를 불러오는 중...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto p-4 max-w-3xl fade-in">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4 typing-effect bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {topic.title}
                </h2>
                <p className="text-lg text-gray-600">주제 상세 정보</p>
            </div>

            <div className="window">
                <div className="window-controls">
                    <div className="window-control red"></div>
                    <div className="window-control yellow"></div>
                    <div className="window-control green"></div>
                </div>
                <div className="pt-8 p-6">
                    <article className="prose prose-lg max-w-none">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100 mb-6 glitter-effect">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold flex items-center text-blue-800">
                                    <span className="text-2xl mr-2">📖</span>
                                    {topic.title}
                                </h3>
                                <div className="text-right text-xs text-gray-500">
                                    <div>ID: #{topic.id}</div>
                                    {topic.createdAt && (
                                        <div className="mt-1">
                                            생성: {formatRelativeTime(topic.createdAt)}
                                        </div>
                                    )}
                                    {topic.updatedAt && topic.updatedAt !== topic.createdAt && (
                                        <div className="mt-1">
                                            수정: {formatRelativeTime(topic.updatedAt)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                                {topic.body}
                            </div>
                            
                            {/* 날짜/시간 정보 */}
                            {(topic.createdAt || topic.updatedAt) && (
                                <div className="mt-4 pt-4 border-t border-blue-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        {topic.createdAt && (
                                            <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                                                <div className="font-medium text-blue-700 mb-1 flex items-center">
                                                    <span className="mr-1">📅</span>
                                                    생성일
                                                </div>
                                                <div className="text-gray-600">
                                                    {formatKoreanDate(topic.createdAt)}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {formatDateTime(topic.createdAt)}
                                                </div>
                                            </div>
                                        )}
                                        {topic.updatedAt && (
                                            <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                                                <div className="font-medium text-green-700 mb-1 flex items-center">
                                                    <span className="mr-1">✏️</span>
                                                    {topic.updatedAt === topic.createdAt ? '생성일' : '최종 수정일'}
                                                </div>
                                                <div className="text-gray-600">
                                                    {formatKoreanDate(topic.updatedAt)}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {formatDateTime(topic.updatedAt)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </article>

                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="bg-gray-100 px-3 py-1 rounded-full">ID: {topic.id}</span>
                            <span className="bg-green-100 px-3 py-1 rounded-full text-green-700">
                                현재: {getCurrentKoreanTime()}
                            </span>
                        </div>
                        <div className="flex space-x-3">
                            <Link 
                                href="/"
                                className="bg-gradient-to-r from-gray-400 to-gray-600 text-white px-6 py-3 rounded-lg hover:from-gray-500 hover:to-gray-700 transition-all duration-300 transform hover:scale-105"
                            >
                                <span className="flex items-center">
                                    <span className="mr-2">🏠</span>
                                    홈으로
                                </span>
                            </Link>
                            <Link 
                                href={`/update/${id}`}
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 glitter-effect"
                            >
                                <span className="flex items-center">
                                    <span className="mr-2">✏️</span>
                                    수정하기
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                    <h4 className="font-bold mb-3 text-blue-800 flex items-center text-lg">
                        <span className="text-2xl mr-2">💡</span>
                        읽기 팁
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            핵심 내용을 파악하며 읽어보세요
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            궁금한 점이 있다면 수정하여 추가 정보를 입력하세요
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            내용을 메모하며 학습 효과를 높여보세요
                        </li>
                    </ul>
                </div>

                <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
                    <h4 className="font-bold mb-3 text-green-800 flex items-center text-lg">
                        <span className="text-2xl mr-2">🔧</span>
                        빠른 작업
                    </h4>
                    <div className="space-y-3">
                        <Link 
                            href={`/update/${id}`}
                            className="block w-full text-center bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            ✏️ 이 주제 수정하기
                        </Link>
                        <Link 
                            href="/create"
                            className="block w-full text-center bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            ➕ 새 주제 만들기
                        </Link>
                        <Link 
                            href="/axios-examples"
                            className="block w-full text-center bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            ⚡ Axios 예제 보기
                        </Link>
                    </div>
                </div>
            </div>

            {/* 관련 주제 섹션 */}
            <div className="mt-8">
                <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
                    <h4 className="font-bold mb-3 text-purple-800 flex items-center text-lg">
                        <span className="text-2xl mr-2">🔗</span>
                        관련 주제들
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                        더 많은 주제들을 살펴보고 지식을 확장해보세요
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Link 
                            href="/"
                            className="bg-white bg-opacity-50 hover:bg-opacity-80 text-purple-700 px-3 py-1 rounded-full text-sm transition-all duration-200 border border-purple-200"
                        >
                            📚 전체 주제 목록
                        </Link>
                        <Link 
                            href="/create"
                            className="bg-white bg-opacity-50 hover:bg-opacity-80 text-purple-700 px-3 py-1 rounded-full text-sm transition-all duration-200 border border-purple-200"
                        >
                            ➕ 새 주제 추가
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}