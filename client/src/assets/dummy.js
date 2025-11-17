import { Eraser, FileText, Hash, Image, Scissors, SquarePen } from "lucide-react";


export const AiToolsData = [
  {
    title: 'AI Article Writer',
    description: 'Generate high-quality, engaging articles on any topic with our AI writing technology.',
    Icon: SquarePen,
    bg: { from: "#3588F2", to: "#0BB0D7" },
    path: '/ai/write-article'
  },
  {
    title: 'Blog Title Generator',
    description: 'Generate high-quality, engaging articles on any topic with our AI writing technology.',
    Icon: Hash,
    bg: { from: "#B153EA", to: "#E549A3" },
    path: '/ai/blog-titles'
  },
  {
    title: 'AI Image Generator',
    description: 'Generate high-quality, engaging articles on any topic with our AI writing technology.',
    Icon: Image,
    bg: { from: "#20C363", to: "#11B97E" },
    path: '/ai/generate-images'
  },
  {
    title: 'Background Removal',
    description: 'Generate high-quality, engaging articles on any topic with our AI writing technology.',
    Icon: Eraser,
    bg: { from: "#F76C1C", to: "#F04A3C" },
    path: '/ai/remove-background'
  },
  {
    title: 'Object Removal',
    description: 'Generate high-quality, engaging articles on any topic with our AI writing technology.',
    Icon: Scissors,
    bg: { from: "#5C6AF1", to: "#427DF5" },
    path: '/ai/remove-object'
  },
  {
    title: 'Resume Reviewer',
    description: 'Generate high-quality, engaging articles on any topic with our AI writing technology.',
    Icon: FileText,
    bg: { from: "#12B7AC", to: "#08B6CE" },
    path: '/ai/review-resume'
  },
];


export const dummyCreationdata = [
  {
    id: 1,
    title: 'Logo Design',
    type: 'graphic',
    createdAt: '2025-11-01T10:30:00Z',
    status: 'completed',
    content:'efiuwef uehiuewuh iwehihw dhweid hid iwhd ihwdhiwhdi eidhwei hdiwhidwiheiw hi',
  },
  {
    id: 2,
    title: 'Social Media Banner',
    type: 'graphic',
    createdAt: '2025-11-03T14:15:00Z',
    status: 'in-progress',
    content:'efiuwef uehiuewuh iwehihw dhweid hid iwhd ihwdhiwhdi eidhwei hdiwhidwiheiw hi',
  },
  {
    id: 3,
    title: 'Landing Page Copy',
    type: 'text',
    createdAt: '2025-11-05T09:00:00Z',
    status: 'completed',
    content:'efiuwef uehiuewuh iwehihw dhweid hid iwhd ihwdhiwhdi eidhwei hdiwhidwiheiw hi',
  },
  {
    id: 4,
    title: 'Product Promo Video',
    type: 'video',
    createdAt: '2025-11-07T16:45:00Z',
    status: 'draft',
    content:'efiuwef uehiuewuh iwehihw dhweid hid iwhd ihwdhiwhdi eidhwei hdiwhidwiheiw hi',
  },
  {
    id: 5,
    title: 'Email Campaign',
    type: 'text',
    createdAt: '2025-11-10T11:20:00Z',
    status: 'completed',
    content:'efiuwef uehiuewuh iwehihw dhweid hid iwhd ihwdhiwhdi eidhwei hdiwhidwiheiw hi',
  }
];

// dummy.js in the assets folder

export const dummyCommunity = [
  {
    id: 'c1',
    content: '/gradientBackground.jpg', // Replace with real image URLs
    prompt: 'A futuristic city skyline at sunset, cyberpunk aesthetic.',
    likes: ['user_2aX3X5B2', 'user_7yZ9Z0C9'], // Array of user IDs who liked it
  },
  {
    id: 'c2',
    content:'/gradientBackground.jpg',
    prompt: 'A photorealistic portrait of a golden retriever wearing a tiny crown.',
    likes: [], // No likes yet, or empty array
  },
  {
    id: 'c3',
    content: '/gradientBackground.jpg',
    prompt: 'Abstract watercolor splash with neon pink and electric blue.',
    likes: ['user_1bY4Y6D3', 'user_2aX3X5B2', 'user_7yZ9Z0C9'],
  },
  {
    id: 'c4',
    content: '/gradientBackground.jpg',
    prompt: 'A minimalist scene of a single mountain peak shrouded in fog.',
    likes: ['user_1bY4Y6D3'],
  },
];