'use client'
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import axios from "axios";

export default function Update(props) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    
    // React.use()를 사용해서 params Promise를 unwrap
    const params = use(props.params);
    const id = params.id;

    async function fetchTopic() {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`http://localhost:3001/topics/${id}`);
            setTitle(response.data.title);
            setBody(response.data.body);
        } catch (err) {
            setError('주제를 불러오는데 실패했습니다.');
            console.error('Error fetching topic:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTopic();
    }, [id]);

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        if (!title.trim() || !body.trim()) {
            setError('제목과 내용을 모두 입력해주세요.');
            return;
        }

        try {
            setSaving(true);
            setError(null);
            
            const response = await axios.patch(`http://localhost:3001/topics/${id}`, {
                title: title.trim(),
                body: body.trim()
            });

            setShowSuccess(true);
            setTimeout(() => {
                router.push(`/read/${response.data.id}`);
                router.refresh();
            }, 1500);

        } catch (err) {
            setError('주제 수정에 실패했습니다.');
            console.error('Error updating topic:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4 max-w-2xl fade-in">
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
        <div className="container mx-auto p-4 max-w-2xl fade-in">
            {/* 성공 토스트 알림 */}
            {showSuccess && (
                <div className="toast alert-success">
                    <div className="flex items-center">
                        <span className="text-xl mr-2">✅</span>
                        <span>주제가 성공적으로 수정되었습니다!</span>
                    </div>
                </div>
            )}

            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4 typing-effect">주제 수정</h2>
                <p className="text-lg text-gray-600">기존 주제의 내용을 수정해보세요</p>
            </div>

            <div className="window">
                <div className="window-controls">
                    <div className="window-control red"></div>
                    <div className="window-control yellow"></div>
                    <div className="window-control green"></div>
                </div>
                <div className="pt-8 p-6">
                    <h3 className="text-xl font-semibold mb-6 flex items-center">
                        <span className="text-2xl mr-2">🔄</span>
                        주제 수정 (ID: {id})
                    </h3>

                    {error && (
                        <div className="alert alert-error mb-6 shake">
                            <div className="flex items-center">
                                <span className="text-2xl mr-3">⚠️</span>
                                <div>
                                    <strong>오류 발생!</strong>
                                    <p className="mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                📝 제목
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(evt) => setTitle(evt.target.value)}
                                className="w-full glitter-effect"
                                placeholder="주제 제목을 입력하세요"
                                required
                                disabled={saving}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                📄 내용
                            </label>
                            <textarea
                                value={body}
                                onChange={(evt) => setBody(evt.target.value)}
                                className="w-full glitter-effect"
                                rows="6"
                                placeholder="주제 내용을 입력하세요"
                                required
                                disabled={saving}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                제목: {title.length}/50 글자 • 내용: {body.length}/500 글자
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="bg-gradient-to-r from-gray-400 to-gray-600 text-white px-6 py-3 rounded-lg hover:from-gray-500 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                                    disabled={saving}
                                >
                                    <span className="flex items-center">
                                        <span className="mr-2">↩️</span>
                                        취소
                                    </span>
                                </button>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 glitter-effect"
                                    disabled={saving || !title.trim() || !body.trim()}
                                >
                                    {saving ? (
                                        <span className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            수정 중...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <span className="mr-2">💾</span>
                                            수정 완료
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
                <h4 className="font-bold mb-3 text-green-800 flex items-center text-lg">
                    <span className="text-2xl mr-2">💡</span>
                    수정 팁
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white bg-opacity-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-green-700 mb-2 flex items-center">
                            <span className="mr-2">✏️</span>
                            제목 작성
                        </h5>
                        <p className="text-sm text-gray-600">명확하고 간결한 제목을 작성하세요</p>
                    </div>
                    <div className="bg-white bg-opacity-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-green-700 mb-2 flex items-center">
                            <span className="mr-2">📝</span>
                            내용 작성
                        </h5>
                        <p className="text-sm text-gray-600">자세하고 유용한 정보를 포함하세요</p>
                    </div>
                </div>
            </div>
        </div>
    );
}