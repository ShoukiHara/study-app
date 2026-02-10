import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Info, AlertCircle, Search, Star, Send } from 'lucide-react';

// ▼ 完成したRenderのURLを設定しました
const API_URL = "https://study-api-lua1.onrender.com";

const BookDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // 評価用の状態管理
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  if (!state || !state.book) {
    return (
      <div className="p-10 text-center">
        <p>No Data Found.</p>
        <button onClick={() => navigate('/')} className="text-blue-600 underline">Return</button>
      </div>
    );
  }

  const { book, result } = state; // resultの中にhistory_idが入っています

  // 検索ページを新しいタブで開く機能
  const openSearch = (platform) => {
    const query = encodeURIComponent(book.title);
    let url = '';

    if (platform === 'amazon') {
      url = `https://www.amazon.co.jp/s?k=${query}`;
    } else if (platform === 'rakuten') {
      url = `https://books.rakuten.co.jp/search?g=000&sitem=${query}`;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 評価送信機能
  const sendFeedback = async () => {
    if (rating === 0) return alert("星の数を選んでください");

    try {
      const fullComment = `【本: ${book.title}】 ${comment}`;

      // ★ここも新しいURL (...lua1...) に修正しました！
      await fetch('https://study-api-lua1.onrender.com/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history_id: result.history_id,
          rating: rating,
          comment: fullComment
        }),
      });
      setFeedbackSent(true);
      alert("評価を送信しました！AIが次回からこの傾向を学習します。");
    } catch (error) {
      console.error(error);
      alert("送信失敗");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          検索結果に戻る
        </button>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-8">
          {/* ヘッダーエリア */}
          <div className="bg-slate-800 p-6 text-white">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-white/10 p-4 rounded flex-shrink-0 mx-auto md:mx-0">
                <Book className="w-16 h-16 text-slate-300" />
              </div>
              <div className="flex-1">
                <div className="flex gap-2 mb-2">
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded font-mono">RECOMMENDED</span>
                </div>
                <h1 className="text-xl md:text-2xl font-bold mb-2">{book.title}</h1>
                <div className="bg-slate-700/50 p-3 rounded text-sm text-slate-300 border-l-2 border-blue-500">
                  <span className="font-bold text-slate-200 block mb-1 text-xs uppercase">適合理由 (Reasoning):</span>
                  {book.reason}
                </div>
              </div>
            </div>
          </div>

          {/* スペック詳細エリア */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <section>
                <h2 className="text-sm font-bold text-slate-500 uppercase mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Info className="w-4 h-4" />
                  書籍概要・特徴
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  データベース上の詳細情報は現在取得中です。本書は入力されたパラメータ（学年・偏差値・学習時間）に対し、最も学習効率が高いと予測された教材の一つです。
                </p>
              </section>

              <section>
                <h2 className="text-sm font-bold text-slate-500 uppercase mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <AlertCircle className="w-4 h-4" />
                  活用上の注意点
                </h2>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-2 bg-slate-50 p-4 rounded border border-slate-100">
                  <li>指定された学習時間を遵守し、継続的な取り組みが推奨されます。</li>
                  <li>解答解説の読み込みに重点を置くことで、理解度が向上します。</li>
                </ul>
              </section>
            </div>

            {/* サイドバー */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-slate-50 p-4 rounded border border-slate-200">
                <h3 className="font-bold text-slate-700 text-sm mb-4 uppercase">External Links</h3>
                <button
                  onClick={() => openSearch('amazon')}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold py-2 rounded mb-2 transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-3 h-3" /> Amazon
                </button>
                <button
                  onClick={() => openSearch('rakuten')}
                  className="w-full bg-white border border-slate-300 text-slate-700 text-sm font-bold py-2 rounded hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-3 h-3" /> Rakuten
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 評価エリア */}
        <div className="bg-slate-800 text-white rounded-lg p-6 text-center shadow-lg">
          <h3 className="font-bold mb-4 flex items-center justify-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            この提案への評価
          </h3>

          {!feedbackSent ? (
            <div className="space-y-4 max-w-lg mx-auto">
              <p className="text-sm text-slate-300">
                この参考書（{book.title}）は、あなたの要望に合っていましたか？
              </p>

              {/* 星評価 */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${rating >= star ? 'bg-yellow-500 text-white scale-110' : 'bg-slate-700 text-slate-500 hover:bg-slate-600'
                      }`}
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </button>
                ))}
              </div>

              {/* コメント入力 */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="コメント（任意）"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-1 bg-slate-700 border border-slate-600 rounded p-3 text-sm text-white focus:ring-1 focus:ring-yellow-500 outline-none"
                />

                <button
                  onClick={sendFeedback}
                  className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold px-6 rounded transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  送信
                </button>
              </div>
            </div>
          ) : (
            <div className="py-2 text-yellow-400 font-bold flex items-center justify-center gap-2">
              <Star className="w-5 h-5 fill-current" />
              評価を受け付けました
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BookDetail;
