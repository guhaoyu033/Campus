import { useState, useEffect, useRef } from 'react';
import { X, Send, ArrowLeft, MapPin, ShieldCheck, Image, Smile, MoreHorizontal } from 'lucide-react';

export default function ChatPanel({ chat, onClose, products }) {
  const [messages, setMessages] = useState(chat.messages);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: 'me',
      text: inputValue.trim(),
      time: '刚刚'
    };
    
    setMessages([...messages, newMessage]);
    setInputValue('');

    setTimeout(() => {
      const replies = [
        '好的，我明白了！',
        '可以的，我们约个时间吧',
        '没问题，随时联系',
        '收到！谢谢！',
        '好的，明天见',
        '好的，我考虑一下',
        '可以的，价格很合适',
        '谢谢，我会尽快回复'
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'other',
        text: randomReply,
        time: '刚刚'
      }]);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const product = products.find(p => p.id === chat.productId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[88vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-eco-50 to-white">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-10 h-10 rounded-xl bg-eco-100"
            />
            <div>
              <div className="font-bold text-slate-900 text-sm">{chat.name}</div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="w-3 h-3" />
                <span>{chat.school}</span>
                <span className="mx-1">·</span>
                <ShieldCheck className="w-3 h-3 text-eco-600" />
                <span className="text-eco-600">已认证</span>
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <MoreHorizontal className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {product && (
          <div className="mx-4 mt-3 p-3 bg-gradient-to-r from-eco-50 to-emerald-50 rounded-2xl border border-eco-200/60">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white overflow-hidden flex-shrink-0">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-eco-700 mb-0.5">关联商品</div>
                <div className="text-sm font-medium text-slate-900 truncate">{product.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-eco-600 font-bold">¥{product.price}</span>
                  <span className="text-xs text-slate-400 line-through">¥{product.originalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
              {msg.sender !== 'me' && (
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-8 h-8 rounded-lg bg-eco-100 flex-shrink-0"
                />
              )}
              <div className={`max-w-[75%] ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'me'
                    ? 'bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-br-md'
                    : 'bg-slate-100 text-slate-800 rounded-bl-md'
                }`}>
                  {msg.text}
                </div>
                <div className={`text-[10px] text-slate-400 mt-1 ${msg.sender === 'me' ? 'text-right' : ''}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-slate-200 p-4 bg-white">
          <div className="flex items-end gap-2">
            <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600">
              <Smile className="w-5 h-5" />
            </button>
            <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600">
              <Image className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入消息..."
                rows={1}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:bg-white transition-all"
                style={{ maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={`p-3 rounded-xl transition-all ${
                inputValue.trim()
                  ? 'bg-gradient-to-r from-eco-500 to-eco-600 text-white shadow-lg shadow-eco-500/20 hover:shadow-xl'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
