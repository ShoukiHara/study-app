import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Database, Loader2, BarChart3, ChevronRight } from 'lucide-react';

// ▼ 完成したRenderのURLを設定しました
const API_URL = import.meta.env.VITE_API_URL || "https://study-api-lua1.onrender.com";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialFormData = location.state?.formData || {
    grade: '高校2年生',
    subject: '数学',
    currentLevel: '',
    goal: '',
    weakness: '',
    studyHours: 3
  };

  const initialResult = location.state?.result || null;

  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(initialResult);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (result) {
      navigate('/', { state: { formData, result }, replace: true });
    }
  }, [result, formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // ★ここを新しいURL (...lua1...) に修正しました！
      const response = await fetch('https://study-api-lua1.onrender.com/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      setResult(data);

    } catch (error) {
      alert("システムエラー: サーバーとの通信に失敗しました。");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 結果データの中身を取り出すヘルパー
  const aiData = result ? result.ai_response : null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">
        <div className="border-b border-slate-200 pb-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <Database className="w-6 h-6 text-slate-600" />
              参考書リコメンダー
            </h1>
            <p className="text-slate-500 text-sm mt-1 tracking-wide">
              AI-POWERED LEARNING OPTIMIZER
            </p>
          </div>
        </div>

        {/* 入力フォーム */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">学年</label>
                <select name="grade" value={formData.grade} onChange={handleChange} className="w-full bg-slate-50 border border-slate-300 rounded p-2">
                  <option>中学3年生</option>
                  <option>高校1年生</option>
                  <option>高校2年生</option>
                  <option>高校3年生</option>
                  <option>既卒生</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">教科</label>
                <select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-slate-50 border border-slate-300 rounded p-2">
                  <option>英語</option>
                  <option>数学</option>
                  <option>物理</option>
                  <option>化学</option>
                  <option>日本史</option>
                  <option>世界史</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">現在のレベル</label>
                <input type="text" name="currentLevel" value={formData.currentLevel} onChange={handleChange} className="w-full bg-slate-50 border border-slate-300 rounded p-2" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">目標</label>
                <input type="text" name="goal" value={formData.goal} onChange={handleChange} className="w-full bg-slate-50 border border-slate-300 rounded p-2" required />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">学習時間: {formData.studyHours}h</label>
              <input type="range" name="studyHours" min="0" max="12" step="0.5" value={formData.studyHours} onChange={handleChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">課題</label>
              <textarea name="weakness" value={formData.weakness} onChange={handleChange} className="w-full bg-slate-50 border border-slate-300 rounded p-2" rows="2" required></textarea>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded transition-colors flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              {loading ? "解析中..." : "検索実行"}
            </button>
          </form>
        </div>

        {/* 結果表示エリア */}
        {aiData && (
          <div className="animate-fade-in">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-5 mb-8 text-sm text-slate-700">
              <h2 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                分析結果
              </h2>
              <p className="leading-relaxed whitespace-pre-wrap">{aiData.summary}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-10">
              {aiData.books.map((book, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded p-4 flex flex-col md:flex-row gap-4 items-start">
                  <div className="bg-slate-100 w-full md:w-24 h-24 flex items-center justify-center rounded text-slate-400 flex-shrink-0">
                    <Database className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{book.title}</h3>
                    <p className="text-sm text-slate-600 mb-2">{book.reason}</p>
                    <button
                      onClick={() => navigate('/detail', { state: { book, formData, result } })}
                      className="text-blue-600 text-xs font-bold flex items-center hover:underline"
                    >
                      詳細データ <ChevronRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
