import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { FaPaperclip } from 'react-icons/fa';
const Sidebar = ({ folders, currentFolder, setCurrentFolder, onCompose }) => (
  <div className="bg-white/70 h-full p-4 border-r border-white/30 shadow-lg">
    <div className="flex flex-col h-full">
      <button
        onClick={onCompose}
        className="mb-6 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 animate-gradient text-white py-2 px-4 rounded shadow-lg hover:scale-105 hover:shadow-xl transition duration-300 ease-in-out outline outline-white cursor-pointer"
      >
        Compose
      </button>
      <nav className="flex flex-col space-y-2">
        {folders.map((folder) => (
          <button
            key={folder}
            onClick={() => setCurrentFolder(folder)}
            className={`text-left px-3 py-2 rounded transition duration-300 ease-in-out font-semibold outline outline-1 outline-white/20 cursor-pointer ${
              currentFolder === folder
                ? 'bg-gradient-to-r from-violet-200 via-fuchsia-200 to-orange-200 text-fuchsia-700 animate-gradient scale-105 shadow'
                : 'hover:bg-fuchsia-100 hover:scale-105 hover:shadow-md'
            }`}
          >
            {folder}
          </button>
        ))}
      </nav>
    </div>
  </div>
);
const EmailList = ({ emails, onSelectEmail, selectedEmail }) => (
  <div className="overflow-y-auto h-full divide-y divide-fuchsia-100">
    {emails.map((email) => (
      <div
        key={email.id}
        onClick={() => onSelectEmail(email)}
        className={`p-4 cursor-pointer hover:bg-fuchsia-50 hover:scale-105 transition duration-300 ${
          selectedEmail && selectedEmail.id === email.id
            ? 'bg-orange-50 outline outline-fuchsia-400'
            : ''
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src={`https://speedmail.onrender.com/profile_pics/${email.sender}.png`}
              alt="Profile"
              className="w-6 h-6 rounded-full border border-fuchsia-400"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="font-semibold text-sm text-fuchsia-700">
              {email.username || email.sender}
            </span>
          </div>
          <span className="text-xs text-gray-500">{email.date}</span>
        </div>
        <div className="mt-1 font-medium text-sm">{email.subject}</div>
        <div className="text-xs text-gray-600 mt-1">{email.snippet}</div>
      </div>
    ))}
  </div>
);

const EmailDetail = ({ email, onReply }) => {
  if (!email) {
    return (
      <div className="p-6 text-gray-500">
        <p>Select an email to view its details.</p>
      </div>
    );
  }
  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold text-fuchsia-700">{email.subject}</h2>
        <div className="text-gray-600 mt-1 text-sm">
          <p><strong>From:</strong> {email.sender}</p>
          <p><strong>To:</strong> {email.receiver}</p>
          <p><strong>Date:</strong> {email.date}</p>
        </div>
      </div>
      <div
        className="text-gray-800"
        dangerouslySetInnerHTML={{ __html: email.content }}
      ></div>
      <button
        onClick={onReply}
        className="mt-6 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 animate-gradient text-white py-2 px-4 rounded shadow-lg hover:scale-110 hover:shadow-xl transition duration-300 outline outline-white cursor-pointer"
      >
        Reply
      </button>
    </div>
  );
};

const ComposeModal = ({
  isOpen,
  onClose,
  onSend,
  editingDraftId,
  composeTo,
  setComposeTo,
  composeSubject,
  setComposeSubject,
  composeBody,
  setComposeBody,
  refreshDrafts,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const handleGenerateAI = async () => {
    let fullAIPrompt = `Generate an email body. Do not use any special characters.`;

    if (composeTo.trim()) {
      fullAIPrompt += ` The recipient is ${composeTo.trim()}.`;
    }
    if (composeSubject.trim()) {
      fullAIPrompt += ` The subject is "${composeSubject.trim()}".`;
    }

    if (!fullAIPrompt.trim()) return;
    setIsGenerating(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: fullAIPrompt }] }]
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        let text = result.candidates[0].content.parts[0].text;
        text = text.replace(/[^\w\s.,!?'"@#$%^&*()_+={}[\]:;<>/\\|~`-]/g, '');

        setComposeBody(text);
      } else {
        setComposeBody('Sorry, we could not generate the content. Please try again.');
      }
    } catch (error) {
      console.error('Gemini API call failed:', error);
      setComposeBody('Error generating content. Please check your connection or API key.');
    } finally {
      setIsGenerating(false);
      setShowAIPrompt(false);
      setAIPrompt(''); 
    }
  };

  const handleClose = async () => {
    const hasContent =
      composeTo.trim() || composeSubject.trim() || composeBody.trim();
    if (hasContent) {
      const token = localStorage.getItem('token');
      const data = {
        receiver: composeTo,
        subject: composeSubject,
        content: composeBody,
      };
      try {
        if (editingDraftId) {
          await axios.put(
            `https://speedmail.onrender.com/drafts/${editingDraftId}`,
            data,
            { headers: { Authorization: 'Bearer ' + token } },
          );
        } else {
          await axios.post('https://speedmail.onrender.com/drafts', data, {
            headers: { Authorization: 'Bearer ' + token },
          });
        }
        refreshDrafts();
      } catch (err) {
        console.error('Failed to save draft:', err);
      }
    }
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white/90 w-11/12 md:w-1/2 lg:w-1/3 rounded-lg shadow-2xl outline outline-4 outline-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 animate-gradient">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-xl font-semibold text-fuchsia-700">
            Compose Email
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-fuchsia-700 text-2xl transition duration-200 cursor-pointer"
          >
            &times;
          </button>
        </div>
        <div className="px-6 py-4">
          <input
            type="email"
            placeholder="To"
            value={composeTo}
            onChange={(e) => setComposeTo(e.target.value)}
            className="w-full border border-fuchsia-300 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
          <input
            type="text"
            placeholder="Subject"
            value={composeSubject}
            onChange={(e) => setComposeSubject(e.target.value)}
            className="w-full border border-fuchsia-300 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />

          <div className="flex mb-2 gap-2">
            <button
              type="button"
              onClick={() => setShowAIPrompt((v) => !v)}
              className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-400 text-white py-1 px-3 rounded shadow hover:scale-105 transition duration-200 outline outline-white cursor-pointer disabled:opacity-60"
              disabled={isGenerating}
            >
              {showAIPrompt ? 'Cancel AI' : 'Generate with AI'}
            </button>
          </div>

          {showAIPrompt && (
            <div className="mb-2">
              <input
                type="text"
                placeholder="Type your prompt for AI…"
                value={aiPrompt}
                onChange={(e) => setAIPrompt(e.target.value)}
                className="w-full border border-orange-300 p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isGenerating}
              />
              <button
                type="button"
                onClick={handleGenerateAI}
                className="bg-orange-400 text-white py-1 px-3 rounded shadow hover:scale-105 transition duration-200 outline outline-white cursor-pointer disabled:opacity-60"
                disabled={isGenerating || !aiPrompt.trim()}
              >
                {isGenerating ? 'Generating…' : 'Submit Prompt'}
              </button>
            </div>
          )}

          <div className="relative mb-4">
            <textarea
              placeholder="Write your message here…"
              rows="6"
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              className="w-full border border-fuchsia-300 p-2 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
            <div className="absolute top-3 right-3 group">
              <FaPaperclip
                className="text-black text-xl opacity-80 cursor-pointer"
                title="Upload file"
              />
              <span
                className="absolute left-1/2 -top-8 -translate-x-1/2 px-3 py-1 rounded bg-black/90 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow"
              >
                Upload file
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center border-t px-6 py-4">
          <button
            onClick={handleClose}
            className="mr-4 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-fuchsia-200 hover:text-fuchsia-700 transition duration-200 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={onSend}
            className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 text-white py-2 px-4 rounded hover:scale-110 hover:shadow-xl transition duration-300 outline outline-white cursor-pointer"
            disabled={!composeTo.trim() || !composeBody.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
const ReplyModal = ({
  isOpen,
  onClose,
  onSendReply,
  originalEmail,
  replyContent,
  setReplyContent,
}) => {
  if (!isOpen || !originalEmail) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fadeIn">
      <div className="bg-white/90 w-11/12 md:w-1/2 lg:w-1/3 rounded-lg shadow-2xl outline outline-4 outline-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 animate-fadeIn">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-xl font-semibold text-fuchsia-700">
            Reply to {originalEmail.sender}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-fuchsia-700 text-2xl transition duration-200 cursor-pointer"
          >
            &times;
          </button>
        </div>
        <div className="px-6 py-4">
          <input
            type="email"
            defaultValue={originalEmail.sender}
            className="w-full border border-fuchsia-300 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            readOnly
          />
          <input
            type="text"
            defaultValue={`Re: ${originalEmail.subject}`}
            className="w-full border border-fuchsia-300 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            readOnly
          />
          <div className="mb-4">
            <div className="border-t border-fuchsia-300 my-4"></div>
            <div className="text-xs text-gray-500 whitespace-pre-line">
              {originalEmail.content}
            </div>
          </div>
          <textarea
            placeholder="Write your reply here…"
            rows="6"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full border border-fuchsia-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
        </div>
        <div className="flex justify-end items-center border-t px-6 py-4">
          <button
            onClick={onClose}
            className="mr-4 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-fuchsia-200 hover:text-fuchsia-700 transition duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onSendReply}
            className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 text-white py-2 px-4 rounded hover:scale-110 hover:shadow-xl transition duration-300 outline outline-white cursor-pointer"
            disabled={!replyContent.trim()}
          >
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
};
const HamburgerMenuModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white/95 rounded-lg shadow-2xl p-8 min-w-[300px] flex flex-col gap-4 animate-fadeIn">
        <button
          onClick={onClose}
          className="self-end text-2xl text-gray-500 hover:text-fuchsia-700 cursor-pointer"
        >
          ✕
        </button>
        <a
          href="/manage-account"
          className="py-2 px-4 rounded hover:bg-fuchsia-100 text-fuchsia-700 text-lg font-semibold cursor-pointer text-center self-center"
        >
          Account
        </a>
        <a
          href="/account"
          className="py-2 px-4 rounded hover:bg-fuchsia-100 text-fuchsia-700 text-lg font-semibold cursor-pointer text-center self-center"
        >
          Profile
        </a>
        <button
          className="py-2 px-4 rounded hover:bg-fuchsia-100 text-fuchsia-700 text-lg font-semibold cursor-pointer"
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/signin';
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};
const Dashboard = () => {
  const folders = ['Inbox', 'Sent', 'Drafts'];
  const [currentFolder, setCurrentFolder] = useState('Inbox');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [emails, setEmails] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [drafts, setDrafts] = useState([]);
  const [editingDraftId, setEditingDraftId] = useState(null);
  const [displayName, setDisplayName] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/signin';
      return;
    }
    axios.get('https://speedmail.onrender.com/account', {
      headers: { Authorization: 'Bearer ' + token }
    })
    .then(res => {
      setUserEmail(res.data.email);
      setDisplayName(res.data.username);
      refreshDrafts();
    })
    .catch(() => {
      window.location.href = '/signin';
    });
  }, []);

  useEffect(() => {
    if (!userEmail) return;
    refreshEmails();
  }, [userEmail]);
  const refreshEmails = () => {
    const token = localStorage.getItem('token');
    axios
      .get(`https://speedmail.onrender.com/emails?user=${encodeURIComponent(userEmail)}`, {
        headers: { Authorization: 'Bearer ' + token },
      })
      .then((res) => {
        if (res.data.success) {
          const emailsWithUsername = res.data.emails.map((email) => {
            const senderUsername =
              email.sender === userEmail
                ? displayName
                : email.sender.split('@')[0];
            return { ...email, username: senderUsername };
          });
          setEmails(emailsWithUsername);
        }
      })
      .catch(console.error);
  };

  const refreshDrafts = () => {
    const token = localStorage.getItem('token');
    axios
      .get('https://speedmail.onrender.com/drafts', {
        headers: { Authorization: 'Bearer ' + token },
      })
      .then((res) => {
        if (res.data.success) setDrafts(res.data.drafts);
      })
      .catch(console.error);
  };
  const emailsForFolder = (
    currentFolder === 'Drafts' ? drafts : emails
  ).filter((email) => {
    if (currentFolder === 'Inbox' && email.receiver !== userEmail) return false;
    if (currentFolder === 'Sent' && email.sender !== userEmail) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (email.subject && email.subject.toLowerCase().includes(term)) ||
      (email.sender && email.sender.toLowerCase().includes(term)) ||
      (email.content && email.content.toLowerCase().includes(term))
    );
  });
  const handleSelectEmail = (email) => {
    if (currentFolder === 'Drafts') {
      setEditingDraftId(email.id);
      setComposeTo(email.receiver || '');
      setComposeSubject(email.subject || '');
      setComposeBody(email.content || '');
      setIsComposeOpen(true);
    } else {
      setSelectedEmail(email);
    }
  };

  const handleComposeOpen = () => {
    setEditingDraftId(null);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    setIsComposeOpen(true);
  };
  const handleComposeClose = () => setIsComposeOpen(false);

  const handleSendEmail = () => {
    const token = localStorage.getItem('token');
    axios
      .post(
        'https://speedmail.onrender.com/send',
        { receiver: composeTo, subject: composeSubject, content: composeBody },
        { headers: { Authorization: 'Bearer ' + token } },
      )
      .then((res) => {
        if (res.data.success) {
          refreshEmails();
          if (editingDraftId) {
            axios
              .delete(`https://speedmail.onrender.com/drafts/${editingDraftId}`, {
                headers: { Authorization: 'Bearer ' + token },
              })
              .then(refreshDrafts)
              .catch(() => {});
          }
          setIsComposeOpen(false);
          setComposeTo('');
          setComposeSubject('');
          setComposeBody('');
          setEditingDraftId(null);
        }
      })
      .catch(console.error);
  };
  const handleReplyOpen = () => {
    if (!selectedEmail || selectedEmail.sender === userEmail) return;
    setIsReplyOpen(true);
    setReplyContent('');
  };
  const handleReplyClose = () => setIsReplyOpen(false);
  const handleSendReply = () => {
    if (!selectedEmail) return;
    const replySubject = selectedEmail.subject.startsWith('Re:')
      ? selectedEmail.subject
      : `Re: ${selectedEmail.subject}`;
    const replyBody = `${replyContent}\n\n<hr class="border-t border-fuchsia-300 my-4"/>\n\n${selectedEmail.content}`;
    const token = localStorage.getItem('token');
    axios
      .post(
        'https://speedmail.onrender.com/send',
        {
          receiver: selectedEmail.sender,
          subject: replySubject,
          content: replyBody,
        },
        { headers: { Authorization: 'Bearer ' + token } },
      )
      .then((res) => {
        if (res.data.success) {
          refreshEmails();
          setIsReplyOpen(false);
        }
      })
      .catch(console.error);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 animate-gradient">
      <header className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 animate-gradient text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div
          className="text-2xl font-bold text-orange-400 drop-shadow-lg cursor-pointer"
          onClick={() => window.location.href = '/'}
        >
          SpeedMail
        </div>
        <div className="flex space-x-4 items-center">
          <button
            className="hover:bg-fuchsia-500 p-2 rounded-full transition hover:scale-110 cursor-pointer"
            onClick={() => setShowSearch((v) => !v)}
            aria-label="Search"
          >
            <FaSearch className="text-base" />
          </button>
          <button
            className="hover:bg-fuchsia-500 p-2 rounded-full transition hover:scale-110 cursor-pointer"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Menu"
          >
            <span className="text-2xl">☰</span>
          </button>
        </div>
      </header>

      <HamburgerMenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {showSearch && (
        <div className="bg-white/80 px-6 py-2 flex items-center shadow">
          <input
            autoFocus
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search emails…"
            className="w-full p-2 rounded border border-fuchsia-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-fuchsia-700"
          />
          <button
            className="ml-2 text-fuchsia-700 hover:text-orange-500 font-bold cursor-pointer"
            onClick={() => {
              setSearchTerm('');
              setShowSearch(false);
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <aside className="w-64 border-r border-white/30">
            <Sidebar
              folders={folders}
              currentFolder={currentFolder}
              setCurrentFolder={(folder) => {
                setCurrentFolder(folder);
                setSelectedEmail(null);
              }}
              onCompose={handleComposeOpen}
            />
          </aside>
        )}

        <section
          className={`flex flex-col overflow-hidden bg-white/60 border-r border-white/30 ${
            showSidebar ? 'w-1/3' : 'w-1/2'
          }`}
        >
          <EmailList
            emails={emailsForFolder}
            onSelectEmail={handleSelectEmail}
            selectedEmail={selectedEmail}
          />
        </section>

        <section className="flex-1 overflow-y-auto bg-white/80">
          <EmailDetail email={selectedEmail} onReply={handleReplyOpen} />
        </section>
      </div>

      <ComposeModal
        isOpen={isComposeOpen}
        onClose={handleComposeClose}
        onSend={handleSendEmail}
        editingDraftId={editingDraftId}
        composeTo={composeTo}
        setComposeTo={setComposeTo}
        composeSubject={composeSubject}
        setComposeSubject={setComposeSubject}
        composeBody={composeBody}
        setComposeBody={setComposeBody}
        refreshDrafts={refreshDrafts}
      />

      <ReplyModal
        isOpen={isReplyOpen}
        onClose={handleReplyClose}
        onSendReply={handleSendReply}
        originalEmail={selectedEmail}
        replyContent={replyContent}
        setReplyContent={setReplyContent}
      />
    </div>
  );
};

export default Dashboard;