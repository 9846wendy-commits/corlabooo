import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  User,
  PlusCircle,
  MessageCircle,
  Heart,
  Zap,
  Edit3,
  ArrowLeft,
  Send,
  Sparkles,
  Loader2,
  BookOpen,
  X,
  Image as ImageIcon,
  Lock,
  Users,
  MoreHorizontal,
  ShieldAlert,
  Flag,
  Trash2,
  CheckSquare,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  MessageSquarePlus,
  Store,
  Phone,
  Mic,
  Bell,
} from "lucide-react";

import { auth, db, googleProvider } from "./firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  query,
  orderBy,
  where,
  limit,
} from "firebase/firestore";

// --- 多國語言字典 (i18n) ---
const locales = {
  繁體中文: {
    step2Title: "建立個人檔案",
    step2Desc: "讓大家更認識你 (年齡性別僅互相追蹤後可見)",
    namePlaceholder: "你的名字 (必填)",
    bioPlaceholder: "寫一段簡短的自我介紹吧...",
    nextBtn: "下一步",
    step3Title: "語言與交友設定",
    step3Desc: "為您精準推薦最適合的語伴",
    nativeLabel: "我的母語",
    learningLabel: "我想練習",
    interestLabel: "我的興趣 (可複選)",
    intentLabel: "交友意願",
    startBtn: "馬上出發",
    navFeed: "首頁",
    navProfile: "主頁",
    feedTitle: "動態牆",
    chatTitle: "私訊",
    chatEmpty: "目前還沒有可以私訊的語伴",
    chatEmptyDesc: "趕快去動態牆幫外國朋友改錯，\n獲得互相追蹤來解鎖聊天室吧！",
    tabForYou: "為你推薦",
    tabFollowing: "追蹤中",
    newPostTitle: "新建貼文",
    postTypeNormal: "一般貼文",
    postTypeStory: "限時貼文 (24h)",
    publishBtn: "發布貼文",
    cancelBtn: "取消",
    postPlaceholder: "今天想說點什麼？(一般貼文最少 15 個字)",
    intentPractice: "🎯 幫我改錯 (Practice)",
    intentShare: "🌍 文化/日常分享 (Share)",
    tooShortWarning:
      "多寫一點吧！一般貼文最少需要 15 個字，這樣母語者才能好好幫你改錯喔！",
    langLockComment: "沉浸式語言鎖定：此區留言/建議僅限使用",
    postDetailTitle: "貼文詳情",
    suggestVersion: "母語者建議",
    aiExplainBtn: "AI 深度解析",
    aiSummaryBtn: "🪄 AI 小精靈統整建議",
    commentBtn: "一般留言",
    correctBtn: "給予建議",
    commentSection: "留言區",
    emptyComment: "還沒有人留言，來成為第一個吧！",
    tagGrammar: "✅ 文法修正",
    tagNatural: "🗣️ 這樣說更自然",
    myProfileTitle: "我的主頁",
    profileOf: "的主頁",
    karmaTitle: "您的互助點數",
    boostLatestPost: "置頂最新貼文 (50🧼)",
    noPostToBoost: "您還沒有發布任何貼文喔！",
    boostDesc: "+10 倍曝光",
    helped: "幫助過",
    people: "人",
    mutualFriends: "我的專屬語伴",
    noFriends: "目前還沒有語伴... 去動態牆幫別人改錯吧！",
    postHistory: "發佈過的貼文",
    emptyHistory: "這裡還空空的，快去發佈您的第一篇練習吧！",
    emptyHistoryOther: "對方尚未發布任何貼文。",
    followBtn: "追蹤",
    followingBtn: "已送出追蹤",
    saveBtn: "儲存設定",
    sendMsg: "傳送訊息...",
    storyBadge: "⏳ 限時貼文",
    storyPrivateHint:
      "這是一則限時貼文，其他人看不到您的留言，只有作者能看到喔！",
    reportUser: "檢舉用戶",
    blockUser: "封鎖用戶",
    reportPost: "檢舉貼文",
    reportSuccess: "已收到檢舉並隱藏貼文，我們會盡快處理！",
    reportCommentGrammar: "文法錯誤",
    reportCommentSpam: "檢舉",
    commentReportSuccess: "已隱藏該留言，我們將盡快審查！",
    blockSuccess: "已封鎖該用戶。",
    deleteAccount: "刪除帳號",
    deleteConfirm: "將清除所有資料，確定要刪除嗎？",
    deletePost: "刪除貼文",
    deleteComment: "刪除留言",
    deletePostSuccess: "貼文/留言已刪除",
    deleteAccountSuccess: "您的帳號與所有貼文已從全域刪除",
    correctionSuccessNoPoints: "同一篇文只能獲得一次🧼快去幫助其他人吧！",
    hiddenCommentText: "這則建議已被社群隱藏",
    invalidSuggestWarningRegex:
      "系統偵測到無意義內容、過多重複字元或長度不符 (3-200字)，請重新輸入！",
    langZh: "繁體中文",
    langEn: "英文 (English)",
    prevStory: "上一篇",
    nextStory: "下一篇",
    storyProgress: "限時貼文",
    genderPlaceholder: "性別",
    genders: { M: "男生", F: "女生", O: "其他" },
    agePlaceholder: "年齡",
    ageUnit: "歲",
    intents: [
      { id: "study", label: "📚 我只想學習" },
      { id: "casual", label: "☕️ 佛系交流" },
      { id: "longterm", label: "🌍 尋找長期語伴" },
    ],
    interests: {
      movie: "🎬 電影",
      game: "🎮 遊戲",
      coffee: "☕️ 咖啡",
      travel: "✈️ 旅遊",
      music: "🎵 音樂",
      reading: "📖 閱讀",
      workout: "💪 運動",
      food: "🍜 美食",
    },
    notEnoughKarma: "沒有點數了喔！趕快去幫別人改錯賺取 🧼 吧！",
    boostSuccess: "🚀 貼文已成功置頂，將獲得大量曝光！",
    correctionSuccess: "感謝給予超棒的建議！獲得 10 🧼",
    purchaseSuccess: "🎉 購買成功！已為您裝備！",
    followMutualSuccess:
      "🎉 追蹤成功！你們現在互相追蹤，已解鎖私訊與年齡性別資訊！",
    followSuccess: "✅ 已發送追蹤請求！對方回追後即可解鎖私訊。",
    dmLocked: "🔒 私訊鎖定中！必須互相追蹤才能開啟。",
    chatUnlockedHint: "你們已互相追蹤，年齡與性別已解鎖 🔓",
    chatUnlocked: "聊天室已解鎖！",
    feedEmpty: "這裡還空空的，快去發掘新朋友！",
    suggestTypeLabel: "請選擇您的建議類型 (可複選)：",
    suggestPlaceholder: (lang) => `請以「${lang}」輸入您的建議...`,
    commentPlaceholder: (lang) => `請以「${lang}」說點什麼...`,
    aiValidating: "AI 驗證中...",
    submitSuggestBtn: "送出建議 (+10🧼)",
    submitSuggestBtnNoPoints: "送出建議",
    invalidSuggestWarning: "這似乎不是一個有效的語言修改建議喔！",
    invalidSuggestSub: "請提供正確的建議，才能獲得點數🧼",
    gotItBtn: "我知道了",
    sendBtn: "送出",
    justNow: "剛剛",
    langLockedHint: (lang) => `⚠️ 語言鎖定：此篇貼文限制僅能輸入 ${lang}。`,
    mockBio: "這個人很神秘，什麼都沒寫...",
    mutualUnlockHint: "互相追蹤後解鎖年齡性別",
    noticeTitle: "系統提示",
    oopsTitle: "哎呀！",
    successTitle: "太棒了！",
    feedbackBtn: "給開發者回饋",
    feedbackTitle: "嗨！我是開發者 👋",
    feedbackDesc:
      "這是早期的測試版本，有任何 Bug、覺得難用的地方，或希望增加什麼功能，都請直接告訴我！",
    feedbackPlaceholder: "暢所欲言吧...",
    feedbackSubmit: "傳送給開發者",
    feedbackSuccess: "收到你的回饋了！非常感謝你的幫助 ❤️",
    shopTitle: "泡泡商城 🛍️",
    shopColors: "稀有色彩",
    shopAccessories: "專屬配件",
    equipBtn: "裝備",
    buyBtn: "購買",
    equippedBtn: "已裝備",
    comingSoon: "功能即將推出！",
    featureComingSoon: "此功能正在開發中，敬請期待！",
    publishSuccess: "貼文已成功發布",
    publishFailed: "發布失敗，請確認網路連線",
    notifications: "通知中心",
    noNotifications: "目前沒有新通知喔",
    followedYou: "追蹤了你",
    followBack: "回追",
    nonNativeWarning: "這並非您的母語，建議由母語者來糾錯喔！",
    practiceLangWarning: "練習貼文請使用您正在學習的語言喔！",
    commentedYourPost: "留言了你的貼文",
    correctedYourPost: "為你的貼文提供了建議",
    sentImage: "傳送了圖片",
    you: "你: ",
  },
  English: {
    step2Title: "Set Up Profile",
    step2Desc: "Let others know you (Age/Gender unlocked after mutual follow)",
    namePlaceholder: "Your Name (Required)",
    bioPlaceholder: "Write a short bio about yourself...",
    nextBtn: "Next",
    step3Title: "Language & Preferences",
    step3Desc: "Find your best language partners",
    nativeLabel: "My Native Language",
    learningLabel: "I want to practice",
    interestLabel: "My Interests",
    intentLabel: "Social Intent",
    startBtn: "Let's Go!",
    navFeed: "Feed",
    navProfile: "Profile",
    feedTitle: "Feed",
    chatTitle: "Messages",
    chatEmpty: "No message partners yet",
    chatEmptyDesc:
      "Help others correct their posts\nto get mutual follows and unlock DMs!",
    tabForYou: "For You",
    tabFollowing: "Following",
    newPostTitle: "New Post",
    postTypeNormal: "Regular Post",
    postTypeStory: "Expiring Post (24h)",
    publishBtn: "Publish Post",
    cancelBtn: "Cancel",
    postPlaceholder: "What do you want to practice today? (Min. 15 chars)",
    intentPractice: "🎯 Practice",
    intentShare: "🌍 Share",
    tooShortWarning:
      "Write a bit more! Regular posts require at least 15 characters so others can help you correct it.",
    langLockComment: "Immersion Locked: Comments/Suggestions must be in",
    postDetailTitle: "Post Details",
    suggestVersion: "Native Suggestion",
    aiExplainBtn: "AI Explanation",
    aiSummaryBtn: "🪄 AI Summary & Best Answer",
    commentBtn: "Comment",
    correctBtn: "Suggest",
    commentSection: "Comments",
    emptyComment: "No comments yet. Be the first!",
    tagGrammar: "✅ Grammar",
    tagNatural: "🗣️ More Natural",
    myProfileTitle: "My Profile",
    profileOf: "'s Profile",
    karmaTitle: "Your Karma Points",
    boostLatestPost: "Boost Latest Post (50🧼)",
    noPostToBoost: "You haven't published any posts yet!",
    boostDesc: "+10x Views",
    helped: "Helped",
    people: "people",
    mutualFriends: "My Partners",
    noFriends: "No partners yet... Go help someone!",
    postHistory: "Post History",
    emptyHistory: "Nothing here yet. Go publish your first post!",
    emptyHistoryOther: "This user hasn't posted anything yet.",
    followBtn: "Follow",
    followingBtn: "Following",
    saveBtn: "Save Settings",
    sendMsg: "Send message...",
    storyBadge: "⏳ Expiring Post",
    storyPrivateHint:
      "This is an expiring post. Your comments are private and only visible to the author.",
    reportUser: "Report User",
    blockUser: "Block User",
    reportPost: "Report Post",
    reportSuccess: "Report received. Post hidden from your feed.",
    reportCommentGrammar: "Grammar Error",
    reportCommentSpam: "Report",
    commentReportSuccess: "Comment hidden and reported!",
    blockSuccess: "User has been blocked.",
    deleteAccount: "Delete Account",
    deleteConfirm: "All data will be erased. Are you sure?",
    deletePost: "Delete Post",
    deleteComment: "Delete Comment",
    deletePostSuccess: "Post/Comment deleted",
    deleteAccountSuccess:
      "Your account and all posts have been permanently deleted.",
    correctionSuccessNoPoints:
      "You can only earn 🧼 once per post. Go help others!",
    hiddenCommentText: "This suggestion has been hidden by the community.",
    invalidSuggestWarningRegex:
      "Spam detected! Avoid gibberish and keep length between 3-200 chars.",
    langZh: "Traditional Chinese",
    langEn: "English",
    prevStory: "Prev",
    nextStory: "Next",
    storyProgress: "Expiring Post",
    genderPlaceholder: "Gender",
    genders: { M: "Male", F: "Female", O: "Other" },
    agePlaceholder: "Age",
    ageUnit: "y/o",
    intents: [
      { id: "study", label: "📚 I just want to learn" },
      { id: "casual", label: "☕️ Casual Chat" },
      { id: "longterm", label: "🌍 Seeking Long-term Partner" },
    ],
    interests: {
      movie: "🎬 Movies",
      game: "🎮 Gaming",
      coffee: "☕️ Coffee",
      travel: "✈️ Travel",
      music: "🎵 Music",
      reading: "📖 Reading",
      workout: "💪 Workout",
      food: "🍜 Food",
    },
    notEnoughKarma: "Not enough Karma! Help correct others' posts to earn 🧼",
    boostSuccess: "🚀 Post successfully boosted for max visibility!",
    correctionSuccess: "Thanks for the awesome suggestion! You earned 10 🧼",
    purchaseSuccess: "🎉 Purchase successful! Item equipped.",
    followMutualSuccess:
      "🎉 Followed! You are now mutuals. DMs, age, and gender are unlocked!",
    followSuccess: "✅ Follow request sent! Await their follow back to DM.",
    dmLocked: "🔒 DMs locked! Mutual follow is required.",
    chatUnlockedHint: "You are mutuals. Age and gender are unlocked 🔓",
    chatUnlocked: "Chat unlocked!",
    feedEmpty: "It's empty here. Go find some new friends!",
    suggestTypeLabel: "Select suggestion types (multiple allowed):",
    suggestPlaceholder: (lang) => `Enter your suggestion in ${lang}...`,
    commentPlaceholder: (lang) => `Say something in ${lang}...`,
    aiValidating: "AI Validating...",
    submitSuggestBtn: "Submit Suggestion (+10🧼)",
    submitSuggestBtnNoPoints: "Submit Suggestion",
    invalidSuggestWarning:
      "This doesn't seem like a valid language suggestion!",
    invalidSuggestSub: "Please provide helpful suggestions to earn points🧼",
    gotItBtn: "Got it",
    sendBtn: "Send",
    justNow: "Just now",
    langLockedHint: (lang) => `⚠️ Language Locked: Please use ${lang} only.`,
    mockBio: "This user is very mysterious...",
    mutualUnlockHint: "Age & Gender locked",
    noticeTitle: "Notice",
    oopsTitle: "Oops!",
    successTitle: "Awesome!",
    feedbackBtn: "Feedback",
    feedbackTitle: "Hi! I am the Dev 👋",
    feedbackDesc:
      "This is an early MVP. If you find any bugs, confusing UI, or have feature requests, please let me know!",
    feedbackPlaceholder: "Tell me anything...",
    feedbackSubmit: "Send to Developer",
    feedbackSuccess: "Feedback received! Thank you so much ❤️",
    shopTitle: "Bubble Shop 🛍️",
    shopColors: "Rare Colors",
    shopAccessories: "Accessories",
    equipBtn: "Equip",
    buyBtn: "Buy",
    equippedBtn: "Equipped",
    comingSoon: "Coming Soon!",
    featureComingSoon: "This feature is under development!",
    publishSuccess: "Post published successfully!",
    publishFailed: "Failed to publish. Please check your connection.",
    notifications: "Notifications",
    noNotifications: "No new notifications",
    followedYou: "started following you",
    followBack: "Follow Back",
    nonNativeWarning:
      "This is not your native language. We recommend letting a native speaker correct it!",
    practiceLangWarning:
      "Please use your learning language for practice posts!",
    commentedYourPost: "commented on your post",
    correctedYourPost: "corrected your post",
    sentImage: "Sent an image",
    you: "You: ",
  },
};

const INTERESTS_KEYS = [
  "movie",
  "game",
  "coffee",
  "travel",
  "music",
  "reading",
  "workout",
  "food",
];

const PALETTES = [
  { base: "#D4AEE3", stroke: "#C49CD3", premium: false },
  { base: "#AEE3D4", stroke: "#9CD3C4", premium: false },
  { base: "#E3AECB", stroke: "#D39CBA", premium: false },
  { base: "#E3D4AE", stroke: "#D3C49C", premium: false },
  { base: "#AECBE3", stroke: "#9CBAD3", premium: false },
  { base: "#CBAEE3", stroke: "#BA9CD3", premium: false },
  { base: "#FFB3BA", stroke: "#E59A9D", premium: true },
  { base: "#FFDFBA", stroke: "#E5C7A5", premium: true },
  { base: "#FFFFBA", stroke: "#E5E5A5", premium: true },
  { base: "#BAFFC9", stroke: "#A5E5B4", premium: true },
  { base: "#BAE1FF", stroke: "#A5C9E5", premium: true },
  { base: "#2B2B2B", stroke: "#555555", premium: true },
];

const ACCESSORIES = [
  {
    id: "crown",
    emoji: "👑",
    price: 200,
    name: { 繁體中文: "王者皇冠", English: "Crown" },
  },
  {
    id: "glasses",
    emoji: "🕶️",
    price: 100,
    name: { 繁體中文: "潮流墨鏡", English: "Cool Glasses" },
  },
  {
    id: "sparkle",
    emoji: "✨",
    price: 50,
    name: { 繁體中文: "閃耀之星", English: "Sparkles" },
  },
  {
    id: "flower",
    emoji: "🌸",
    price: 80,
    name: { 繁體中文: "浪漫小花", English: "Flower" },
  },
];

const MascotSVG = ({
  className,
  baseColor = "#D4AEE3",
  strokeColor = "#C49CD3",
  accessoryEmoji = null,
}) => (
  <svg
    viewBox="0 0 200 200"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    style={{ overflow: "visible" }}
  >
    <path
      d="M 35 105 Q 20 120 30 135 Q 40 135 45 120 Z"
      fill={baseColor}
      stroke={strokeColor}
      strokeWidth="2"
    />
    <path
      d="M 165 105 Q 180 120 170 135 Q 160 135 155 120 Z"
      fill={baseColor}
      stroke={strokeColor}
      strokeWidth="2"
    />
    <path d="M 75 165 Q 80 185 90 168 Z" fill={baseColor} />
    <path d="M 125 165 Q 120 185 110 168 Z" fill={baseColor} />
    <circle cx="100" cy="100" r="68" fill={baseColor} />
    <path
      d="M 55 70 Q 70 45 90 55 Q 75 75 55 70 Z"
      fill="white"
      opacity="0.6"
    />
    <circle cx="82" cy="85" r="4.5" fill="#231F20" />
    <circle cx="118" cy="85" r="4.5" fill="#231F20" />
    <ellipse cx="65" cy="94" rx="7.5" ry="4.5" fill="#F09B99" />
    <ellipse cx="135" cy="94" rx="7.5" ry="4.5" fill="#F09B99" />
    {accessoryEmoji && (
      <text
        x="100"
        y="55"
        fontSize="55"
        textAnchor="middle"
        style={{ pointerEvents: "none" }}
      >
        {accessoryEmoji}
      </text>
    )}
  </svg>
);

const getRelativeTime = (timestamp, lang) => {
  if (!timestamp) return lang === "繁體中文" ? "剛剛" : "Just now";
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return lang === "繁體中文" ? "剛剛" : "Just now";
  if (minutes < 60)
    return lang === "繁體中文" ? `${minutes} 分鐘前` : `${minutes}m ago`;
  if (hours < 24)
    return lang === "繁體中文" ? `${hours} 小時前` : `${hours}h ago`;
  return lang === "繁體中文" ? `${days} 天前` : `${days}d ago`;
};

export default function App() {
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const currentUserId = currentUser?.uid || "guest";

  const [currentView, setCurrentView] = useState("onboarding");
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [systemLang, setSystemLang] = useState("繁體中文");
  const t = locales[systemLang];

  const [karmaPoints, setKarmaPoints] = useState(120);
  const [userProfile, setUserProfile] = useState({
    name: "",
    bio: "",
    age: "",
    gender: "",
    colorIndex: 0,
    native: "繁體中文",
    learning: "English",
    interests: [],
    intent: "casual",
    unlockedColors: [0, 1, 2, 3, 4, 5],
    unlockedAccessories: [],
    equippedAccessory: null,
    blockedUsers: [],
    helped: 0,
    unreadChats: [],
  });

  const [allUsersDict, setAllUsersDict] = useState({});

  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [mutualFriends, setMutualFriends] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [myNotifications, setMyNotifications] = useState([]);
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(false);

  const [posts, setPosts] = useState([]);
  const postsCollectionRef = collection(db, "posts");

  const currentUserTag = `${userProfile.name || "User"} ${
    userProfile.native === "繁體中文" ? "🇹🇼" : "🇺🇸"
  }`;

  const [viewingProfileAuthor, setViewingProfileAuthor] = useState("me");

  const isMyProfile =
    viewingProfileAuthor === "me" ||
    viewingProfileAuthor === currentUserId ||
    viewingProfileAuthor === currentUserTag;

  const [feedTab, setFeedTab] = useState("foryou");
  const [selectedPostId, setSelectedPostId] = useState(null);

  const [newPostText, setNewPostText] = useState("");
  const [postIntent, setPostIntent] = useState("practice");
  const [postType, setPostType] = useState("post");
  const [selectedImage, setSelectedImage] = useState(null);

  const fileInputRef = useRef(null);
  const chatFileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const [draftText, setDraftText] = useState("");
  const [correctionText, setCorrectionText] = useState("");
  const [correctionTags, setCorrectionTags] = useState([]);

  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showCommentActionMenu, setShowCommentActionMenu] = useState(null);
  const [toastData, setToastData] = useState(null);
  const [showShopModal, setShowShopModal] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const [activeChatUser, setActiveChatUser] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState({});
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [activeReactionMsg, setActiveReactionMsg] = useState(null);
  const [latestMessages, setLatestMessages] = useState({});
  const pressTimer = useRef(null);

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempBio, setTempBio] = useState("");
  const [tempColorIndex, setTempColorIndex] = useState(0);
  // 🌟 編輯模式的全新狀態！
  const [tempAge, setTempAge] = useState("");
  const [tempGender, setTempGender] = useState("");
  const [tempIntent, setTempIntent] = useState("");
  const [tempInterests, setTempInterests] = useState([]);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const selectedPost = posts.find((p) => p.id === selectedPostId);

  const showToast = (text, title = t.noticeTitle, highlight = "") => {
    setToastData({ text, title, highlight });
  };

  const getUserDisplayName = (uidOrTag) => {
    if (
      uidOrTag === currentUserId ||
      uidOrTag === "me" ||
      uidOrTag === currentUserTag
    ) {
      return `${userProfile.name || "User"} ${
        userProfile.native === "繁體中文" ? "🇹🇼" : "🇺🇸"
      }`;
    }
    const userFromDict = allUsersDict[uidOrTag];
    if (userFromDict) {
      return `${userFromDict.name || "User"} ${
        userFromDict.native === "繁體中文" ? "🇹🇼" : "🇺🇸"
      }`;
    }
    return uidOrTag;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const q = query(
            collection(db, "users"),
            where("uid", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setUserProfile({
              name: userData.name || "",
              bio: userData.bio || "",
              age: userData.age || "",
              gender: userData.gender || "",
              colorIndex: userData.colorIndex || 0,
              native: userData.native || "繁體中文",
              learning: userData.learning || "English",
              interests: userData.interests || [],
              intent: userData.intent || "casual",
              unlockedColors: userData.unlockedColors || [0, 1, 2, 3, 4, 5],
              unlockedAccessories: userData.unlockedAccessories || [],
              equippedAccessory: userData.equippedAccessory || null,
              blockedUsers: userData.blockedUsers || [],
              helped: userData.helped || 0,
              unreadChats: userData.unreadChats || [],
            });
            setSystemLang(
              userData.native === "繁體中文" ? "繁體中文" : "English"
            );
            setCurrentView("feed");
          } else {
            setUserProfile((prev) => ({
              ...prev,
              name: user.displayName || "",
            }));
            setOnboardingStep(3);
            setCurrentView("onboarding");
          }
        } catch (e) {
          console.error("還原資料失敗：", e);
        }
      } else {
        setCurrentView("onboarding");
        setOnboardingStep(1);
      }
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const dict = {};
      snap.forEach((doc) => {
        const data = doc.data();
        dict[data.uid || doc.id] = data;
      });
      setAllUsersDict(dict);
    });
    return () => unsub();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setCurrentUser(user);
      setUserProfile({ ...userProfile, name: user.displayName || "" });
      setOnboardingStep(3);
    } catch (error) {
      console.error("登入失敗：", error);
      showToast("登入失敗，請稍後再試", "哎呀！");
    }
  };

  useEffect(() => {
    if (currentView === "onboarding" || currentUserId === "guest") return;
    const userDocRef = doc(db, "users", currentUserId);
    const unsub = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const f_ing = data.following || [];
        const f_ers = data.followers || [];
        setFollowing(f_ing);
        setFollowers(f_ers);
        const mutuals = f_ing.filter((f) => f_ers.includes(f));
        setMutualFriends(mutuals);
        setMyNotifications(data.notifications || []);
        setHasUnreadNotifs(data.hasUnreadNotifs || false);
        setHasUnreadMessages(data.hasUnreadMessages || false);
        setUserProfile((prev) => ({
          ...prev,
          unreadChats: data.unreadChats || [],
        }));
      }
    });
    return () => unsub();
  }, [currentUserId, currentView]);

  useEffect(() => {
    if (mutualFriends.length === 0 || currentUserId === "guest") return;
    const unsubs = mutualFriends.map((friendUid) => {
      const chatId = [currentUserId, friendUid].sort().join("_");
      const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("timestamp", "desc"),
        limit(1)
      );
      return onSnapshot(q, (snap) => {
        if (!snap.empty) {
          const msg = snap.docs[0].data();
          setLatestMessages((prev) => ({ ...prev, [friendUid]: msg }));
        }
      });
    });
    return () => unsubs.forEach((u) => u());
  }, [mutualFriends, currentUserId]);

  useEffect(() => {
    if (currentUserId === "guest") return;
    const unsubscribe = onSnapshot(postsCollectionRef, (snapshot) => {
      const realPosts = snapshot.docs.map((doc) => {
        const data = doc.data();
        const postLikedBy = data.likedBy || [];

        const authorId = data.authorId || data.author || "unknown";

        return {
          ...data,
          id: doc.id,
          authorId: authorId,
          isMine: authorId === currentUserId || authorId === currentUserTag,
          likes: postLikedBy.length,
          hasLiked:
            postLikedBy.includes(currentUserId) ||
            postLikedBy.includes(currentUserTag),
          comments: (data.comments || []).map((c) => {
            const cLikedBy = c.likedBy || [];
            const cDislikedBy = c.dislikedBy || [];
            const cAuthorId = c.authorId || c.author || "unknown";
            return {
              ...c,
              authorId: cAuthorId,
              likes: cLikedBy.length,
              dislikes: cDislikedBy.length,
              hasLiked:
                cLikedBy.includes(currentUserId) ||
                cLikedBy.includes(currentUserTag),
              hasDisliked:
                cDislikedBy.includes(currentUserId) ||
                cDislikedBy.includes(currentUserTag),
            };
          }),
        };
      });

      const filtered = realPosts.filter(
        (p) =>
          !(userProfile.blockedUsers || []).includes(p.authorId) &&
          !(p.reportedBy && p.reportedBy.length >= 10)
      );
      setPosts(filtered);
    });
    return () => unsubscribe();
  }, [currentUserId, userProfile.blockedUsers, currentUserTag]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({
            behavior: "auto",
            block: "end",
          });
        }
      }, 100);
    });
  };

  useEffect(() => {
    if (
      currentView !== "chatRoom" ||
      !activeChatUser ||
      currentUserId === "guest"
    )
      return;
    const chatId = [currentUserId, activeChatUser].sort().join("_");
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setChatMessages((prev) => ({ ...prev, [activeChatUser]: msgs }));
    });

    return () => unsub();
  }, [activeChatUser, currentView, currentUserId]);

  useEffect(() => {
    if (currentView === "chatRoom") {
      scrollToBottom();
    }
  }, [chatMessages, activeChatUser, currentView]);

  const callGemini = async (prompt) => {
    setIsAiLoading(true);
    const apiKey = "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    try {
      const cleanPrompt =
        prompt +
        " (請直接回答，並且絕對不要使用任何 markdown 語法如 *, #, ` 等，保持純文字)";
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: cleanPrompt }] }],
        }),
      });
      const data = await resp.json();
      setIsAiLoading(false);
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return text.replace(/[*#`]/g, "");
    } catch (e) {
      setIsAiLoading(false);
      return "API 連線失敗";
    }
  };

  const UserAvatar = ({ uid, className }) => {
    let palette = PALETTES[0];
    let accEmoji = null;
    const isMe =
      uid === currentUserId || uid === "me" || uid === currentUserTag;

    if (isMe) {
      palette = PALETTES[userProfile.colorIndex || 0] || PALETTES[0];
      const acc = ACCESSORIES.find(
        (a) => a.id === userProfile.equippedAccessory
      );
      if (acc) accEmoji = acc.emoji;
    } else {
      const targetUser = allUsersDict[uid];
      if (targetUser) {
        palette = PALETTES[targetUser.colorIndex || 0] || PALETTES[0];
        const acc = ACCESSORIES.find(
          (a) => a.id === targetUser.equippedAccessory
        );
        if (acc) accEmoji = acc.emoji;
      }
    }

    return (
      <MascotSVG
        className={className}
        baseColor={palette.base}
        strokeColor={palette.stroke}
        accessoryEmoji={accEmoji}
      />
    );
  };

  const hasActiveStory = (authorUid) => {
    const now = Date.now();
    return posts.some(
      (p) =>
        p.authorId === authorUid &&
        p.isStory &&
        now - p.timestamp < 24 * 60 * 60 * 1000
    );
  };

  const StoryAvatar = ({ uid, sizeClass = "w-10 h-10", onClick }) => {
    const active = hasActiveStory(uid);
    return (
      <div
        onClick={(e) => {
          if (active) {
            e.stopPropagation();
            const userStories = posts
              .filter(
                (p) =>
                  p.authorId === uid &&
                  p.isStory &&
                  Date.now() - p.timestamp < 24 * 60 * 60 * 1000
              )
              .sort((a, b) => a.timestamp - b.timestamp);
            if (userStories.length > 0) {
              setSelectedPostId(userStories[0].id);
              setCurrentView("postDetail");
            }
          } else if (onClick) {
            onClick(e);
          }
        }}
        className={`rounded-full shrink-0 ${
          active
            ? "p-[3px] bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-500 cursor-pointer hover:scale-105 transition-transform shadow-sm"
            : ""
        } ${onClick && !active ? "cursor-pointer" : ""}`}
      >
        <div
          className={`bg-white rounded-full w-full h-full flex items-center justify-center ${
            active ? "p-[2px]" : ""
          }`}
        >
          <UserAvatar uid={uid} className={sizeClass} />
        </div>
      </div>
    );
  };

  const handleStart = async () => {
    try {
      await setDoc(
        doc(db, "users", currentUserId),
        {
          ...userProfile,
          uid: currentUserId,
          following: following,
          followers: followers,
          timestamp: Date.now(),
        },
        { merge: true }
      );
      setCurrentView("feed");
    } catch (e) {
      console.error("建立使用者失敗：", e);
      showToast("連線異常，請再試一次", t.oopsTitle);
    }
  };

  const validateLanguage = (text, targetLang) => {
    if (!text.trim()) return true;
    if (targetLang === "English" && /[\u4e00-\u9fa5]/.test(text)) {
      showToast(t.langLockedHint("English"), t.oopsTitle);
      return false;
    } else if (
      targetLang === "繁體中文" &&
      !/[\u4e00-\u9fa5]/.test(text) &&
      /[a-zA-Z]/.test(text)
    ) {
      showToast(t.langLockedHint(t.langZh), t.oopsTitle);
      return false;
    }
    return true;
  };

  const handlePublish = async () => {
    if (
      postType === "post" &&
      newPostText.trim().length < 15 &&
      !selectedImage
    ) {
      showToast(t.tooShortWarning, t.oopsTitle);
      return;
    }
    if (!newPostText.trim() && !selectedImage) return;

    if (postIntent === "practice" && newPostText.trim()) {
      let isLearningLang = true;
      if (
        userProfile.learning === "English" &&
        /[\u4e00-\u9fa5]/.test(newPostText)
      ) {
        isLearningLang = false;
      } else if (
        userProfile.learning === "繁體中文" &&
        !/[\u4e00-\u9fa5]/.test(newPostText) &&
        /[a-zA-Z]/.test(newPostText)
      ) {
        isLearningLang = false;
      }

      if (!isLearningLang) {
        showToast(t.practiceLangWarning, t.oopsTitle);
        return;
      }
    }

    const postLanguage =
      postIntent === "practice" ? userProfile.learning : userProfile.native;

    try {
      await addDoc(postsCollectionRef, {
        authorId: currentUserId,
        author: currentUserTag,
        content: newPostText,
        image: selectedImage,
        time: t.justNow,
        timestamp: Date.now(),
        likedBy: [],
        lang: postLanguage,
        postIntent: postIntent,
        boosted: false,
        isStory: postType === "story",
        comments: [],
      });
      setNewPostText("");
      setSelectedImage(null);
      setPostType("post");
      setCurrentView("feed");
      showToast(t.publishSuccess, t.successTitle);
    } catch (error) {
      showToast(t.publishFailed, t.oopsTitle);
    }
  };

  const handleReportPost = async (postId) => {
    if (typeof postId === "number") return;
    const postRef = doc(db, "posts", postId);
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    const newReportedBy = [...(post.reportedBy || []), currentUserId];

    try {
      if (newReportedBy.length >= 10) {
        await deleteDoc(postRef);
        showToast("該貼文因檢舉人數過多已全域移除", t.noticeTitle);
      } else {
        await updateDoc(postRef, { reportedBy: arrayUnion(currentUserId) });
        showToast(t.reportSuccess, t.successTitle);
      }
      setShowActionMenu(null);
      if (selectedPostId === postId) {
        setSelectedPostId(null);
        setCurrentView("feed");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBlockUser = async (targetAuthorUid) => {
    if (targetAuthorUid === currentUserId) return;
    setUserProfile((prev) => ({
      ...prev,
      blockedUsers: [...(prev.blockedUsers || []), targetAuthorUid],
    }));
    try {
      await addDoc(collection(db, "user_reports"), {
        reportedUser: targetAuthorUid,
        reporter: currentUserId,
        timestamp: Date.now(),
        type: "block",
      });
      await setDoc(
        doc(db, "users", currentUserId),
        {
          blockedUsers: arrayUnion(targetAuthorUid),
        },
        { merge: true }
      );
      showToast(t.blockSuccess, t.successTitle);
      setShowActionMenu(null);
      setCurrentView("feed");
    } catch (e) {
      console.error(e);
    }
  };

  const handleReportUser = async (targetAuthorUid) => {
    if (targetAuthorUid === currentUserId) return;
    try {
      await addDoc(collection(db, "user_reports"), {
        reportedUser: targetAuthorUid,
        reporter: currentUserId,
        timestamp: Date.now(),
        type: "report",
      });
      showToast(t.reportSuccess, t.successTitle);
      setShowActionMenu(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm(t.deleteConfirm)) return;
    try {
      const myPosts = posts.filter(
        (p) => p.authorId === currentUserId || p.author === currentUserTag
      );
      for (let p of myPosts) {
        if (typeof p.id !== "number") {
          await deleteDoc(doc(db, "posts", p.id));
        }
      }
      await deleteDoc(doc(db, "users", currentUserId));
      if (auth.currentUser) await signOut(auth);

      setUserProfile({
        name: "",
        bio: "",
        age: "",
        gender: "",
        colorIndex: 0,
        native: "繁體中文",
        learning: "English",
        interests: [],
        intent: "casual",
        unlockedColors: [0, 1, 2, 3, 4, 5],
        unlockedAccessories: [],
        equippedAccessory: null,
        blockedUsers: [],
        helped: 0,
        unreadChats: [],
      });
      setCurrentUser(null);
      setCurrentView("onboarding");
      setOnboardingStep(1);
      showToast(t.deleteAccountSuccess, t.successTitle);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReportComment = async (postId, commentId) => {
    if (typeof postId === "number") return;
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    const updatedComments = post.comments.filter((c) => c.id !== commentId);
    try {
      await updateDoc(doc(db, "posts", postId), { comments: updatedComments });
      showToast(t.commentReportSuccess, t.successTitle);
      setShowCommentActionMenu(null);
    } catch (error) {}
  };

  const handleDeletePost = async (postId) => {
    if (typeof postId === "number") return;
    try {
      await deleteDoc(doc(db, "posts", postId));
      showToast(t.deletePostSuccess, t.successTitle);
      setShowActionMenu(null);
      if (selectedPostId === postId) {
        setSelectedPostId(null);
        setCurrentView("feed");
      }
    } catch (error) {}
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (typeof postId === "number") return;
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    const updatedComments = post.comments.filter((c) => c.id !== commentId);
    try {
      await updateDoc(doc(db, "posts", postId), { comments: updatedComments });
      showToast(t.deletePostSuccess, t.successTitle);
      setShowCommentActionMenu(null);
    } catch (error) {}
  };

  const handleCommentReaction = async (postId, commentId, type) => {
    if (typeof postId === "number") return;
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    let deductedKarma = 0;
    const updatedComments = post.comments.map((c) => {
      if (c.id === commentId) {
        let likedBy = [...(c.likedBy || [])];
        let dislikedBy = [...(c.dislikedBy || [])];
        const hasLiked = likedBy.includes(currentUserId);
        const hasDisliked = dislikedBy.includes(currentUserId);
        if (type === "like") {
          if (hasLiked) {
            likedBy = likedBy.filter((u) => u !== currentUserId);
          } else {
            likedBy.push(currentUserId);
            dislikedBy = dislikedBy.filter((u) => u !== currentUserId);
          }
        } else if (type === "dislike") {
          if (hasDisliked) {
            dislikedBy = dislikedBy.filter((u) => u !== currentUserId);
          } else {
            dislikedBy.push(currentUserId);
            likedBy = likedBy.filter((u) => u !== currentUserId);
          }
        }
        const netScore = likedBy.length - dislikedBy.length;
        let hidden = c.hiddenByCommunity || false;
        if (dislikedBy.length > likedBy.length && netScore < -5 && !hidden) {
          hidden = true;
          if (c.authorId === currentUserId) {
            deductedKarma = 20;
          }
        }
        return { ...c, likedBy, dislikedBy, hiddenByCommunity: hidden };
      }
      return c;
    });

    try {
      await updateDoc(doc(db, "posts", postId), { comments: updatedComments });
      if (deductedKarma > 0) {
        setKarmaPoints((prev) => prev - deductedKarma);
        showToast(
          systemLang === "繁體中文"
            ? "您的留言已被社群隱藏，扣除 20 🧼"
            : "Your comment was hidden by the community. Lost 20 🧼.",
          t.noticeTitle
        );
      }
    } catch (error) {}
  };

  const handleBoost = async (postId) => {
    if (typeof postId === "number") return;
    if (karmaPoints >= 50) {
      try {
        await updateDoc(doc(db, "posts", postId), {
          boosted: true,
          timestamp: Date.now(),
        });
        setKarmaPoints((prev) => prev - 50);
        showToast(t.boostSuccess, t.successTitle);
      } catch (error) {}
    } else {
      showToast(t.notEnoughKarma, t.oopsTitle);
    }
  };

  const isSpamText = (text) => {
    if (text.length < 3 || text.length > 200) return true;
    if (/(.)\1{4,}/.test(text)) return true;
    if (/(.{2,})\1{2,}/.test(text)) return true;
    const noSpaceText = text.replace(/\s+/g, "");
    if (noSpaceText.length === 0) return true;
    const symbolCount = noSpaceText.replace(
      /[a-zA-Z0-9\u4e00-\u9fa5]/g,
      ""
    ).length;
    if (symbolCount / noSpaceText.length > 0.4) return true;
    if (/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{6,}/.test(text))
      return true;
    return false;
  };

  const handleSendComment = async () => {
    if (!draftText.trim() || !selectedPostId) return;
    if (
      selectedPost.postIntent !== "share" &&
      !validateLanguage(draftText, selectedPost.lang)
    )
      return;
    if (isSpamText(draftText)) {
      showToast(t.invalidSuggestWarningRegex, t.oopsTitle);
      return;
    }
    if (typeof selectedPostId === "number") return;

    const newComment = {
      id: Date.now(),
      authorId: currentUserId,
      text: draftText,
      time: t.justNow,
      isCorrection: false,
      likedBy: [],
      dislikedBy: [],
      hiddenByCommunity: false,
    };
    try {
      await updateDoc(doc(db, "posts", selectedPostId), {
        comments: arrayUnion(newComment),
      });

      if (selectedPost.authorId !== currentUserId) {
        await setDoc(
          doc(db, "users", selectedPost.authorId),
          {
            notifications: arrayUnion({
              id: Date.now(),
              type: "comment",
              from: currentUserId,
              postId: selectedPostId,
              timestamp: Date.now(),
            }),
            hasUnreadNotifs: true,
          },
          { merge: true }
        );
      }

      setDraftText("");
      setShowCommentModal(false);
    } catch (error) {}
  };

  const submitCorrection = async () => {
    if (!correctionText.trim()) return;
    if (
      selectedPost.postIntent !== "share" &&
      !validateLanguage(correctionText, selectedPost.lang)
    )
      return;
    if (isSpamText(correctionText)) {
      showToast(t.invalidSuggestWarningRegex, t.oopsTitle);
      return;
    }
    if (typeof selectedPostId === "number") return;

    const isNativeResponder = userProfile.native === selectedPost.lang;

    const newComment = {
      id: Date.now(),
      authorId: currentUserId,
      text: correctionText,
      time: t.justNow,
      isCorrection: true,
      tags: correctionTags,
      likedBy: [],
      dislikedBy: [],
      hiddenByCommunity: false,
    };
    const hasCorrectedBefore = selectedPost.comments.some(
      (c) => c.authorId === currentUserId && c.isCorrection
    );

    try {
      await updateDoc(doc(db, "posts", selectedPostId), {
        comments: arrayUnion(newComment),
      });

      if (selectedPost.authorId !== currentUserId) {
        await setDoc(
          doc(db, "users", selectedPost.authorId),
          {
            notifications: arrayUnion({
              id: Date.now(),
              type: "correction",
              from: currentUserId,
              postId: selectedPostId,
              timestamp: Date.now(),
            }),
            hasUnreadNotifs: true,
          },
          { merge: true }
        );
      }

      if (!hasCorrectedBefore) {
        if (isNativeResponder) {
          showToast(t.correctionSuccess, t.successTitle);
          setKarmaPoints((prev) => prev + 10);

          const newHelpedCount = (userProfile.helped || 0) + 1;
          setUserProfile((prev) => ({ ...prev, helped: newHelpedCount }));
          await updateDoc(doc(db, "users", currentUserId), {
            helped: newHelpedCount,
          });
        } else {
          showToast(t.nonNativeWarning, t.noticeTitle);
        }
      } else {
        showToast(t.correctionSuccessNoPoints, t.successTitle);
      }
      setCorrectionText("");
      setCorrectionTags([]);
      setShowCorrectionModal(false);
    } catch (error) {}
  };

  const handleBuyColor = (idx) => {
    if (userProfile.unlockedColors.includes(idx)) {
      setUserProfile({ ...userProfile, colorIndex: idx });
      showToast(t.purchaseSuccess, t.successTitle);
    } else if (karmaPoints >= 50) {
      setKarmaPoints((prev) => prev - 50);
      setUserProfile({
        ...userProfile,
        unlockedColors: [...userProfile.unlockedColors, idx],
        colorIndex: idx,
      });
      showToast(t.purchaseSuccess, t.successTitle);
    } else {
      showToast(t.notEnoughKarma, t.oopsTitle);
    }
  };

  const handleBuyAccessory = (acc) => {
    if (userProfile.unlockedAccessories.includes(acc.id)) {
      setUserProfile({
        ...userProfile,
        equippedAccessory:
          userProfile.equippedAccessory === acc.id ? null : acc.id,
      });
    } else if (karmaPoints >= acc.price) {
      setKarmaPoints((prev) => prev - acc.price);
      setUserProfile({
        ...userProfile,
        unlockedAccessories: [...userProfile.unlockedAccessories, acc.id],
        equippedAccessory: acc.id,
      });
      showToast(t.purchaseSuccess, t.successTitle);
    } else {
      showToast(t.notEnoughKarma, t.oopsTitle);
    }
  };

  const handleFollow = async () => {
    if (following.includes(viewingProfileAuthor)) return;
    try {
      await setDoc(
        doc(db, "users", currentUserId),
        {
          following: arrayUnion(viewingProfileAuthor),
        },
        { merge: true }
      );

      await setDoc(
        doc(db, "users", viewingProfileAuthor),
        {
          followers: arrayUnion(currentUserId),
        },
        { merge: true }
      );

      if (followers.includes(viewingProfileAuthor)) {
        showToast(t.followMutualSuccess, t.successTitle);
      } else {
        showToast(t.followSuccess, t.successTitle);
      }
    } catch (err) {
      console.error(err);
      showToast("操作失敗，可能是舊帳號未同步，請重試", "系統提示");
    }
  };

  const handleLike = async (e, postId) => {
    e.stopPropagation();
    if (typeof postId === "number") return;
    const postRef = doc(db, "posts", postId);
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    const isCurrentlyLiked = post.hasLiked;
    try {
      await updateDoc(postRef, {
        likedBy: isCurrentlyLiked
          ? arrayRemove(currentUserId)
          : arrayUnion(currentUserId),
      });
    } catch (error) {}
  };

  const openChat = (uid) => {
    setActiveChatUser(uid);
    setCurrentView("chatRoom");
    if (userProfile.unreadChats?.includes(uid)) {
      updateDoc(doc(db, "users", currentUserId), {
        unreadChats: arrayRemove(uid),
      });
    }
  };

  const handleDMClick = () => {
    if (mutualFriends.includes(viewingProfileAuthor)) {
      openChat(viewingProfileAuthor);
      setHasUnreadMessages(false);
    } else {
      showToast(t.dmLocked, t.noticeTitle);
    }
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim() || !activeChatUser) return;
    const textToSend = chatInput;
    setChatInput("");

    const chatId = [currentUserId, activeChatUser].sort().join("_");
    const newMsg = {
      sender: currentUserId,
      text: textToSend,
      timestamp: Date.now(),
      time: t.justNow,
    };

    try {
      addDoc(collection(db, "chats", chatId, "messages"), newMsg);
      setDoc(
        doc(db, "users", activeChatUser),
        {
          hasUnreadMessages: true,
          unreadChats: arrayUnion(currentUserId),
        },
        { merge: true }
      );
    } catch (e) {
      console.error("發送訊息失敗", e);
    }
  };

  const handleSendChatImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const chatId = [currentUserId, activeChatUser].sort().join("_");
        const newMsg = {
          sender: currentUserId,
          text: "",
          image: reader.result,
          timestamp: Date.now(),
          time: t.justNow,
        };
        try {
          addDoc(collection(db, "chats", chatId, "messages"), newMsg);
          setDoc(
            doc(db, "users", activeChatUser),
            {
              hasUnreadMessages: true,
              unreadChats: arrayUnion(currentUserId),
            },
            { merge: true }
          );
        } catch (err) {}
      };
      reader.readAsDataURL(file);
    }
    if (chatFileInputRef.current) chatFileInputRef.current.value = "";
  };

  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) return;
    try {
      await addDoc(collection(db, "feedbacks"), {
        text: feedbackText,
        authorId: currentUserId,
        timestamp: Date.now(),
        time: new Date().toLocaleString(),
      });
      setShowFeedbackModal(false);
      setFeedbackText("");
      showToast(t.feedbackSuccess, t.successTitle);
    } catch (error) {}
  };

  const handlePressStart = (msgId) => {
    pressTimer.current = setTimeout(() => {
      setActiveReactionMsg(msgId);
    }, 500);
  };
  const handlePressEnd = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  const handleReactToMsg = async (msgId, emoji) => {
    const chatId = [currentUserId, activeChatUser].sort().join("_");
    try {
      await updateDoc(doc(db, "chats", chatId, "messages", msgId), {
        reaction: emoji,
      });
    } catch (e) {}
    setActiveReactionMsg(null);
  };

  // --- Rendering ---
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans relative">
        <div className="w-[405px] h-[720px] bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden border-[12px] border-gray-800 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
          <p className="text-gray-500 font-bold animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  const renderOnboarding = () => {
    if (onboardingStep === 1) {
      return (
        <div className="flex flex-col h-full bg-white p-8 items-center justify-center text-center animate-fade-in overflow-y-auto">
          <MascotSVG
            className="w-48 h-48 mb-6 animate-bounce"
            baseColor={PALETTES[0].base}
            strokeColor={PALETTES[0].stroke}
          />
          <h1 className="text-3xl font-black text-purple-600 mb-2 tracking-tighter">
            System Language
          </h1>
          <p className="text-gray-400 text-sm mb-10 font-medium">
            Choose your language / 請選擇系統語言
          </p>
          <div className="w-full space-y-4 mb-10">
            <button
              onClick={() => {
                setSystemLang("English");
                setUserProfile({
                  ...userProfile,
                  native: "English",
                  learning: "繁體中文",
                });
                setOnboardingStep(2);
              }}
              className="w-full py-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-2xl font-bold text-lg border border-purple-100 transition-colors"
            >
              English
            </button>
            <button
              onClick={() => {
                setSystemLang("繁體中文");
                setUserProfile({
                  ...userProfile,
                  native: "繁體中文",
                  learning: "English",
                });
                setOnboardingStep(2);
              }}
              className="w-full py-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-2xl font-bold text-lg border border-purple-100 transition-colors"
            >
              繁體中文
            </button>
          </div>
        </div>
      );
    }

    if (onboardingStep === 2) {
      return (
        <div className="flex flex-col h-full bg-white p-8 items-center justify-center text-center animate-fade-in relative">
          <button
            onClick={() => setOnboardingStep(1)}
            className="absolute top-8 left-6 text-gray-400 hover:text-gray-600 transition-colors z-10 p-2 -ml-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <MascotSVG
            className="w-32 h-32 mb-6 drop-shadow-md"
            baseColor={PALETTES[0].base}
            strokeColor={PALETTES[0].stroke}
          />
          <h1 className="text-3xl font-black text-purple-600 mb-2 tracking-tighter">
            Sign In
          </h1>
          <p className="text-gray-400 text-sm mb-12 font-medium">
            {systemLang === "繁體中文"
              ? "建立帳號以發布與互動"
              : "Create an account to post and interact"}
          </p>
          <div className="w-full space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full py-4 bg-white border-2 border-gray-100 rounded-2xl font-bold text-gray-800 text-lg flex items-center justify-center gap-3 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="w-6 h-6"
                alt="google"
              />{" "}
              Continue with Google
            </button>
            <button
              onClick={() => showToast(t.featureComingSoon, t.comingSoon)}
              className="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-sm hover:bg-gray-900 active:scale-95 transition-all"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.31-.88 3.5-.8 1.48.06 2.76.62 3.55 1.7-3.06 1.76-2.58 5.86.37 7.08-.75 1.83-1.61 3.37-2.5 4.19zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.33 2.34-1.9 4.19-3.74 4.25z" />
              </svg>{" "}
              Continue with Apple
            </button>
          </div>
        </div>
      );
    }

    if (onboardingStep === 3) {
      return (
        <div className="flex flex-col h-full bg-white p-8 items-center justify-start animate-fade-in overflow-y-auto relative">
          <MascotSVG
            className="w-32 h-32 mb-4 mt-6"
            baseColor={PALETTES[userProfile.colorIndex].base}
            strokeColor={PALETTES[userProfile.colorIndex].stroke}
          />
          <div className="flex flex-wrap gap-3 justify-center mb-6 w-full px-4">
            {PALETTES.slice(0, 6).map((p, idx) => (
              <button
                key={idx}
                onClick={() =>
                  setUserProfile({ ...userProfile, colorIndex: idx })
                }
                className={`w-8 h-8 rounded-full border-2 ${
                  userProfile.colorIndex === idx
                    ? "border-purple-600 scale-125"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: p.base }}
              />
            ))}
          </div>
          <h1 className="text-2xl font-black text-purple-600 mb-2">
            {t.step2Title}
          </h1>
          <div className="w-full space-y-3 mb-6">
            <input
              className="w-full bg-purple-50 rounded-2xl px-4 py-3 font-bold"
              value={userProfile.name}
              onChange={(e) =>
                setUserProfile({ ...userProfile, name: e.target.value })
              }
              placeholder={t.namePlaceholder}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                className="w-full bg-purple-50 rounded-2xl px-4 py-3 font-bold"
                value={userProfile.age}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, age: e.target.value })
                }
                placeholder={t.agePlaceholder}
              />
              <select
                className="w-full bg-purple-50 rounded-2xl px-4 py-3 font-bold"
                value={userProfile.gender}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, gender: e.target.value })
                }
              >
                <option value="" disabled>
                  {t.genderPlaceholder}
                </option>
                <option value="M">{t.genders.M}</option>
                <option value="F">{t.genders.F}</option>
                <option value="O">{t.genders.O}</option>
              </select>
            </div>
            <textarea
              className="w-full text-sm bg-gray-50 rounded-2xl px-4 py-3 h-20 resize-none font-medium"
              value={userProfile.bio}
              onChange={(e) =>
                setUserProfile({ ...userProfile, bio: e.target.value })
              }
              placeholder={t.bioPlaceholder}
            />
          </div>
          <button
            onClick={() => setOnboardingStep(4)}
            disabled={!userProfile.name.trim() || !userProfile.gender}
            className="w-full py-4 bg-purple-600 disabled:bg-gray-300 text-white rounded-2xl font-bold mt-auto mb-4 active:scale-95 transition-all"
          >
            {t.nextBtn}
          </button>
        </div>
      );
    }

    if (onboardingStep === 4) {
      return (
        <div className="flex flex-col h-full bg-white p-6 items-center justify-start animate-fade-in overflow-y-auto">
          <div className="w-full flex items-center justify-center relative mt-4 mb-2">
            <button
              onClick={() => setOnboardingStep(3)}
              className="absolute left-0 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-[22px] font-black text-purple-600">
              {t.step3Title}
            </h1>
          </div>
          <p className="text-gray-400 text-xs mb-6 font-medium text-center">
            {t.step3Desc}
          </p>
          <div className="w-full space-y-5 mb-8 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-left">
                <label className="text-[10px] font-bold text-purple-400 ml-1 uppercase tracking-wider">
                  {t.nativeLabel}
                </label>
                <select
                  value={userProfile.native}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, native: e.target.value })
                  }
                  className="w-full p-3 mt-1 rounded-xl bg-purple-50 border-none outline-none text-purple-900 font-bold appearance-none cursor-pointer"
                >
                  <option value="繁體中文">{t.langZh}</option>
                  <option value="English">{t.langEn}</option>
                </select>
              </div>
              <div className="text-left">
                <label className="text-[10px] font-bold text-purple-400 ml-1 uppercase tracking-wider">
                  {t.learningLabel}
                </label>
                <select
                  value={userProfile.learning}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, learning: e.target.value })
                  }
                  className="w-full p-3 mt-1 rounded-xl bg-purple-50 border-none outline-none text-purple-900 font-bold appearance-none cursor-pointer"
                >
                  <option value="English">{t.langEn}</option>
                  <option value="繁體中文">{t.langZh}</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-purple-400 ml-1">
                {t.interestLabel}
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {INTERESTS_KEYS.map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      const list = userProfile.interests;
                      setUserProfile({
                        ...userProfile,
                        interests: list.includes(key)
                          ? list.filter((i) => i !== key)
                          : [...list, key],
                      });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-sm font-bold border transition-colors ${
                      userProfile.interests.includes(key)
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-500 border-gray-200"
                    }`}
                  >
                    {t.interests[key]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-purple-400 ml-1">
                {t.intentLabel}
              </label>
              <div className="space-y-2 mt-2">
                {t.intents.map((intent) => (
                  <button
                    key={intent.id}
                    onClick={() =>
                      setUserProfile({ ...userProfile, intent: intent.id })
                    }
                    className={`w-full p-3 rounded-2xl text-sm font-bold text-left border transition-all ${
                      userProfile.intent === intent.id
                        ? "bg-purple-50 border-purple-400 text-purple-700"
                        : "bg-white border-gray-100 text-gray-500"
                    }`}
                  >
                    {intent.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={handleStart}
            className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold shadow-lg mt-auto mb-4 active:scale-95 transition-all"
          >
            {t.startBtn}
          </button>
        </div>
      );
    }
  };

  const renderFeed = () => {
    let displayPosts = [];
    if (feedTab === "foryou") {
      displayPosts = [...posts]
        .filter((p) => !p.isStory)
        .sort((a, b) => {
          if (a.boosted && !b.boosted) return -1;
          if (!a.boosted && b.boosted) return 1;

          const getLangScore = (lang) => {
            if (lang === userProfile.learning) return 2;
            if (lang === userProfile.native) return 0;
            return 1;
          };
          const scoreLangA = getLangScore(a.lang);
          const scoreLangB = getLangScore(b.lang);
          if (scoreLangA !== scoreLangB) return scoreLangB - scoreLangA;

          return b.timestamp - a.timestamp;
        });
    } else {
      displayPosts = posts
        .filter(
          (p) => !p.isStory && (following.includes(p.authorId) || p.isMine)
        )
        .sort((a, b) => b.timestamp - a.timestamp);
    }

    const pendingFollowers = followers.filter((f) => !following.includes(f));

    return (
      <div className="flex flex-col h-full bg-gray-50 pb-20">
        <header className="bg-white px-6 pt-5 pb-2 sticky top-0 z-10 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-black text-purple-600 tracking-tighter">
              CORLABO
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-full text-purple-700">
                <span className="text-sm">🧼</span>
                <span className="font-black text-sm">{karmaPoints}</span>
              </div>

              <button
                onClick={() => {
                  setShowNotifications(true);
                  if (hasUnreadNotifs) {
                    updateDoc(doc(db, "users", currentUserId), {
                      hasUnreadNotifs: false,
                    });
                  }
                }}
                className="relative text-gray-400 hover:text-purple-600 transition-colors"
              >
                <Bell className="w-6 h-6" />
                {(pendingFollowers.length > 0 || hasUnreadNotifs) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              <button
                onClick={() => {
                  setCurrentView("chatList");
                  setHasUnreadMessages(false);
                  if (hasUnreadMessages) {
                    updateDoc(doc(db, "users", currentUserId), {
                      hasUnreadMessages: false,
                    });
                  }
                }}
                className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 relative"
              >
                <Send className="w-4 h-4 -ml-0.5 mt-0.5" />
                {(hasUnreadMessages || userProfile.unreadChats?.length > 0) && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-white"></span>
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-6 border-b border-gray-100">
            <button
              onClick={() => setFeedTab("foryou")}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                feedTab === "foryou"
                  ? "border-purple-600 text-purple-800"
                  : "border-transparent text-gray-400"
              }`}
            >
              {t.tabForYou}
            </button>
            <button
              onClick={() => setFeedTab("following")}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                feedTab === "following"
                  ? "border-purple-600 text-purple-800"
                  : "border-transparent text-gray-400"
              }`}
            >
              {t.tabFollowing}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {displayPosts.length > 0 ? (
            displayPosts.map(renderPostCard)
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center text-gray-400 mt-8">
              {t.feedEmpty}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPostCard = (post) => {
    const isPractice = post.postIntent === "practice";
    return (
      <div
        key={post.id}
        onClick={() => {
          setSelectedPostId(post.id);
          setAiSummary("");
          setCurrentView("postDetail");
        }}
        className={`rounded-[2rem] p-5 shadow-sm border cursor-pointer relative transition-all ${
          isPractice
            ? "bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border-indigo-100"
            : "bg-white border-gray-100"
        }`}
      >
        {post.boosted && (
          <div className="absolute top-0 right-6 bg-gradient-to-b from-amber-300 to-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-b-lg shadow-sm flex items-center gap-1 z-10">
            <Zap className="w-3 h-3 fill-current" /> BOOST
          </div>
        )}
        <div className="flex items-start justify-between mb-3">
          <div
            className="flex items-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setViewingProfileAuthor(post.authorId);
              setCurrentView("profile");
            }}
          >
            <StoryAvatar uid={post.authorId} sizeClass="w-10 h-10" />
            <div className="ml-3">
              <p className="font-bold text-gray-800 leading-tight">
                {getUserDisplayName(post.authorId)}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {getRelativeTime(post.timestamp, systemLang)} ·{" "}
                {isPractice ? t.intentPractice : t.intentShare}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActionMenu(post.id);
            }}
            className="text-gray-300 hover:text-gray-500 p-2 -mr-2"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
        {post.image && (
          <img
            src={post.image}
            alt="IMG"
            className="w-full aspect-video object-cover rounded-2xl mb-4"
          />
        )}
        <p className="text-gray-800 leading-relaxed font-medium text-[15px] break-words whitespace-pre-wrap">
          {post.content}
        </p>
        <div
          className={`flex gap-5 mt-4 pt-4 border-t ${
            isPractice ? "border-indigo-100/50" : "border-gray-50"
          } text-gray-400`}
        >
          <button
            onClick={(e) => handleLike(e, post.id)}
            className={`flex items-center gap-1.5 hover:text-pink-500 transition-colors ${
              post.hasLiked ? "text-pink-500" : "text-gray-400"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${post.hasLiked ? "fill-current" : ""}`}
            />{" "}
            <span className="text-sm font-bold">{post.likes}</span>
          </button>
          <div
            className={`flex items-center gap-1.5 ${
              isPractice ? "text-indigo-500" : "text-purple-500"
            }`}
          >
            <MessageCircle className="w-5 h-5" />{" "}
            <span className="text-sm font-bold">{post.comments.length}</span>
          </div>
        </div>

        {showActionMenu === post.id && (
          <>
            <div
              className="fixed inset-0 z-20"
              onClick={(e) => {
                e.stopPropagation();
                setShowActionMenu(null);
              }}
            ></div>
            <div className="absolute top-12 right-4 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-30 flex flex-col w-36">
              {post.isMine ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePost(post.id);
                  }}
                  className="flex items-center gap-2 text-sm font-bold text-red-500 p-2 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" /> {t.deletePost}
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReportPost(post.id);
                  }}
                  className="flex items-center gap-2 text-sm font-bold text-red-500 p-2 hover:bg-red-50 rounded-lg"
                >
                  <Flag className="w-4 h-4" /> {t.reportPost}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderNewPost = () => {
    return (
      <div className="flex flex-col h-full bg-white">
        <header className="px-6 py-5 flex justify-between items-center border-b border-gray-50">
          <button
            onClick={() => setCurrentView("feed")}
            className="text-gray-400 font-bold"
          >
            {t.cancelBtn}
          </button>
          <span className="font-bold text-gray-800">{t.newPostTitle}</span>
          <div className="w-8"></div>
        </header>
        <div className="p-6 flex-1 flex flex-col">
          <div className="bg-gray-100 p-1 rounded-2xl flex mb-6 shadow-inner">
            <button
              onClick={() => setPostType("post")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                postType === "post"
                  ? "bg-white shadow-sm text-purple-600 scale-100"
                  : "text-gray-500 hover:text-gray-700 scale-95"
              }`}
            >
              {t.postTypeNormal}
            </button>
            <button
              onClick={() => setPostType("story")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                postType === "story"
                  ? "bg-white shadow-sm text-pink-500 scale-100"
                  : "text-gray-500 hover:text-gray-700 scale-95"
              }`}
            >
              {t.postTypeStory}
            </button>
          </div>
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setPostIntent("practice")}
              className={`flex-1 py-3 rounded-2xl text-xs font-bold border transition-all ${
                postIntent === "practice"
                  ? "bg-indigo-50 border-indigo-400 text-indigo-700"
                  : "bg-white border-gray-200 text-gray-500"
              }`}
            >
              {t.intentPractice}
            </button>
            <button
              onClick={() => setPostIntent("share")}
              className={`flex-1 py-3 rounded-2xl text-xs font-bold border transition-all ${
                postIntent === "share"
                  ? "bg-blue-50 border-blue-400 text-blue-700"
                  : "bg-white border-gray-200 text-gray-500"
              }`}
            >
              {t.intentShare}
            </button>
          </div>
          <textarea
            className="w-full flex-1 text-xl font-medium outline-none resize-none placeholder-gray-300 text-gray-800"
            placeholder={t.postPlaceholder}
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
          />

          {selectedImage && (
            <div className="relative mb-4 w-full h-48 rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {postType === "post" && (
            <div className="text-right text-xs font-bold mb-4">
              <span
                className={
                  newPostText.trim().length < 15
                    ? "text-pink-500"
                    : "text-green-500"
                }
              >
                {newPostText.trim().length}
              </span>{" "}
              / 15
            </div>
          )}

          <div className="flex items-center gap-4 py-4 border-t border-gray-50 mt-auto">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                      const canvas = document.createElement("canvas");
                      let width = img.width;
                      let height = img.height;
                      const MAX_SIZE = 800;
                      if (width > height) {
                        if (width > MAX_SIZE) {
                          height *= MAX_SIZE / width;
                          width = MAX_SIZE;
                        }
                      } else {
                        if (height > MAX_SIZE) {
                          width *= MAX_SIZE / height;
                          height = MAX_SIZE;
                        }
                      }
                      canvas.width = width;
                      canvas.height = height;
                      const ctx = canvas.getContext("2d");
                      ctx.drawImage(img, 0, 0, width, height);
                      const compressedBase64 = canvas.toDataURL(
                        "image/jpeg",
                        0.7
                      );
                      setSelectedImage(compressedBase64);
                    };
                    img.src = event.target.result;
                  };
                  reader.readAsDataURL(file);
                }
                e.target.value = "";
              }}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 shrink-0 hover:bg-gray-100 transition-colors"
            >
              <ImageIcon className="w-6 h-6" />
            </button>
            <button
              onClick={handlePublish}
              disabled={
                postType === "post" &&
                newPostText.trim().length < 15 &&
                !selectedImage
              }
              className={`flex-1 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform text-lg ${
                postType === "story" ||
                newPostText.trim().length >= 15 ||
                selectedImage
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              <Send className="w-5 h-5" /> {t.publishBtn}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPostDetail = () => {
    if (!selectedPost) return null;
    let activeStories = [];
    let currentStoryIndex = -1;
    if (selectedPost.isStory) {
      activeStories = posts
        .filter(
          (p) =>
            p.authorId === selectedPost.authorId &&
            p.isStory &&
            Date.now() - p.timestamp < 24 * 60 * 60 * 1000
        )
        .sort((a, b) => a.timestamp - b.timestamp);
      currentStoryIndex = activeStories.findIndex(
        (p) => p.id === selectedPost.id
      );
    }

    const correctionComments = selectedPost.comments.filter(
      (c) => c.isCorrection && !c.hiddenByCommunity
    );
    const canUseAiSummary =
      selectedPost.isMine && correctionComments.length > 0;
    const isPractice = selectedPost.postIntent === "practice";
    const isNativeResponder = userProfile.native === selectedPost.lang;

    return (
      <div
        className={`flex flex-col h-full relative pb-28 ${
          isPractice ? "bg-indigo-50/20" : "bg-white"
        }`}
      >
        <header
          className={`px-6 py-4 flex items-center border-b sticky top-0 z-10 ${
            isPractice
              ? "bg-indigo-50/80 border-indigo-100 backdrop-blur-md"
              : "bg-white border-gray-50"
          }`}
        >
          <ArrowLeft
            onClick={() => {
              setCurrentView("feed");
              setSelectedPostId(null);
              setDraftText("");
              setCorrectionText("");
              setCorrectionTags([]);
            }}
            className="w-6 h-6 mr-4 cursor-pointer text-gray-600"
          />
          <span className="font-bold text-lg text-gray-800">
            {t.postDetailTitle}
          </span>
        </header>
        <div className="p-6 flex-1 overflow-y-auto">
          {selectedPost.isStory && activeStories.length > 1 && (
            <div className="flex justify-between items-center mb-4 bg-purple-50 rounded-full px-5 py-2">
              <button
                onClick={() =>
                  setSelectedPostId(activeStories[currentStoryIndex - 1].id)
                }
                disabled={currentStoryIndex === 0}
                className={`text-sm font-bold flex items-center ${
                  currentStoryIndex === 0
                    ? "text-purple-200"
                    : "text-purple-600"
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> {t.prevStory}
              </button>
              <span className="text-xs font-bold text-purple-400">
                {t.storyProgress} {currentStoryIndex + 1} /{" "}
                {activeStories.length}
              </span>
              <button
                onClick={() =>
                  setSelectedPostId(activeStories[currentStoryIndex + 1].id)
                }
                disabled={currentStoryIndex === activeStories.length - 1}
                className={`text-sm font-bold flex items-center ${
                  currentStoryIndex === activeStories.length - 1
                    ? "text-purple-200"
                    : "text-purple-600"
                }`}
              >
                {t.nextStory} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {selectedPost.isStory && (
            <div className="bg-gradient-to-r from-pink-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block shadow-sm">
              {t.storyBadge}
            </div>
          )}
          <div
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black inline-block mb-4 ${
              isPractice
                ? "bg-indigo-100 text-indigo-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {isPractice ? t.intentPractice : t.intentShare}
          </div>

          <div
            className="flex items-center mb-6 cursor-pointer"
            onClick={() => {
              setViewingProfileAuthor(selectedPost.authorId);
              setCurrentView("profile");
            }}
          >
            <StoryAvatar
              uid={selectedPost.authorId}
              className="w-12 h-12 drop-shadow-sm"
            />
            <div className="ml-3">
              <p className="font-bold text-gray-800 text-lg">
                {getUserDisplayName(selectedPost.authorId)}
              </p>
              <p className="text-xs text-gray-400">
                {getRelativeTime(selectedPost.timestamp, systemLang)}
              </p>
            </div>
          </div>

          {selectedPost.image && (
            <img
              src={selectedPost.image}
              alt="IMG"
              className="w-full rounded-3xl mb-6 border border-gray-100 object-cover max-h-[300px]"
            />
          )}
          <p className="text-xl font-medium text-gray-800 mb-6 leading-relaxed break-words whitespace-pre-wrap">
            {selectedPost.content}
          </p>

          {canUseAiSummary && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-5 mb-8 border border-indigo-100 shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10">
                <Sparkles className="w-24 h-24 text-indigo-500" />
              </div>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3">
                {t.suggestVersion}
              </p>
              {!aiSummary ? (
                <button
                  onClick={async () => {
                    if (karmaPoints < 15) {
                      showToast(t.notEnoughKarma, t.oopsTitle);
                      return;
                    }
                    const allCorrections = correctionComments
                      .map((c) => c.text)
                      .join(" / ");
                    const prompt = `這是一篇用 ${selectedPost.lang} 寫的貼文：「${selectedPost.content}」。以下是不同網友給的修改建議：${allCorrections}。請你扮演專業的雙語老師，用 ${userProfile.native} 幫我統整出一個「最自然、最正確的最終建議版本」，並簡短解釋為什麼這樣說最好。`;
                    const result = await callGemini(prompt);
                    if (!result.includes("API 連線失敗")) {
                      setAiSummary(result);
                      setKarmaPoints((k) => k - 15);
                    }
                  }}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  {isAiLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}{" "}
                  {t.aiSummaryBtn} (15 🧼)
                </button>
              ) : (
                <div className="animate-fade-in relative z-10">
                  <p className="text-indigo-900 font-bold text-sm leading-relaxed whitespace-pre-wrap">
                    {aiSummary}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-bold text-gray-800 mb-4">
              {t.commentSection} ({selectedPost.comments.length})
            </h3>
            <div className="space-y-4">
              {[...selectedPost.comments]
                .sort((a, b) => {
                  const scoreA = (a.likes || 0) - (a.dislikes || 0);
                  const scoreB = (b.likes || 0) - (b.dislikes || 0);
                  return scoreB - scoreA;
                })
                .map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <div
                      className="w-8 h-8 shrink-0 cursor-pointer"
                      onClick={() => {
                        setViewingProfileAuthor(c.authorId);
                        setCurrentView("profile");
                      }}
                    >
                      <UserAvatar
                        uid={c.authorId}
                        className="w-8 h-8 shrink-0"
                      />
                    </div>
                    <div
                      className={`rounded-2xl p-4 flex-1 border-2 ${
                        c.isCorrection
                          ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300 shadow-[0_4px_12px_rgba(16,185,129,0.15)] relative"
                          : "bg-white border-gray-100 shadow-sm relative"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span
                          className="font-bold text-sm text-gray-800 cursor-pointer"
                          onClick={() => {
                            setViewingProfileAuthor(c.authorId);
                            setCurrentView("profile");
                          }}
                        >
                          {getUserDisplayName(c.authorId)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCommentActionMenu(c.id);
                          }}
                          className="text-gray-300 hover:text-gray-500 p-1 -mr-2 -mt-2"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      {showCommentActionMenu === c.id && (
                        <>
                          <div
                            className="fixed inset-0 z-20"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCommentActionMenu(null);
                            }}
                          ></div>
                          <div className="absolute top-10 right-4 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-30 flex flex-col w-36">
                            {c.authorId === currentUserId ||
                            selectedPost.isMine ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteComment(selectedPost.id, c.id);
                                }}
                                className="flex items-center gap-2 text-sm font-bold text-red-500 p-2 hover:bg-red-50 rounded-lg text-left"
                              >
                                <Trash2 className="w-4 h-4 shrink-0" />{" "}
                                {t.deleteComment}
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReportComment(selectedPost.id, c.id);
                                  }}
                                  className="flex items-center gap-2 text-sm font-bold text-orange-500 p-2 hover:bg-orange-50 rounded-lg text-left"
                                >
                                  <Edit3 className="w-4 h-4 shrink-0" />{" "}
                                  {t.reportCommentGrammar}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReportComment(selectedPost.id, c.id);
                                  }}
                                  className="flex items-center gap-2 text-sm font-bold text-red-500 p-2 hover:bg-red-50 rounded-lg text-left mt-1"
                                >
                                  <Flag className="w-4 h-4 shrink-0" />{" "}
                                  {t.reportCommentSpam}
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}

                      {c.isCorrection &&
                        c.tags &&
                        c.tags.length > 0 &&
                        !c.hiddenByCommunity && (
                          <div className="flex flex-wrap gap-1 my-2">
                            {c.tags.includes("grammar") && (
                              <span className="bg-white text-[10px] text-green-600 font-bold px-2 py-1 rounded border border-green-200">
                                {t.tagGrammar}
                              </span>
                            )}
                            {c.tags.includes("natural") && (
                              <span className="bg-white text-[10px] text-blue-600 font-bold px-2 py-1 rounded border border-blue-200">
                                {t.tagNatural}
                              </span>
                            )}
                          </div>
                        )}

                      {c.hiddenByCommunity ? (
                        <p className="text-sm text-gray-400 italic mt-1 mb-3 bg-gray-100 p-2 rounded-lg">
                          {t.hiddenCommentText}
                        </p>
                      ) : (
                        <p
                          className={`text-sm leading-relaxed mt-1 break-words whitespace-pre-wrap mb-3 ${
                            c.isCorrection
                              ? "text-emerald-900 font-bold"
                              : "text-gray-700"
                          }`}
                        >
                          {c.text}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-2 border-t border-black/5 pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCommentReaction(
                              selectedPost.id,
                              c.id,
                              "like"
                            );
                          }}
                          className={`flex items-center gap-1 text-xs font-bold transition-transform hover:scale-110 ${
                            c.hasLiked ? "text-pink-500" : "text-gray-400"
                          }`}
                        >
                          🧴 {c.likes || 0}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCommentReaction(
                              selectedPost.id,
                              c.id,
                              "dislike"
                            );
                          }}
                          className={`flex items-center gap-1 text-xs font-bold transition-transform hover:scale-110 ${
                            c.hasDisliked ? "text-blue-500" : "text-gray-400"
                          }`}
                        >
                          🚿 {c.dislikes || 0}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 p-4 border-t flex gap-3 z-10 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] ${
            isPractice
              ? "bg-indigo-50 border-indigo-100"
              : "bg-white border-gray-50"
          }`}
        >
          <button
            onClick={() => setShowCommentModal(true)}
            className="flex-1 py-4 bg-white text-gray-600 rounded-2xl font-bold flex items-center justify-center gap-2 border border-gray-200 shadow-sm active:scale-95 transition-transform"
          >
            <MessageCircle className="w-5 h-5" /> {t.commentBtn}
          </button>

          {isPractice && (
            <button
              onClick={() => setShowCorrectionModal(true)}
              className="flex-[1.5] py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Edit3 className="w-5 h-5" /> {t.correctBtn}{" "}
              {isNativeResponder ? "(+10🧼)" : ""}
            </button>
          )}
        </div>

        {showCorrectionModal && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <div
              className="absolute inset-0 bg-transparent"
              onClick={() => {
                setShowCorrectionModal(false);
                setCorrectionText("");
                setCorrectionTags([]);
              }}
            ></div>
            <div className="w-full bg-white/95 backdrop-blur-xl rounded-t-[2.5rem] p-6 animate-slide-up z-10 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] border-t border-gray-100 flex flex-col max-h-[60%]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl">{t.correctBtn}</h3>
                <X
                  onClick={() => {
                    setShowCorrectionModal(false);
                    setCorrectionText("");
                    setCorrectionTags([]);
                  }}
                  className="text-gray-400 cursor-pointer"
                />
              </div>
              <div className="flex gap-2 mb-4">
                {[
                  { id: "grammar", label: t.tagGrammar },
                  { id: "natural", label: t.tagNatural },
                ].map((tag) => (
                  <label
                    key={tag.id}
                    className="flex-1 flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 cursor-pointer shadow-sm"
                  >
                    <div
                      className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center ${
                        correctionTags.includes(tag.id)
                          ? "bg-indigo-600 border-indigo-600"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {correctionTags.includes(tag.id) && (
                        <CheckSquare className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="font-bold text-xs text-gray-700 whitespace-nowrap">
                      {tag.label}
                    </span>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={correctionTags.includes(tag.id)}
                      onChange={() => {
                        setCorrectionTags((prev) =>
                          prev.includes(tag.id)
                            ? prev.filter((t) => t !== tag.id)
                            : [...prev, tag.id]
                        );
                      }}
                    />
                  </label>
                ))}
              </div>
              <textarea
                className="w-full bg-indigo-50/50 rounded-2xl p-4 outline-none text-indigo-900 font-medium resize-none mb-4 h-24 border border-indigo-100"
                placeholder={
                  selectedPost.postIntent === "share"
                    ? systemLang === "繁體中文"
                      ? "說點什麼..."
                      : "Say something..."
                    : t.suggestPlaceholder(selectedPost.lang)
                }
                value={correctionText}
                onChange={(e) => setCorrectionText(e.target.value)}
              />
              <button
                onClick={submitCorrection}
                disabled={!correctionText.trim()}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg disabled:opacity-50 flex justify-center items-center gap-2 shrink-0 active:scale-95 transition-transform"
              >
                {isNativeResponder
                  ? t.submitSuggestBtn
                  : t.submitSuggestBtnNoPoints}
              </button>
            </div>
          </div>
        )}

        {showCommentModal && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <div
              className="absolute inset-0 bg-transparent"
              onClick={() => {
                setShowCommentModal(false);
                setDraftText("");
              }}
            ></div>
            <div className="w-full bg-white/95 backdrop-blur-xl rounded-t-[2.5rem] p-6 animate-slide-up z-10 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] border-t border-gray-100 flex flex-col h-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl">{t.commentSection}</h3>
                <X
                  onClick={() => {
                    setShowCommentModal(false);
                    setDraftText("");
                  }}
                  className="text-gray-400 cursor-pointer"
                />
              </div>
              <textarea
                className="w-full h-24 bg-gray-50 rounded-2xl p-4 outline-none font-medium resize-none mb-4 border border-gray-200"
                placeholder={
                  selectedPost.postIntent === "share"
                    ? systemLang === "繁體中文"
                      ? "說點什麼..."
                      : "Say something..."
                    : t.commentPlaceholder(selectedPost.lang)
                }
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
              />
              <button
                onClick={handleSendComment}
                disabled={!draftText.trim()}
                className="w-full py-4 bg-gray-800 text-white rounded-2xl font-bold shadow-lg disabled:opacity-50 shrink-0 active:scale-95 transition-transform"
              >
                {t.sendBtn}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderProfile = () => {
    const profileData = isMyProfile
      ? userProfile
      : allUsersDict[viewingProfileAuthor] || {};
    const isMutual = mutualFriends.includes(viewingProfileAuthor);

    const pAge = profileData.age || "?";
    const pGender = profileData.gender || "?";
    const pIntent = profileData.intent || "casual";
    const pInterests = profileData.interests || [];
    const pHelped = profileData.helped || 0;
    const pBio = profileData.bio || t.mockBio;
    const pColorIndex = profileData.colorIndex || 0;
    const pAcc = profileData.equippedAccessory || null;

    const intentLabel = t.intents.find((i) => i.id === pIntent)?.label || "";

    const specificUserPosts = posts.filter(
      (p) =>
        (isMyProfile ? p.isMine : p.authorId === viewingProfileAuthor) &&
        !p.isStory
    );

    return (
      <div className="flex flex-col h-full bg-gray-50 pb-20 relative">
        <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-gray-100">
          {!isMyProfile ? (
            <ArrowLeft
              onClick={() => setCurrentView("feed")}
              className="w-6 h-6 cursor-pointer text-gray-600"
            />
          ) : (
            <div className="w-6" />
          )}
          <h1 className="text-lg font-bold text-gray-800">
            {isMyProfile
              ? t.myProfileTitle
              : getUserDisplayName(viewingProfileAuthor).split(" ")[0]}
          </h1>
          {!isMyProfile ? (
            <MoreHorizontal
              className="w-6 h-6 text-gray-400 cursor-pointer"
              onClick={() => setShowActionMenu("profile")}
            />
          ) : (
            <div className="w-6" />
          )}
        </header>

        {showActionMenu === "profile" && (
          <>
            <div
              className="fixed inset-0 z-20"
              onClick={() => setShowActionMenu(null)}
            ></div>
            <div className="absolute top-14 right-6 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-30 w-40">
              <button
                onClick={() => handleReportUser(viewingProfileAuthor)}
                className="w-full flex items-center gap-2 text-sm font-bold text-red-500 p-3 hover:bg-red-50 rounded-lg"
              >
                <Flag className="w-4 h-4" /> {t.reportUser}
              </button>
              <button
                onClick={() => handleBlockUser(viewingProfileAuthor)}
                className="w-full flex items-center gap-2 text-sm font-bold text-gray-600 p-3 hover:bg-gray-50 rounded-lg"
              >
                <ShieldAlert className="w-4 h-4" /> {t.blockUser}
              </button>
            </div>
          </>
        )}

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center mb-6 relative">
            {isMyProfile && !isEditingProfile && (
              <button
                onClick={() => {
                  setTempName(userProfile.name);
                  setTempBio(userProfile.bio);
                  setTempColorIndex(userProfile.colorIndex);

                  // 🌟 載入目前的設定值
                  setTempAge(userProfile.age);
                  setTempGender(userProfile.gender);
                  setTempIntent(userProfile.intent);
                  setTempInterests(userProfile.interests || []);

                  setIsEditingProfile(true);
                }}
                className="absolute top-6 right-6 text-gray-300 hover:text-purple-600 transition-colors"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            )}

            {isMyProfile && isEditingProfile ? (
              <div className="w-full flex flex-col items-center animate-fade-in">
                <MascotSVG
                  className="w-24 h-24 mb-4 drop-shadow-md"
                  baseColor={PALETTES[tempColorIndex].base}
                  strokeColor={PALETTES[tempColorIndex].stroke}
                  accessoryEmoji={
                    ACCESSORIES.find(
                      (a) => a.id === userProfile.equippedAccessory
                    )?.emoji
                  }
                />
                <div className="flex flex-wrap gap-3 justify-center mb-6 w-full px-4">
                  {PALETTES.map((p, idx) => {
                    if (!userProfile.unlockedColors.includes(idx)) return null;
                    return (
                      <button
                        key={idx}
                        onClick={() => setTempColorIndex(idx)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          tempColorIndex === idx
                            ? "border-purple-600 scale-125 shadow-sm"
                            : "border-transparent hover:scale-110"
                        }`}
                        style={{ backgroundColor: p.base }}
                      />
                    );
                  })}
                </div>
                <input
                  className="w-full text-xl font-black text-center text-purple-900 bg-purple-50 rounded-xl px-4 py-2 mb-3 outline-none focus:ring-2 focus:ring-purple-400"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  autoFocus
                />

                {/* 🌟 新增：歲數與性別編輯區塊 */}
                <div className="flex gap-3 mb-3 w-full">
                  <input
                    type="number"
                    className="w-full text-sm font-bold text-center text-purple-900 bg-purple-50 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400"
                    value={tempAge}
                    onChange={(e) => setTempAge(e.target.value)}
                    placeholder={t.agePlaceholder}
                  />
                  <select
                    className="w-full text-sm font-bold text-center text-purple-900 bg-purple-50 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400"
                    value={tempGender}
                    onChange={(e) => setTempGender(e.target.value)}
                  >
                    <option value="" disabled>
                      {t.genderPlaceholder}
                    </option>
                    <option value="M">{t.genders.M}</option>
                    <option value="F">{t.genders.F}</option>
                    <option value="O">{t.genders.O}</option>
                  </select>
                </div>

                {/* 🌟 新增：交友意願編輯區塊 */}
                <select
                  className="w-full text-sm font-bold text-center text-purple-900 bg-purple-50 rounded-xl px-4 py-2 mb-3 outline-none focus:ring-2 focus:ring-purple-400"
                  value={tempIntent}
                  onChange={(e) => setTempIntent(e.target.value)}
                >
                  {t.intents.map((intent) => (
                    <option key={intent.id} value={intent.id}>
                      {intent.label}
                    </option>
                  ))}
                </select>

                <textarea
                  className="w-full text-sm font-medium text-center text-gray-700 bg-gray-50 rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-purple-400 resize-none h-20"
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                />

                {/* 🌟 新增：興趣編輯區塊 */}
                <div className="flex flex-wrap justify-center gap-2 mb-4 w-full">
                  {INTERESTS_KEYS.map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setTempInterests((prev) =>
                          prev.includes(key)
                            ? prev.filter((i) => i !== key)
                            : [...prev, key]
                        );
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        tempInterests.includes(key)
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {t.interests[key]}
                    </button>
                  ))}
                </div>

                <button
                  onClick={async () => {
                    const newName = tempName || "User";
                    const newTag = `${newName} ${
                      userProfile.native === "繁體中文" ? "🇹🇼" : "🇺🇸"
                    }`;

                    setUserProfile((prev) => ({
                      ...prev,
                      name: newName,
                      bio: tempBio,
                      colorIndex: tempColorIndex,
                      age: tempAge,
                      gender: tempGender,
                      intent: tempIntent,
                      interests: tempInterests,
                    }));
                    setIsEditingProfile(false);

                    await setDoc(
                      doc(db, "users", currentUserId),
                      {
                        name: newName,
                        bio: tempBio,
                        colorIndex: tempColorIndex,
                        age: tempAge,
                        gender: tempGender,
                        intent: tempIntent,
                        interests: tempInterests,
                      },
                      { merge: true }
                    );

                    const myPostsToSync = posts.filter(
                      (p) =>
                        p.authorId === currentUserId ||
                        p.author === currentUserTag
                    );
                    for (let p of myPostsToSync) {
                      try {
                        await updateDoc(doc(db, "posts", p.id), {
                          authorId: currentUserId,
                          author: newTag,
                        });
                      } catch (e) {}
                    }
                  }}
                  className="w-full bg-purple-600 text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-md shadow-purple-200 active:scale-95 transition-transform mb-4"
                >
                  {t.saveBtn}
                </button>
              </div>
            ) : (
              <>
                <MascotSVG
                  className="w-24 h-24 drop-shadow-md mb-2"
                  baseColor={PALETTES[pColorIndex].base}
                  strokeColor={PALETTES[pColorIndex].stroke}
                  accessoryEmoji={ACCESSORIES.find((a) => a.id === pAcc)?.emoji}
                />
                <h2 className="text-2xl font-black text-gray-800 mt-2 mb-1">
                  {isMyProfile
                    ? userProfile.name
                    : getUserDisplayName(viewingProfileAuthor).split(" ")[0]}
                </h2>
                <div className="flex gap-2 my-2 h-6">
                  {isMyProfile || isMutual ? (
                    <>
                      <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                        {t.genders[pGender] || pGender}
                      </span>
                      <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                        {pAge} {t.ageUnit}
                      </span>
                    </>
                  ) : (
                    <span className="bg-gray-50 text-gray-400 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" /> {t.mutualUnlockHint}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4 text-center">{pBio}</p>
              </>
            )}

            {!isEditingProfile && (
              <>
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4 w-full">
                  <span className="bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400 fill-current" />{" "}
                    {t.helped} {pHelped} {t.people}
                  </span>
                  {pInterests.map((key) => (
                    <span
                      key={key}
                      className="bg-gray-50 text-gray-500 border border-gray-100 text-xs font-bold px-3 py-1.5 rounded-lg"
                    >
                      {t.interests[key] || key}
                    </span>
                  ))}
                </div>
                <div className="w-full bg-blue-50/50 border border-blue-100 rounded-xl p-3 mb-6 text-center text-xs font-bold text-blue-700">
                  {intentLabel}
                </div>
              </>
            )}

            {!isMyProfile && (
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleFollow}
                  className={`flex-[1.5] font-bold py-3.5 rounded-2xl transition-all ${
                    following.includes(viewingProfileAuthor)
                      ? "bg-gray-100 text-gray-500"
                      : "bg-purple-600 text-white shadow-md"
                  }`}
                >
                  {following.includes(viewingProfileAuthor)
                    ? t.followingBtn
                    : t.followBtn}
                </button>
                <button
                  onClick={() => {
                    if (isMutual) {
                      openChat(viewingProfileAuthor);
                      setHasUnreadMessages(false);
                    } else {
                      showToast(t.dmLocked, t.noticeTitle);
                    }
                  }}
                  className="flex-1 bg-white border-2 border-gray-100 text-gray-800 font-bold py-3.5 rounded-2xl flex justify-center items-center gap-2"
                >
                  {!isMutual && <Lock className="w-4 h-4 text-gray-300" />}{" "}
                  {t.chatTitle}
                </button>
              </div>
            )}
          </div>

          {isMyProfile && (
            <div className="space-y-4 mb-8">
              <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-[2rem] p-6 text-white shadow-lg flex justify-between items-center">
                <div>
                  <p className="text-white/80 text-xs font-bold mb-1">
                    {t.karmaTitle}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black">{karmaPoints}</span>{" "}
                    🧼
                  </div>
                </div>
                <button
                  className="bg-white/20 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm border border-white/30 active:scale-95"
                  onClick={() => setShowShopModal(true)}
                >
                  <Store className="w-4 h-4 inline mr-1 -mt-1" /> {t.shopTitle}
                </button>
              </div>
              <button
                className="w-full bg-white border border-gray-200 text-gray-700 font-bold p-4 rounded-2xl active:scale-95 transition-transform"
                onClick={() => {
                  const myPosts = posts.filter((p) => p.isMine && !p.isStory);
                  if (myPosts.length > 0) {
                    handleBoost(myPosts[0].id);
                  } else {
                    showToast(t.noPostToBoost, t.oopsTitle);
                  }
                }}
              >
                🚀 {t.boostLatestPost}
              </button>
              <button
                onClick={handleDeleteAccount}
                className="w-full bg-white border border-red-100 text-red-500 font-bold p-4 rounded-2xl flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" /> {t.deleteAccount}
              </button>
            </div>
          )}

          <div className="mt-8 mb-4">
            <h3 className="font-bold text-gray-800 text-lg mb-4 ml-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              {t.postHistory}
            </h3>
            <div className="space-y-4">
              {specificUserPosts.length > 0 ? (
                specificUserPosts.map(renderPostCard)
              ) : (
                <div className="bg-white rounded-3xl p-8 text-center text-gray-400 border border-gray-100 shadow-sm">
                  {isMyProfile ? t.emptyHistory : t.emptyHistoryOther}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 商城 Shop Modal */}
        {showShopModal && (
          <div className="absolute inset-0 bg-black/60 z-50 flex items-end">
            <div className="w-full bg-white rounded-t-[2.5rem] p-6 animate-slide-up h-[85%] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-2xl flex items-center gap-2">
                  <Store className="w-6 h-6 text-purple-600" /> {t.shopTitle}
                </h3>
                <X
                  onClick={() => setShowShopModal(false)}
                  className="text-gray-400 cursor-pointer bg-gray-100 rounded-full p-1 w-8 h-8"
                />
              </div>
              <div className="flex items-center justify-center bg-purple-50 rounded-2xl p-4 mb-6">
                <MascotSVG
                  className="w-24 h-24"
                  baseColor={PALETTES[userProfile.colorIndex].base}
                  strokeColor={PALETTES[userProfile.colorIndex].stroke}
                  accessoryEmoji={
                    ACCESSORIES.find(
                      (a) => a.id === userProfile.equippedAccessory
                    )?.emoji
                  }
                />
                <div className="ml-6 text-center">
                  <p className="text-xs text-purple-400 font-bold mb-1">
                    Karma
                  </p>
                  <p className="text-3xl font-black text-purple-600">
                    {karmaPoints} <span className="text-xl">🧼</span>
                  </p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <h4 className="font-bold text-gray-800 mb-3 ml-1">
                  {t.shopColors}
                </h4>
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {PALETTES.map((p, idx) => {
                    const isUnlocked = userProfile.unlockedColors.includes(idx);
                    const isEquipped = userProfile.colorIndex === idx;
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div
                          onClick={async () => {
                            if (isUnlocked) {
                              setUserProfile({
                                ...userProfile,
                                colorIndex: idx,
                              });
                              await updateDoc(doc(db, "users", currentUserId), {
                                colorIndex: idx,
                              });
                              showToast(t.purchaseSuccess, t.successTitle);
                            } else if (karmaPoints >= 50) {
                              setKarmaPoints((prev) => prev - 50);
                              const newUnlocks = [
                                ...userProfile.unlockedColors,
                                idx,
                              ];
                              setUserProfile({
                                ...userProfile,
                                unlockedColors: newUnlocks,
                                colorIndex: idx,
                              });
                              await updateDoc(doc(db, "users", currentUserId), {
                                unlockedColors: newUnlocks,
                                colorIndex: idx,
                              });
                              showToast(t.purchaseSuccess, t.successTitle);
                            } else {
                              showToast(t.notEnoughKarma, t.oopsTitle);
                            }
                          }}
                          className={`w-14 h-14 rounded-full border-4 cursor-pointer flex items-center justify-center transition-transform hover:scale-105 ${
                            isEquipped
                              ? "border-purple-500 shadow-md scale-110"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: p.base }}
                        >
                          {!isUnlocked && (
                            <Lock className="w-5 h-5 text-black/20" />
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 mt-2">
                          {isEquipped
                            ? t.equippedBtn
                            : isUnlocked
                            ? t.equipBtn
                            : "50 🧼"}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <h4 className="font-bold text-gray-800 mb-3 ml-1">
                  {t.shopAccessories}
                </h4>
                <div className="space-y-3 pb-6">
                  {ACCESSORIES.map((acc) => {
                    const isUnlocked = userProfile.unlockedAccessories.includes(
                      acc.id
                    );
                    const isEquipped = userProfile.equippedAccessory === acc.id;
                    return (
                      <div
                        key={acc.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl">
                            {acc.emoji}
                          </div>
                          <span className="font-bold text-gray-800">
                            {acc.name[systemLang]}
                          </span>
                        </div>
                        <button
                          onClick={async () => {
                            if (isUnlocked) {
                              const newAcc = isEquipped ? null : acc.id;
                              setUserProfile({
                                ...userProfile,
                                equippedAccessory: newAcc,
                              });
                              await updateDoc(doc(db, "users", currentUserId), {
                                equippedAccessory: newAcc,
                              });
                            } else if (karmaPoints >= acc.price) {
                              setKarmaPoints((prev) => prev - acc.price);
                              const newUnlocks = [
                                ...userProfile.unlockedAccessories,
                                acc.id,
                              ];
                              setUserProfile({
                                ...userProfile,
                                unlockedAccessories: newUnlocks,
                                equippedAccessory: acc.id,
                              });
                              await updateDoc(doc(db, "users", currentUserId), {
                                unlockedAccessories: newUnlocks,
                                equippedAccessory: acc.id,
                              });
                              showToast(t.purchaseSuccess, t.successTitle);
                            } else {
                              showToast(t.notEnoughKarma, t.oopsTitle);
                            }
                          }}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            isEquipped
                              ? "bg-purple-100 text-purple-600"
                              : isUnlocked
                              ? "bg-gray-200 text-gray-700"
                              : "bg-purple-600 text-white shadow-md"
                          }`}
                        >
                          {isEquipped
                            ? t.equippedBtn
                            : isUnlocked
                            ? t.equipBtn
                            : `${acc.price} 🧼`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderChatList = () => {
    const sortedFriends = [...mutualFriends].sort((a, b) => {
      const timeA = latestMessages[a]?.timestamp || 0;
      const timeB = latestMessages[b]?.timestamp || 0;
      return timeB - timeA;
    });

    return (
      <div className="flex flex-col h-full bg-white relative pb-20">
        <header className="px-6 py-5 flex items-center border-b border-gray-50 sticky top-0 bg-white z-10">
          <ArrowLeft
            onClick={() => setCurrentView("feed")}
            className="w-6 h-6 mr-4 cursor-pointer text-gray-600"
          />
          <span className="font-bold text-lg text-gray-800">{t.chatTitle}</span>
        </header>
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sortedFriends.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-20 text-center px-4">
              <Lock className="w-12 h-12 text-gray-200 mb-4" />
              <p className="text-gray-500 font-bold mb-2">{t.chatEmpty}</p>
              <p className="text-sm text-gray-400 whitespace-pre-line">
                {t.chatEmptyDesc}
              </p>
            </div>
          ) : (
            sortedFriends.map((uid, i) => {
              const latestMsg = latestMessages[uid];
              let previewText = t.chatUnlocked;
              if (latestMsg) {
                const isMe = latestMsg.sender === currentUserId;
                const prefix = isMe ? t.you : "";
                if (latestMsg.image) previewText = prefix + t.sentImage;
                else previewText = prefix + latestMsg.text;
              }
              const isUnread = userProfile.unreadChats?.includes(uid);

              return (
                <div
                  key={i}
                  onClick={() => openChat(uid)}
                  className="flex items-center p-4 bg-gray-50 rounded-3xl cursor-pointer hover:bg-gray-100 transition-colors relative"
                >
                  <UserAvatar uid={uid} className="w-12 h-12 shrink-0" />
                  <div className="ml-4 flex-1 overflow-hidden">
                    <h3 className="font-bold text-gray-800">
                      {getUserDisplayName(uid)}
                    </h3>
                    <p
                      className={`text-sm truncate ${
                        isUnread ? "text-gray-800 font-bold" : "text-gray-500"
                      }`}
                    >
                      {previewText}
                    </p>
                  </div>
                  {isUnread && (
                    <span className="w-3 h-3 bg-pink-500 rounded-full shrink-0 ml-2"></span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderChatRoom = () => (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white shrink-0 z-10">
        <div className="flex items-center">
          <ArrowLeft
            onClick={() => setCurrentView("chatList")}
            className="w-6 h-6 mr-4 cursor-pointer text-gray-600"
          />
          <div
            className="flex items-center cursor-pointer"
            onClick={() => {
              setViewingProfileAuthor(activeChatUser);
              setCurrentView("profile");
            }}
          >
            <UserAvatar uid={activeChatUser} className="w-10 h-10" />
            <span className="font-bold text-lg text-gray-800 ml-3">
              {getUserDisplayName(activeChatUser)}
            </span>
          </div>
        </div>
        <button onClick={() => showToast(t.featureComingSoon, t.comingSoon)}>
          <Phone className="w-5 h-5 text-gray-400 hover:text-purple-600 transition-colors" />
        </button>
      </header>

      <div
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto"
        onClick={() => setActiveReactionMsg(null)}
      >
        <div className="text-center text-xs text-gray-400 font-bold my-4">
          {t.chatUnlockedHint}
        </div>
        {chatMessages[activeChatUser]?.map((msg) => {
          const isMe = msg.sender === currentUserId;
          const targetColorIdx = allUsersDict[activeChatUser]?.colorIndex || 0;
          const pIdx = isMe ? userProfile.colorIndex : targetColorIdx;
          const bubbleColor = PALETTES[pIdx].base;
          const isDark = pIdx === 11;

          return (
            <div
              key={msg.id}
              className={`flex mb-6 relative ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {activeReactionMsg === msg.id && (
                <div
                  className={`absolute -top-12 ${
                    isMe ? "right-0" : "left-0"
                  } bg-white shadow-xl rounded-full px-3 py-2 flex gap-3 z-20 border border-gray-100 animate-slide-up`}
                >
                  {["❤️", "😂", "😮", "👍", "🙏"].map((emoji) => (
                    <span
                      key={emoji}
                      onClick={() => handleReactToMsg(msg.id, emoji)}
                      className="text-xl cursor-pointer hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              )}
              <div
                onMouseDown={() => handlePressStart(msg.id)}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
                onTouchStart={() => handlePressStart(msg.id)}
                onTouchEnd={handlePressEnd}
                className={`max-w-[75%] p-3 rounded-2xl relative select-none cursor-pointer shadow-sm ${
                  isMe ? "rounded-br-sm" : "rounded-bl-sm"
                }`}
                style={{
                  backgroundColor: bubbleColor,
                  color: isDark ? "#fff" : "#1f2937",
                }}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    className="w-full rounded-lg mb-1 cursor-pointer"
                    alt="chat"
                    onClick={() => setFullscreenImage(msg.image)}
                  />
                )}
                {msg.text && (
                  <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                    {msg.text}
                  </p>
                )}
                {msg.reaction && (
                  <div
                    className={`absolute -bottom-3 ${
                      isMe ? "left-2" : "right-2"
                    } bg-white rounded-full p-1 shadow-sm text-sm border border-gray-100`}
                  >
                    {msg.reaction}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} className="h-4 shrink-0" />
      </div>

      <div className="bg-white border-t border-gray-100 flex items-center gap-3 p-4 shrink-0 z-10 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.02)]">
        <input
          type="file"
          ref={chatFileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleSendChatImage}
        />
        <button
          onClick={() => chatFileInputRef.current.click()}
          className="text-gray-400 hover:text-purple-600 transition-colors"
        >
          <ImageIcon className="w-6 h-6" />
        </button>
        <button
          onClick={() => showToast(t.featureComingSoon, t.comingSoon)}
          className="text-gray-400 hover:text-purple-600 transition-colors"
        >
          <Mic className="w-6 h-6" />
        </button>
        <div className="flex-1 bg-gray-50 rounded-full px-4 py-3 flex items-center border border-gray-100 focus-within:border-purple-300 transition-colors">
          <input
            className="flex-1 bg-transparent outline-none text-sm text-gray-800"
            placeholder="Aa"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) =>
              !e.nativeEvent.isComposing &&
              e.key === "Enter" &&
              handleSendChatMessage()
            }
            onFocus={() => setTimeout(scrollToBottom, 300)}
            onClick={() => setTimeout(scrollToBottom, 300)}
          />
          <Send
            className="w-5 h-5 text-purple-600 cursor-pointer"
            onClick={() => handleSendChatMessage()}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans relative">
      <div className="w-[405px] h-[720px] bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden border-[12px] border-gray-800 flex flex-col">
        {/* 通知中心 */}
        {showNotifications && (
          <div className="absolute inset-0 bg-white z-[60] flex flex-col animate-slide-up">
            <header className="px-6 py-5 flex items-center border-b border-gray-50 sticky top-0 bg-white z-10">
              <ArrowLeft
                onClick={() => setShowNotifications(false)}
                className="w-6 h-6 mr-4 cursor-pointer text-gray-600"
              />
              <span className="font-bold text-lg text-gray-800">
                {t.notifications}
              </span>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {followers.filter((f) => !following.includes(f)).length === 0 &&
              myNotifications.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">
                  {t.noNotifications}
                </div>
              ) : (
                <>
                  {followers.map((fUid) => {
                    const isPending = !following.includes(fUid);
                    if (!isPending) return null;
                    return (
                      <div
                        key={fUid}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl"
                      >
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => {
                            setShowNotifications(false);
                            setViewingProfileAuthor(fUid);
                            setCurrentView("profile");
                          }}
                        >
                          <UserAvatar uid={fUid} className="w-10 h-10" />
                          <div>
                            <p className="font-bold text-sm text-gray-800">
                              {getUserDisplayName(fUid)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {t.followedYou}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              await setDoc(
                                doc(db, "users", currentUserId),
                                {
                                  following: arrayUnion(fUid),
                                },
                                { merge: true }
                              );
                              await setDoc(
                                doc(db, "users", fUid),
                                {
                                  followers: arrayUnion(currentUserId),
                                },
                                { merge: true }
                              );
                              showToast(t.followMutualSuccess, t.successTitle);
                            } catch (e) {}
                          }}
                          className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-transform"
                        >
                          {t.followBack}
                        </button>
                      </div>
                    );
                  })}

                  {myNotifications
                    .slice()
                    .reverse()
                    .map((notif) => (
                      <div
                        key={notif.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => {
                          setShowNotifications(false);
                          setSelectedPostId(notif.postId);
                          setCurrentView("postDetail");
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            uid={notif.from}
                            className="w-10 h-10 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-sm text-gray-800">
                              {getUserDisplayName(notif.from)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {notif.type === "correction"
                                ? t.correctedYourPost
                                : t.commentedYourPost}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 shrink-0 ml-2">
                          {getRelativeTime(notif.timestamp, systemLang)}
                        </span>
                      </div>
                    ))}
                </>
              )}
            </div>
          </div>
        )}

        {fullscreenImage && (
          <div
            className="absolute inset-0 bg-black/90 z-[100] flex items-center justify-center animate-fade-in"
            onClick={() => setFullscreenImage(null)}
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white z-[110]">
              <X className="w-8 h-8" />
            </button>
            <img
              src={fullscreenImage}
              className="max-w-full max-h-full object-contain p-4"
              alt="Fullscreen"
            />
          </div>
        )}

        {toastData && (
          <div className="absolute inset-0 bg-black/60 z-[100] flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white rounded-[3rem] p-8 w-full max-w-[320px] flex flex-col items-center text-center animate-slide-up shadow-2xl">
              <MascotSVG
                className="w-32 h-32 mb-4 animate-bounce"
                baseColor={PALETTES[userProfile.colorIndex].base}
                strokeColor={PALETTES[userProfile.colorIndex].stroke}
                accessoryEmoji={
                  ACCESSORIES.find(
                    (a) => a.id === userProfile.equippedAccessory
                  )?.emoji
                }
              />
              <h3 className="font-black text-2xl text-purple-600 mb-3">
                {toastData.title}
              </h3>
              <p className="text-gray-800 font-medium mb-8 leading-relaxed whitespace-pre-line text-lg">
                {toastData.text}
                {toastData.highlight && (
                  <>
                    <br />
                    <span className="text-pink-500 font-bold mt-2 inline-block">
                      {toastData.highlight}
                    </span>
                  </>
                )}
              </p>
              <button
                onClick={() => setToastData(null)}
                className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-purple-200 active:scale-95 transition-transform"
              >
                {t.gotItBtn}
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden relative">
          {currentView === "onboarding" && renderOnboarding()}
          {currentView === "feed" && renderFeed()}
          {currentView === "postDetail" && renderPostDetail()}
          {currentView === "newPost" && renderNewPost()}
          {currentView === "profile" && renderProfile()}
          {currentView === "chatList" && renderChatList()}
          {currentView === "chatRoom" && renderChatRoom()}
        </div>

        {/* Tab Bar */}
        {![
          "onboarding",
          "newPost",
          "postDetail",
          "chatList",
          "chatRoom",
        ].includes(currentView) &&
          !showNotifications && (
            <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-md border-t border-gray-100 flex justify-around items-center px-4 z-20 pb-2">
              <button
                onClick={() => setCurrentView("feed")}
                className={`flex flex-col items-center transition-colors ${
                  currentView === "feed" ? "text-purple-600" : "text-gray-400"
                }`}
              >
                <Home
                  className={`w-6 h-6 ${
                    currentView === "feed" ? "fill-purple-100" : ""
                  }`}
                />
              </button>
              <button
                onClick={() => {
                  setNewPostText("");
                  setSelectedImage(null);
                  setCurrentView("newPost");
                }}
                className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform mb-4 border-4 border-white"
              >
                <PlusCircle className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => {
                  setViewingProfileAuthor("me");
                  setCurrentView("profile");
                }}
                className={`flex flex-col items-center transition-colors ${
                  currentView === "profile" && isMyProfile
                    ? "text-purple-600"
                    : "text-gray-400"
                }`}
              >
                <User
                  className={`w-6 h-6 ${
                    currentView === "profile" && isMyProfile
                      ? "fill-purple-100"
                      : ""
                  }`}
                />
              </button>
            </nav>
          )}

        {/* 給開發者回饋懸浮按鈕 */}
        {currentView !== "onboarding" && !showNotifications && (
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="absolute bottom-24 right-4 bg-gray-800 text-white p-3 rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-30"
          >
            <MessageSquarePlus className="w-6 h-6" />
          </button>
        )}

        {/* 給開發者回饋的專屬 Modal */}
        {showFeedbackModal && (
          <div className="absolute inset-0 bg-black/60 z-[100] flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white rounded-[3rem] p-8 w-full max-w-[320px] flex flex-col items-center text-center animate-slide-up shadow-2xl relative">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              <MascotSVG
                className="w-24 h-24 mb-4 drop-shadow-md"
                baseColor={PALETTES[userProfile.colorIndex].base}
                strokeColor={PALETTES[userProfile.colorIndex].stroke}
                accessoryEmoji={
                  ACCESSORIES.find(
                    (a) => a.id === userProfile.equippedAccessory
                  )?.emoji
                }
              />
              <h3 className="font-black text-xl text-gray-800 mb-2">
                {t.feedbackTitle}
              </h3>
              <p className="text-gray-500 text-sm font-medium mb-6 leading-relaxed">
                {t.feedbackDesc}
              </p>
              <textarea
                className="w-full h-32 bg-gray-50 rounded-2xl p-4 outline-none text-gray-800 font-medium resize-none mb-4 focus:ring-2 focus:ring-purple-400 transition-all"
                placeholder={t.feedbackPlaceholder}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
              <button
                onClick={handleSendFeedback}
                disabled={!feedbackText.trim()}
                className="w-full py-3 bg-gray-800 text-white rounded-2xl font-bold shadow-lg disabled:opacity-50 active:scale-95 transition-transform"
              >
                {t.feedbackSubmit}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
      `}</style>
    </div>
  );
}
