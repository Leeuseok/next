'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useReduxTopics } from "../../hooks/useReduxTopics";
import { useReduxDateTime } from "../../hooks/useReduxDateTime";
import { getCurrentKoreanTime, formatDateTime } from "../../lib/moment-utils";

export default function Create() {
    const router = useRouter();
    const { addTopic, saving, error } = useReduxTopics();
    const { formattedCurrentTime } = useReduxDateTime();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        if (!title.trim() || !body.trim()) return;
        
        try {
            const result = await addTopic({
                title: title.trim(), 
                body: body.trim()
            }).unwrap();
            
            console.log('Created topic:', result);
            
            setShowSuccess(true);
            setTimeout(() => {
                router.push(`/read/${result.id}`);
                router.refresh();
            }, 1500);
            
        } catch (error) {
            console.error('Error creating topic:', error);
            // 에러는 Redux에서 관리됨
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Success Toast */}
                {showSuccess && (
                    <div className="toast alert-success">
                        <div className="flex items-center">
                            <span className="text-xl mr-2">🎉</span>
                            <span>주제가 성공적으로 생성되었습니다!</span>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <Link 
                        href="/" 
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
                    >
                        ← 홈으로 돌아가기
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        새 주제 만들기
                    </h1>
                    <p className="text-gray-600">
                        현재 시간: <span className="font-semibold text-blue-600">{formattedCurrentTime}</span>
                    </p>
                    {error && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}
                </div>

                {/* Form */}
                <div className="window">
                    <div className="window-controls">
                        <div className="window-control red"></div>
                        <div className="window-control yellow"></div>
                        <div className="window-control green"></div>
                    </div>
                    <div className="pt-8 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    📝 제목
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full glitter-effect"
                                    placeholder="주제 제목을 입력하세요"
                                    required
                                    disabled={saving}
                                />
                                <div className="text-right text-sm text-gray-500 mt-1">
                                    {title.length}/100 글자
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    📄 내용
                                </label>
                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    className="w-full glitter-effect"
                                    rows="8"
                                    placeholder="주제 내용을 입력하세요"
                                    required
                                    disabled={saving}
                                />
                                <div className="text-right text-sm text-gray-500 mt-1">
                                    {body.length}/500 글자
                                </div>
                            </div>

                            {/* Preview */}
                            {(title || body) && (
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                        <span className="mr-2">👀</span>
                                        미리보기
                                    </h3>
                                    {title && (
                                        <h4 className="font-bold text-lg text-gray-900 mb-2">
                                            {title}
                                        </h4>
                                    )}
                                    {body && (
                                        <p className="text-gray-600 whitespace-pre-wrap">
                                            {body}
                                        </p>
                                    )}
                                    <div className="text-xs text-gray-400 mt-3 border-t pt-2">
                                        생성 예정 시간: {formatDateTime(new Date())}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4">
                                <Link
                                    href="/"
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg transition-colors"
                                >
                                    취소
                                </Link>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 glitter-effect"
                                    disabled={saving || !title.trim() || !body.trim()}
                                >
                                    {saving ? (
                                        <span className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            생성 중...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <span className="mr-2">🚀</span>
                                            주제 생성
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Tips */}
                <div className="mt-8 p-6 bg-white bg-opacity-70 rounded-xl border border-blue-100">
                    <h4 className="font-bold mb-4 text-blue-800 flex items-center">
                        <span className="text-xl mr-2">💡</span>
                        작성 팁
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            제목은 간결하고 명확하게 작성해주세요
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            내용은 자세하고 구체적으로 설명해주세요
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            미리보기를 통해 최종 결과를 확인하세요
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}