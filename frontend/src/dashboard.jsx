import React, { useState } from 'react';

const names = [
  { name: 'Anna Becker', email: 'anna.becker@porsche-executive.com' },
  { name: 'Liam Chen', email: 'liam.chen@porsche.com' },
  { name: 'Soham Grover', email: 'soham.grover@porsche-engineering.com' },
  { name: 'James Smith', email: 'james.smith@porsche-corporate.com' },
  { name: 'Lucas Wang', email: 'lucas.wang@porsche-janitorial.com' },
  { name: 'Olivia Brown', email: 'olivia.brown@porsche-executive.com' },
  { name: 'Noah Patel', email: 'noah.patel@porsche.com' },
  { name: 'Mia Rossi', email: 'mia.rossi@porsche-engineering.com' },
  { name: 'Ethan Kim', email: 'ethan.kim@porsche-corporate.com' },
  { name: 'Emma Dubois', email: 'emma.dubois@porsche-janitorial.com' },
  { name: 'David Lee', email: 'david.lee@porsche.com' },
  { name: 'Sophia Garcia', email: 'sophia.garcia@porsche-executive.com' },
  { name: 'Benjamin Novak', email: 'benjamin.novak@porsche-engineering.com' },
  { name: 'Chloe Evans', email: 'chloe.evans@porsche-corporate.com' },
  { name: 'Jack Wilson', email: 'jack.wilson@porsche.com' },
  { name: 'Grace Taylor', email: 'grace.taylor@porsche-janitorial.com' },
  { name: 'Leo Fischer', email: 'leo.fischer@porsche-executive.com' },
  { name: 'Ella Martin', email: 'ella.martin@porsche-engineering.com' },
  { name: 'Henry Clark', email: 'henry.clark@porsche-corporate.com' },
  { name: 'Ava Lopez', email: 'ava.lopez@porsche.com' }
];

const spammerNames = [
  { name: 'Viktor Cashman', email: 'viktor.cashman@porsche-corporate.com' },
  { name: 'Lola Winbig', email: 'lola.winbig@porsche-janitorial.com' },
  { name: 'Prince Nduka', email: 'prince.nduka@porsche-executive.com' },
  { name: 'Crypto Mike', email: 'crypto.mike@porsche-engineering.com' },
  { name: 'Slick Rick', email: 'slick.rick@porsche.com' },
  { name: 'Felicity Fortune', email: 'felicity.fortune@porsche-corporate.com' },
  { name: 'Richie Scamz', email: 'richie.scamz@porsche-janitorial.com' },
  { name: 'Mona Lott', email: 'mona.lott@porsche-executive.com' },
  { name: 'Baron Von Cash', email: 'baron.cash@porsche-engineering.com' },
  { name: 'Goldie Quick', email: 'goldie.quick@porsche.com' }
];

const subjects = {
  Inbox: [
    'Project Update: Q2 Milestones',
    'Team Meeting Tomorrow',
    'Client Feedback Received',
    'Lunch & Learn Invitation',
    'Reminder: Submit Timesheet',
    'Welcome to Porsche AU!',
    'Security Training Required',
    'Office WiFi Maintenance',
    'New Company Policies',
    'Happy Birthday!'
  ],
  Sent: [
    'Re: Project Update',
    'Follow-up: Meeting Notes',
    'Fwd: Client Feedback',
    'Thank You!',
    'Leave Application',
    'Request for Documents',
    'Weekly Report',
    'Invoice Submission',
    'Schedule Confirmation',
    'Quick Question'
  ],
  Drafts: [
    'Draft: Budget Proposal',
    'Draft: Event Planning',
    'Draft: New Hire Onboarding',
    'Draft: Product Launch',
    'Draft: IT Support Request',
    'Draft: Marketing Strategy',
    'Draft: Internal Memo',
    'Draft: Customer Survey',
    'Draft: Meeting Agenda',
    'Draft: Policy Update'
  ],
  Spam: [
    'Congratulations! You Won',
    'Urgent: Update Your Account',
    'Limited Time Offer',
    'Claim Your Gift Card',
    'Action Required: Suspicious Login',
    'Get Rich Quick!',
    'Free Vacation Awaits',
    'Exclusive Deal Inside',
    'You Have a New Message',
    'Final Notice'
  ]
};

const snippets = {
  Inbox: [
    'Please see the attached document for the latest project milestones.',
    'Don’t forget our team meeting at 10am in Conference Room B.',
    'The client has provided feedback on the recent proposal.',
    'Join us for a Lunch & Learn session this Friday.',
    'Friendly reminder to submit your timesheet by EOD.',
    'We are excited to welcome you to the Porsche Australia team!',
    'All employees must complete the security training by April 30.',
    'WiFi maintenance is scheduled for this weekend.',
    'Please review the updated company policies attached.',
    'Wishing you a fantastic birthday from all of us!'
  ],
  Sent: [
    'Thank you for the update. Please see my comments below.',
    'Here are the notes from today’s meeting.',
    'Forwarding the client’s feedback for your review.',
    'Thank you for your support on this project.',
    'I would like to apply for leave next week.',
    'Please find the requested documents attached.',
    'Attached is the weekly report for your review.',
    'Invoice for last month’s services is attached.',
    'Confirming our meeting for Thursday at 2pm.',
    'Quick question regarding the new process.'
  ],
  Drafts: [
    'Initial draft of the budget proposal for your review.',
    'Planning details for the upcoming event.',
    'Checklist for onboarding the new hire.',
    'Outline for the product launch campaign.',
    'Requesting IT support for laptop issues.',
    'Drafting the marketing strategy for Q3.',
    'Internal memo regarding office updates.',
    'Customer survey draft for feedback collection.',
    'Agenda for next week’s meeting.',
    'Draft of the updated policy document.'
  ],
  Spam: [
    'You have been selected for a special prize. Click to claim.',
    'Your account needs urgent attention. Update now.',
    'Don’t miss this exclusive offer. Limited time only!',
    'Claim your $1000 gift card today.',
    'Suspicious login detected. Please verify your account immediately.',
    'Earn money fast with this simple trick!',
    'Pack your bags for a free vacation!',
    'Unlock your exclusive deal inside.',
    'You have a new private message waiting.',
    'This is your final notice. Act now!'
  ]
};

const contents = {
  Inbox: [
    'Hi team,\n\nPlease see the attached document for the latest project milestones. Let me know if you have any questions.\n\nBest,',
    'Reminder: Our team meeting is scheduled for tomorrow at 10am in Conference Room B. Please be on time.\n\nThanks!',
    'The client has provided feedback on the recent proposal. I have attached their comments for your review.\n\nRegards,',
    'You are invited to a Lunch & Learn session this Friday at noon. RSVP if you can make it!\n\nBest,',
    'This is a friendly reminder to submit your timesheet by the end of the day.\n\nThank you!',
    'Welcome to Porsche Australia! We are thrilled to have you on board.\n\nBest wishes,',
    'All employees are required to complete the security training by April 30. Please use the link provided in the portal.\n\nHR Team',
    'Office WiFi maintenance is scheduled for this weekend. Expect brief outages.\n\nIT Department',
    'Please review the updated company policies attached to this email.\n\nBest,',
    'Happy Birthday! Wishing you a fantastic year ahead.\n\nThe Porsche Team'
  ],
  Sent: [
    'Thank you for the update. Please see my comments below and let me know your thoughts.\n\nBest,',
    'Here are the notes from today’s meeting. Let me know if I missed anything.\n\nThanks!',
    'Forwarding the client’s feedback for your review. Please advise on next steps.\n\nRegards,',
    'Thank you for your support on this project. Looking forward to working together again.\n\nBest,',
    'I would like to apply for leave from April 21 to April 25.\n\nThank you.',
    'Please find the requested documents attached. Let me know if you need anything else.\n\nBest,',
    'Attached is the weekly report for your review.\n\nRegards,',
    'Invoice for last month’s services is attached. Please confirm receipt.\n\nThank you.',
    'Confirming our meeting for Thursday at 2pm in your office.\n\nBest,',
    'Quick question regarding the new process: Should we submit reports weekly or monthly?'
  ],
  Drafts: [
    'Initial draft of the budget proposal for your review. Please provide feedback.\n\nThanks!',
    'Planning details for the upcoming event. Still working on the schedule.\n\nBest,',
    'Checklist for onboarding the new hire. Will finalize after HR review.\n\nRegards,',
    'Outline for the product launch campaign. Need input from marketing.\n\nThanks!',
    'Requesting IT support for laptop issues. Will add details before sending.\n\nBest,',
    'Drafting the marketing strategy for Q3. Awaiting data from analytics.\n\nThanks!',
    'Internal memo regarding office updates. Will circulate after approval.\n\nBest,',
    'Customer survey draft for feedback collection. Need to finalize questions.\n\nThanks!',
    'Agenda for next week’s meeting. Will confirm topics with the team.\n\nBest,',
    'Draft of the updated policy document. Pending legal review.\n\nThanks!'
  ],
  Spam: [
    'Congratulations! You have been selected for a special prize. Click the link to claim your reward.\n\nBest wishes!',
    'Your account needs urgent attention. Update your information now to avoid suspension.\n\nSupport Team',
    'Don’t miss this exclusive offer. Limited time only! Click to learn more.',
    'Claim your $1000 gift card today. Offer expires soon.',
    'Suspicious login detected. Please verify your account immediately.',
    'Earn money fast with this simple trick! No experience needed.',
    'Pack your bags for a free vacation! Click to reserve your spot.',
    'Unlock your exclusive deal inside. Don’t miss out!',
    'You have a new private message waiting. Log in to view.',
    'This is your final notice. Act now to avoid losing access.'
  ]
};

const generateMockEmails = () => {
  const folders = ['Inbox', 'Sent', 'Drafts', 'Spam'];
  let emails = [];
  let id = 1;
  folders.forEach((folder) => {
    for (let i = 0; i < 50; i++) {
      let sender, senderEmail;
      if (folder === 'Sent') {
        sender = 'You';
        senderEmail = 'you@porsche.com';
      } else if (folder === 'Spam') {
        const person = spammerNames[i % spammerNames.length];
        sender = person.name;
        senderEmail = person.email;
      } else {
        const person = names[i % names.length];
        sender = person.name;
        senderEmail = person.email;
      }
      const subjArr = subjects[folder];
      const snipArr = snippets[folder];
      const contArr = contents[folder];
      const idx = i % subjArr.length;
      
      // Add domain-specific note based on senderEmail
      let customNote = "";
      if (senderEmail.includes("janitorial")) {
        customNote = "Note: This email pertains to janitorial services and scheduling.";
      } else if (senderEmail.includes("executive")) {
        customNote = "Note: This message contains executive updates.";
      } else if (senderEmail.includes("engineering")) {
        customNote = "Note: This email includes technical details for the engineering team.";
      } else if (senderEmail.includes("corporate")) {
        customNote = "Note: This email relates to corporate announcements.";
      } else {
        customNote = "Note: General corporate communication.";
      }
      
      emails.push({
        id: id++,
        folder: folder,
        sender: sender,
        senderEmail: senderEmail,
        subject: subjArr[idx],
        snippet: snipArr[idx],
        date: `2025-04-${(i % 30) + 1}`,
        content: `${contArr[idx]}\n\n${customNote}\n\n-- ${sender} <${senderEmail}>`
      });
    }
  });
  return emails;
};

const mockEmails = generateMockEmails();

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

// -------------------------------------------------------------------------
// FeaturedCarousel Component: A horizontal carousel showing featured emails.
const FeaturedCarousel = ({ emails, onSelectEmail, selectedEmail }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 3;
  const displayedEmails = emails.slice(currentIndex, currentIndex + itemsToShow);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex + itemsToShow < emails.length;

  return (
    <div className="p-4 border-b bg-white/80 shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg text-fuchsia-700">Featured Emails</h3>
        <div>
          {canGoPrev && (
            <button
              onClick={() => setCurrentIndex(currentIndex - 1)}
              className="mr-2 p-1 bg-fuchsia-200 rounded hover:bg-fuchsia-400 hover:scale-110 transition duration-300 cursor-pointer"
            >
              &#8592;
            </button>
          )}
          {canGoNext && (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="p-1 bg-fuchsia-200 rounded hover:bg-fuchsia-400 hover:scale-110 transition duration-300 cursor-pointer"
            >
              &#8594;
            </button>
          )}
        </div>
      </div>
      <div className="flex space-x-4 overflow-hidden">
        {displayedEmails.map((email) => (
          <div
            key={email.id}
            onClick={() => onSelectEmail(email)}
            className={`p-4 border rounded cursor-pointer hover:bg-fuchsia-50 hover:scale-105 transition flex-1 duration-300 ${
              selectedEmail && selectedEmail.id === email.id ? 'bg-orange-50 outline outline-fuchsia-400' : ''
            }`}
          >
            <div className="font-semibold text-sm text-fuchsia-700">{email.sender}</div>
            <div className="font-medium text-sm">{email.subject}</div>
          </div>
        ))}
      </div>
    </div>
  );
};


const EmailList = ({ emails, onSelectEmail, selectedEmail }) => (
  <div className="overflow-y-auto h-full divide-y divide-fuchsia-100">
    {emails.map((email) => (
      <div
        key={email.id}
        onClick={() => onSelectEmail(email)}
        className={`p-4 cursor-pointer hover:bg-fuchsia-50 hover:scale-105 transition duration-300 ${
          selectedEmail && selectedEmail.id === email.id ? 'bg-orange-50 outline outline-fuchsia-400' : ''
        }`}
      >
        <div className="flex justify-between items-center">
          <span className="font-semibold text-sm text-fuchsia-700">{email.sender}</span>
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
        <div className="text-gray-600 mt-1">
          <span>From: {email.sender}</span> • <span>{email.date}</span>
        </div>
      </div>
      <div className="whitespace-pre-line text-gray-800">{email.content}</div>
      <button
        onClick={onReply}
        className="mt-6 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 animate-gradient text-white py-2 px-4 rounded shadow-lg hover:scale-110 hover:shadow-xl transition duration-300 outline outline-white cursor-pointer"
      >
        Reply
      </button>
    </div>
  );
};

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;
const ComposeModal = ({ isOpen, onClose, onSend, composeTo, setComposeTo, composeSubject, setComposeSubject, composeBody, setComposeBody }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that writes professional emails.' },
            { role: 'user', content: `Write a professional email.\nTo: ${composeTo}\nSubject: ${composeSubject}\nBody: ${aiPrompt}` }
          ],
          max_tokens: 300
        })
      });
      const data = await res.json();
      setComposeBody(data.choices?.[0]?.message?.content || 'Lorem Ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
    } catch (e) {
      setComposeBody('Lorem Ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
    }
    setIsGenerating(false);
    setShowAIPrompt(false);
    setAIPrompt('');
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white/90 w-11/12 md:w-1/2 lg:w-1/3 rounded-lg shadow-2xl outline outline-4 outline-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 animate-gradient animate-fadeIn">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-xl font-semibold text-fuchsia-700">Compose Email</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-fuchsia-700 text-2xl transition duration-200 cursor-pointer">&times;</button>
        </div>
        <div className="px-6 py-4">
          <input
            type="email"
            placeholder="To"
            value={composeTo}
            onChange={e => setComposeTo(e.target.value)}
            className="w-full border border-fuchsia-300 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
          <input
            type="text"
            placeholder="Subject"
            value={composeSubject}
            onChange={e => setComposeSubject(e.target.value)}
            className="w-full border border-fuchsia-300 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
          <div className="flex mb-2 gap-2">
            <button
              type="button"
              onClick={() => setShowAIPrompt(v => !v)}
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
                placeholder="Type your prompt for AI..."
                value={aiPrompt}
                onChange={e => setAIPrompt(e.target.value)}
                className="w-full border border-orange-300 p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isGenerating}
              />
              <button
                type="button"
                onClick={handleGenerateAI}
                className="bg-orange-400 text-white py-1 px-3 rounded shadow hover:scale-105 transition duration-200 outline outline-white cursor-pointer disabled:opacity-60"
                disabled={isGenerating || !aiPrompt.trim()}
              >
                {isGenerating ? 'Generating...' : 'Submit Prompt'}
              </button>
            </div>
          )}
          <textarea
            placeholder="Write your message here..."
            rows="6"
            value={composeBody}
            onChange={e => setComposeBody(e.target.value)}
            className="w-full border border-fuchsia-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          ></textarea>
        </div>
        <div className="flex justify-end items-center border-t px-6 py-4">
          <button
            onClick={onClose}
            className="mr-4 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-fuchsia-200 hover:text-fuchsia-700 transition duration-200 cursor-pointer"
          >
            Cancel
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


const ReplyModal = ({ isOpen, onClose, onSendReply, originalEmail, replyContent, setReplyContent }) => {
  if (!isOpen || !originalEmail) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fadeIn">
      <div className="bg-white/90 w-11/12 md:w-1/2 lg:w-1/3 rounded-lg shadow-2xl outline outline-4 outline-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 animate-fadeIn">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-xl font-semibold text-fuchsia-700">Reply to {originalEmail.sender}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-fuchsia-700 text-2xl transition duration-200 cursor-pointer">&times;</button>
        </div>
        <div className="px-6 py-4">
          <input
            type="email"
            placeholder="To"
            defaultValue={originalEmail.sender}
            className="w-full border border-fuchsia-300 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            readOnly
          />
          <input
            type="text"
            placeholder="Subject"
            defaultValue={`Re: ${originalEmail.subject}`}
            className="w-full border border-fuchsia-300 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            readOnly
          />
          <textarea
            placeholder="Write your reply here..."
            rows="6"
            value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
            className="w-full border border-fuchsia-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
          <div className="text-xs text-gray-500 mt-2 whitespace-pre-line">
            ---- Original Message ----
            {originalEmail.content}
          </div>
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
        <button onClick={onClose} className="self-end text-2xl text-gray-500 hover:text-fuchsia-700 cursor-pointer">✕</button>
        <button className="py-2 px-4 rounded hover:bg-fuchsia-100 text-fuchsia-700 text-lg font-semibold cursor-pointer">Account</button>
        <button className="py-2 px-4 rounded hover:bg-fuchsia-100 text-fuchsia-700 text-lg font-semibold cursor-pointer">Profile</button>
        <button className="py-2 px-4 rounded hover:bg-fuchsia-100 text-fuchsia-700 text-lg font-semibold cursor-pointer">More</button>
      </div>
    </div>
  );
};


const Dashboard = () => {
  const folders = ['Inbox', 'Sent', 'Drafts', 'Spam'];
  const [currentFolder, setCurrentFolder] = useState('Inbox');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sentEmails, setSentEmails] = useState([]); 
  const [allEmails, setAllEmails] = useState([...mockEmails]); 
  const [replyContent, setReplyContent] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');


  const emailsForFolder = allEmails.filter((email) => {
    if (email.folder !== currentFolder) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      email.subject.toLowerCase().includes(term) ||
      email.sender.toLowerCase().includes(term) ||
      email.snippet.toLowerCase().includes(term)
    );
  });

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
  };

  const handleComposeOpen = () => {
    setIsComposeOpen(true);
  };

  const handleComposeClose = () => {
    setIsComposeOpen(false);
  };

  const handleSendEmail = () => {
    // Add composed email to Sent
    const newEmail = {
      id: Date.now(),
      folder: 'Sent',
      sender: 'You',
      senderEmail: 'you@porsche.com',
      subject: composeSubject || '(No Subject)',
      snippet: (composeBody || '').slice(0, 60) || 'No content.',
      date: '2025-04-17',
      content: `${composeBody}\n\nTo: ${composeTo}`
    };
    setSentEmails(prev => [...prev, newEmail]);
    setAllEmails(prev => [...prev, newEmail]);
    setIsComposeOpen(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
  };

  const handleReplyOpen = () => {
    setIsReplyOpen(true);
    setReplyContent('');
  };

  const handleReplyClose = () => {
    setIsReplyOpen(false);
  };

  const handleSendReply = () => {
    if (!selectedEmail) return;
    const replySubject = selectedEmail.subject.startsWith('Re:') ? selectedEmail.subject : `Re: ${selectedEmail.subject}`;
    const replySnippet = replyContent.slice(0, 60) || 'Replied to email.';
    const replyEmail = {
      id: Date.now(),
      folder: 'Sent',
      sender: 'You',
      senderEmail: 'you@porsche.com',
      subject: replySubject,
      snippet: replySnippet,
      date: '2025-04-17',
      content: `${replyContent}\n\n---- Original Message ----\n${selectedEmail.content}`
    };
    setSentEmails(prev => [...prev, replyEmail]);
    setAllEmails(prev => [...prev, replyEmail]);
    setIsReplyOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 animate-gradient">
      {/* Top header bar with gradient background and shadow */}
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
            🔍
          </button>
          <button
            className="hover:bg-fuchsia-500 p-2 rounded-full transition hover:scale-110 cursor-pointer"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </header>
      {/* Hamburger menu modal */}
      <HamburgerMenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      {/* Search bar */}
      {showSearch && (
        <div className="bg-white/80 px-6 py-2 flex items-center shadow">
          <input
            autoFocus
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search emails by subject, sender, or snippet..."
            className="w-full p-2 rounded border border-fuchsia-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-fuchsia-700"
          />
          <button
            className="ml-2 text-fuchsia-700 hover:text-orange-500 font-bold cursor-pointer"
            onClick={() => { setSearchTerm(''); setShowSearch(false); }}
            aria-label="Clear search"
          >
            ✕
          </button>
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
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
        {/* Email list column */}
        <section className={`flex flex-col overflow-hidden bg-white/60 border-r border-white/30 ${showSidebar ? 'w-1/3' : 'w-1/2'}`}>
          <FeaturedCarousel
            emails={emailsForFolder.slice(0, 10)} 
            onSelectEmail={handleSelectEmail}
            selectedEmail={selectedEmail}
          />
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
        composeTo={composeTo}
        setComposeTo={setComposeTo}
        composeSubject={composeSubject}
        setComposeSubject={setComposeSubject}
        composeBody={composeBody}
        setComposeBody={setComposeBody}
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