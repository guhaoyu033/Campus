import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, ArrowLeft, MapPin, ShieldCheck, Image, Smile, MoreHorizontal, XCircle } from 'lucide-react';

const EMOJI_GROUPS = [
  {
    name: '常用',
    icon: '⭐',
    emojis: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','😊','😇','🥰','😍','🤩','😘','😗','😚','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🥴','😵','🤯','🤠','🥳','😎','🤓','🧐']
  },
  {
    name: '手势',
    icon: '👋',
    emojis: ['👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👐','🤲','🙌','👏','🙏','✍️','🤝','👍','👎','✊','👊','🤛','🤜','💪','🦾','👂','🦻','👃','👀','👁️','👅','👄','🦷','🦴','🧠','❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💖','💗','💘','💙','💚','💛','🧡','🟠','🟡','🟢','🔵','🟣','🟤','⚫','⚪','🟥','🟧','🟨','🟩','🟦','🟪','🟫','💥','💫','⭐','🌟','✨','💢','💦','💨','🕳️','💣','💬','👁️‍🗨️','🗨️','🗯️','💭','💭']
  },
  {
    name: '物品',
    icon: '🎁',
    emojis: ['🎁','🎈','🎉','🎊','🧧','🎀','🎗️','🎟️','🎫','🎠','🎡','🎢','🎃','🎄','🎆','🎇','🧨','🎋','🎍','🎎','🎏','🎐','🎑','🧵','🧶','👓','🕶️','🥽','👔','👕','👖','🧥','🧥','👗','👘','👙','🩱','🩳','🧦','👟','🥾','🥿','👠','👢','🩰','🧵','🧷','🦺','👒','🎩','🧢','⛑️','👑','💄','💍','📱','💻','⌨️','🖥️','🖨️','🖱️','🖲️','📺','📷','📸','📹','🎥','📽️','🎬','📞','☎️','📠','📟','📲','🧮','🎚️','🎛️','⏱️','⏲️','⏰','🕰️','📡','🔋','🔌','💡','🔦','🕯️','🧯','🛢️','💸','💵','💴','💶','💷','💰','💳','💎','⚖️','🧰','🔧','🔨','⚒️','🛠️','⛏️','🔩','⚙️','🪓','⛓️','🔫','💣','🧨','💊','💉','🩸','🩹','🩺','🪚','🔬','🔭','📡','🔮','🔯','🔰','💠','🧿','🪬','🧧']
  },
  {
    name: '食物',
    icon: '🍎',
    emojis: ['🍎','🍏','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥕','🌽','🌶️','🫑','🥒','🥬','🫒','🧄','🧅','🥔','🍠','🥐','🍞','🥖','🫓','🥨','🥯','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🦴','🌭','🍔','🍟','🍕','🫓','🥪','🥙','🧆','🥚','🍱','🍘','🍙','🍚','🍛','🍜','🍝','🍠','🍢','🍣','🍤','🍙','🍚','🍛','🍜','🍲','🍛','🥣','🥗','🍿','🧂','🥫','🍦','🍧','🍨','🍩','🍪','🎂','🍰','🧁','🥧','🧁','🍮','🍭','🍬','🍫','🍩','🍪','🍦','🍧','🍨','🍩','🍪','🎂','🍰','🧁','🥧','🍮','🍭','🍬','🍫','🍯','🍩','🍪','🍰','🍨','🍧','🍦','🍨','🍩','🍪','🍰','🍮','🍭','🍬','🍫','🍡','🍥','🍣','🍤','🍙','🍚','🍛','🍜','🍝','🍠','🍢','🍣','🍤','🍙']
  },
  {
    name: '动物',
    icon: '🐶',
    emojis: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐔','🐧','🐦','🐤','🐥','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🦟','🦗','🕷️','🕸️','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🦈','🐋','🦭','🐊','🐅','🐆','🦁','🐎','🐄','🐂','🐃','🐏','🐑','🐐','🐪','🐫','🐘','🦏','🦛','🐕','🐖','🐗','🐓','🦃','🦤','🦢','🦩','🕊️','🐇','🐈','🐈‍⬛','🦮','🐕‍🦺','🐩','🐾','🦝','🦨','🦡','🦦','🦥','🐁','🐀','🐭','🐹','🐰','🦔','🐢','🐍','🦎','🐉','🦖','🦕','🐲','🐲','🐌','🐞','🐜','🦟','🦗','🕷️','🕸️','🦂']
  },
  {
    name: '符号',
    icon: '❤️',
    emojis: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💖','💗','💘','💝','💞','💓','💟','♥️','🫶','🤝','🙏','✌️','🤞','🤟','🤘','🫱','🫲','🫳','🫴','🫶','👏','🙌','👐','🤲','🙏','👍','👎','✊','👊','🤛','🤜','💪','✨','⭐','🌟','💥','💫','🔥','💯','🎉','🎊','🎁','🎈','🎂','🍾','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🍴','🥄','🔪','🍽️','🏆','🥇','🥈','🥉','🏅','🎖️','🏵️','🎗️','👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','👇','☝️','👐','🤲','🙌','👏','🙏','✍️','🤝','👍','👎','✊','👊','🤛','🤜','💪','🦾','👂','🦻','👃','👀','👁️','👅','👄','🦷','🦴','🧠','👤','👥','🫂','👪','👨‍👩‍👦','👨‍👩‍👧','👨‍👨‍👦','👩‍👩‍👧','👨‍👩‍👧‍👦','👨‍👨‍👧‍👦','👩‍👩‍👧‍👦','👨‍👩‍👦‍👦','👨‍👩‍👧‍👧','👩‍👩‍👦‍👦','👨‍👨‍👧‍👧','👩‍👨‍👧‍👧']
  }
];

const STICKER_PACKS = [
  {
    name: '校园表情包',
    stickers: ['🎓','📚','✏️','📝','📖','📕','📗','📘','📙','📓','📔','📒','📑','📐','📍','📌','🏫','🏛️','🏢','🏬','🏠','🏡','🏘️','🏚️','🏕️','🏖️','🏝️','🏜️','🏞️','🏟️','🏠','🏡']
  }
];

export default function ChatPanel({ chat, onClose, products = [], onUpdateChat }) {
  const safeChat = chat || { name: '聊天', avatar: '', school: '', messages: [] };
  const [messages, setMessages] = useState((safeChat.messages && Array.isArray(safeChat.messages)) ? safeChat.messages : []);
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(null);
  const [activeEmojiTab, setActiveEmojiTab] = useState(0);
  const [pendingImage, setPendingImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const persistMessages = useCallback((finalMessages) => {
    if (!onUpdateChat) return;
    const lastMsg = finalMessages[finalMessages.length - 1];
    if (!lastMsg) return;
    const preview = lastMsg.type === 'image' ? '🖼️ [图片]' : lastMsg.type === 'sticker' ? lastMsg.sticker : lastMsg.text;
    onUpdateChat(safeChat.id, {
      messages: finalMessages,
      lastMessage: preview,
      time: '刚刚',
      unread: false
    });
  }, [onUpdateChat, safeChat.id]);

  const handleSend = () => {
    if (!inputValue.trim() && !pendingImage) return;

    if (pendingImage) {
      sendImageMessage(pendingImage);
      setPendingImage(null);
      return;
    }

    const newMessage = {
      id: messages.length + 1,
      sender: 'me',
      text: inputValue.trim(),
      time: '刚刚'
    };

    setMessages(prev => {
      const updated = [...prev, newMessage];
      persistMessages(updated);
      return updated;
    });
    setInputValue('');
    setShowEmojiPanel(false);

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
      setMessages(prev => {
        const updated = [...prev, {
          id: prev.length + 1,
          sender: 'other',
          text: randomReply,
          time: '刚刚'
        }];
        persistMessages(updated);
        return updated;
      });
    }, 1000 + Math.random() * 1000);
  };

  const sendImageMessage = (imageData) => {
    const newMessage = {
      id: messages.length + 1,
      sender: 'me',
      type: 'image',
      image: imageData,
      time: '刚刚'
    };
    setMessages(prev => {
      const updated = [...prev, newMessage];
      persistMessages(updated);
      return updated;
    });
    setShowEmojiPanel(false);

    setTimeout(() => {
      const replies = [
        '好的，看到了！',
        '图片收到，谢谢！',
        '好的，没问题',
        '收到！👌'
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setMessages(prev => {
        const updated = [...prev, {
          id: prev.length + 1,
          sender: 'other',
          text: randomReply,
          time: '刚刚'
        }];
        persistMessages(updated);
        return updated;
      });
    }, 1200 + Math.random() * 800);
  };

  const sendSticker = (emoji) => {
    const newMessage = {
      id: messages.length + 1,
      sender: 'me',
      type: 'sticker',
      sticker: emoji,
      time: '刚刚'
    };
    setMessages(prev => {
      const updated = [...prev, newMessage];
      persistMessages(updated);
      return updated;
    });
    setShowEmojiPanel(false);

    setTimeout(() => {
      const replyEmojis = ['👍', '😊', '😄', '👌', '🎉', '🤝'];
      const randomSticker = replyEmojis[Math.floor(Math.random() * replyEmojis.length)];
      setMessages(prev => {
        const updated = [...prev, {
          id: prev.length + 1,
          sender: 'other',
          type: 'sticker',
          sticker: randomSticker,
          time: '刚刚'
        }];
        persistMessages(updated);
        return updated;
      });
    }, 900 + Math.random() * 800);
  };

  const insertEmoji = (emoji) => {
    setInputValue(prev => prev + emoji);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('图片不能超过 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPendingImage(event.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const product = products.find(p => p.id === safeChat.productId);

  const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${safeChat.id || 'default'}`;
  const avatarUrl = safeChat.avatar && safeChat.avatar.trim() ? safeChat.avatar : defaultAvatar;

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
              src={avatarUrl}
              alt={safeChat.name || '用户'}
              className="w-10 h-10 rounded-xl bg-eco-100"
            />
            <div>
              <div className="font-bold text-slate-900 text-sm">{safeChat.name || '匿名用户'}</div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="w-3 h-3" />
                <span>{safeChat.school || '校园'}</span>
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
                  src={avatarUrl}
                  alt={safeChat.name || '用户'}
                  className="w-8 h-8 rounded-lg bg-eco-100 flex-shrink-0"
                />
              )}
              <div className={`max-w-[75%] ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                {msg.type === 'image' && msg.image ? (
                  <div
                    className={`rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ${msg.sender === 'me' ? 'rounded-br-md' : 'rounded-bl-md'}`}
                    onClick={() => setShowImagePreview(msg.image)}
                  >
                    <img src={msg.image} alt="图片消息" className="max-w-[240px] max-h-[240px] object-cover rounded-2xl" />
                  </div>
                ) : msg.type === 'sticker' && msg.sticker ? (
                  <div className={`text-5xl sm:text-6xl rounded-2xl p-2 animate-fade-in`}>
                    {msg.sticker}
                  </div>
                ) : msg.text ? (
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'me'
                      ? 'bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-br-md'
                      : 'bg-slate-100 text-slate-800 rounded-bl-md'
                  }`}>
                    {msg.text}
                  </div>
                ) : null}
                <div className={`text-[10px] text-slate-400 mt-1 ${msg.sender === 'me' ? 'text-right' : ''}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {pendingImage && (
          <div className="px-4 pb-2">
            <div className="relative inline-block">
              <img src={pendingImage} alt="待发送图片" className="max-w-[160px] max-h-[160px] rounded-2xl border-2 border-eco-300 shadow-sm" />
              <button
                onClick={() => setPendingImage(null)}
                className="absolute -top-2 -right-2 w-7 h-7 bg-white border-2 border-white shadow-lg rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="mt-1 text-[10px] text-slate-400">点击发送按钮发送图片</div>
            </div>
          </div>
        )}

        {showEmojiPanel && (
          <div className="border-t border-slate-100 bg-gradient-to-b from-white to-slate-50 animate-slide-up">
            <div className="flex overflow-x-auto border-b border-slate-100 bg-white">
              {EMOJI_GROUPS.map((group, idx) => (
                <button
                  key={group.name}
                  onClick={() => setActiveEmojiTab(idx)}
                  className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                    activeEmojiTab === idx
                      ? 'text-eco-600 border-eco-500 bg-eco-50/50'
                      : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="mr-1">{group.icon}</span>
                  <span className="hidden sm:inline">{group.name}</span>
                </button>
              ))}
            </div>
            <div className="p-3 max-h-[200px] overflow-y-auto">
              <div className="grid grid-cols-8 sm:grid-cols-10 gap-1">
                {EMOJI_GROUPS[activeEmojiTab].emojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    onClick={() => insertEmoji(emoji)}
                    className="text-xl sm:text-2xl p-1.5 sm:p-2 hover:bg-white hover:scale-125 rounded-lg transition-all"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-4 py-2 border-t border-slate-100 bg-white">
              <div className="text-xs font-semibold text-slate-500 mb-2">快捷表情包</div>
              <div className="flex flex-wrap gap-2">
                {['👍','😊','😂','🎉','❤️','🔥','💯','🤝','👌','🙏','🤩','🥳','😎','🤗','😘','😍','🥰','😇','🤔','🤨'].map((emoji, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendSticker(emoji)}
                    className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-3xl bg-slate-50 hover:bg-eco-50 hover:scale-110 rounded-xl transition-all border border-slate-200"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-slate-200 p-4 bg-white">
          <div className="flex items-end gap-2">
            <button
              onClick={() => {
                setShowEmojiPanel(!showEmojiPanel);
                setPendingImage(null);
              }}
              className={`p-2.5 rounded-xl transition-colors ${
                showEmojiPanel
                  ? 'bg-eco-100 text-eco-600'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Smile className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                fileInputRef.current?.click();
                setShowEmojiPanel(false);
              }}
              className={`p-2.5 rounded-xl transition-colors ${
                pendingImage
                  ? 'bg-eco-100 text-eco-600'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Image className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
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
              disabled={!inputValue.trim() && !pendingImage}
              className={`p-3 rounded-xl transition-all ${
                inputValue.trim() || pendingImage
                  ? 'bg-gradient-to-r from-eco-500 to-eco-600 text-white shadow-lg shadow-eco-500/20 hover:shadow-xl'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {showImagePreview && (
        <div
          className="fixed inset-0 z-[60] bg-slate-900/90 flex items-center justify-center animate-fade-in"
          onClick={() => setShowImagePreview(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <button
              onClick={() => setShowImagePreview(null)}
              className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
            >
              <XCircle className="w-8 h-8" />
            </button>
            <img
              src={showImagePreview}
              alt="预览图片"
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
