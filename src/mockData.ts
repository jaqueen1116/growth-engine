import type { Registration, DailyActivity, ChannelStat, AcquisitionChannel } from './types';

// Exactly 348 registrations planned across 5 days:
// WhatsApp student groups: 112
// Student ambassadors and referrals: 98
// College clubs and coding communities: 62
// College placement and technical communities: 42
// Small targeted paid promotions: 21
// Email outreach: 13
// Total = 112 + 98 + 62 + 42 + 21 + 13 = 348

// Budget Allocation (strictly capped at ₹2,000):
// WhatsApp student groups: ₹300 (Spent: ₹220)
// Student ambassadors and referrals: ₹500 (Spent: ₹350)
// College clubs and coding communities: ₹400 (Spent: ₹280)
// College placement and technical communities: ₹200 (Spent: ₹140)
// Small targeted paid promotions: ₹450 (Spent: ₹380)
// Email outreach: ₹150 (Spent: ₹90)
// Allocated: 300 + 500 + 400 + 200 + 450 + 150 = ₹2,000
// Spent: 220 + 350 + 280 + 140 + 380 + 90 = ₹1,460

export const CHANNEL_CONFIG: Record<
  AcquisitionChannel,
  { shortName: string; color: string; budgetAllocated: number; budgetSpent: number; plannedCount: number }
> = {
  'WhatsApp student groups': {
    shortName: 'WhatsApp Groups',
    color: '#22c55e',
    budgetAllocated: 300,
    budgetSpent: 220,
    plannedCount: 112,
  },
  'Student ambassadors and referrals': {
    shortName: 'Ambassadors / Viral',
    color: '#3b82f6',
    budgetAllocated: 500,
    budgetSpent: 350,
    plannedCount: 98,
  },
  'College clubs and coding communities': {
    shortName: 'Tech Clubs',
    color: '#a855f7',
    budgetAllocated: 400,
    budgetSpent: 280,
    plannedCount: 62,
  },
  'College placement and technical communities': {
    shortName: 'Placement Groups',
    color: '#f97316',
    budgetAllocated: 200,
    budgetSpent: 140,
    plannedCount: 42,
  },
  'Small targeted paid promotions': {
    shortName: 'Paid Meta/IG Ads',
    color: '#ec4899',
    budgetAllocated: 450,
    budgetSpent: 380,
    plannedCount: 21,
  },
  'Email outreach': {
    shortName: 'Email Campaign',
    color: '#06b6d4',
    budgetAllocated: 150,
    budgetSpent: 90,
    plannedCount: 13,
  },
};

export const INITIAL_CHANNEL_STATS: ChannelStat[] = (
  Object.keys(CHANNEL_CONFIG) as AcquisitionChannel[]
).map(name => ({
  name,
  shortName: CHANNEL_CONFIG[name].shortName,
  registrations: CHANNEL_CONFIG[name].plannedCount,
  budgetAllocated: CHANNEL_CONFIG[name].budgetAllocated,
  budgetSpent: CHANNEL_CONFIG[name].budgetSpent,
  color: CHANNEL_CONFIG[name].color,
}));

// Deterministic seed generation guaranteeing exact channel counts and day sums
export function generateBaselineRegistrations(): Registration[] {
  const colleges = [
    'BMS College of Engineering, Bengaluru',
    'JNTU College of Engineering, Hyderabad',
    'GITAM Deemed University, Vizag',
    'CUSAT, Kochi',
    'College of Engineering, Pune (COEP)',
    'Delhi Technological University (DTU)',
    'PSG College of Technology, Coimbatore',
    'CBIT, Hyderabad',
    'NIT Raipur',
    'Nirma University, Ahmedabad',
    'Heritage Institute of Technology, Kolkata',
    'Thapar Institute, Patiala',
    'RV College of Engineering, Bengaluru',
    'KIIT University, Bhubaneswar',
    'SRM Institute of Science and Technology, Chennai',
    'Vellore Institute of Technology (VIT)',
    'Manipal Institute of Technology (MIT)',
    'PES University, Bengaluru',
    'VJTI, Mumbai',
    'Siddaganga Institute of Technology, Tumkur',
  ];

  const firstNames = [
    'Aarav', 'Pooja', 'Karthik', 'Sneha', 'Rohan', 'Ananya', 'Sai', 'Divya', 'Manish', 'Meera',
    'Aditya', 'Neha', 'Vikas', 'Shreya', 'Harsh', 'Arjun', 'Tanvi', 'Rahul', 'Ishaan', 'Rhea',
    'Abhishek', 'Kavya', 'Siddharth', 'Bhavya', 'Tarun', 'Aniket', 'Deepika', 'Varun', 'Ritu',
    'Pranav', 'Nisha', 'Gautam', 'Swati', 'Harish', 'Preeti', 'Manoj', 'Simran', 'Akash', 'Shruti', 'Naveen'
  ];

  const lastNames = [
    'Sharma', 'Reddy', 'Varma', 'Nair', 'Deshmukh', 'Gupta', 'Teja', 'Iyer', 'Kumar', 'Patel',
    'Sen', 'Chawla', 'Rao', 'Roy', 'Vardhan', 'Mehta', 'Joshi', 'Kulkarni', 'Bhat', 'Das'
  ];

  const ambassadors = ['POOJA88', 'AARAV42', 'ROHAN55', 'SNEHA19', 'ANANYA07'];

  // Prepare exact quota of registrations per channel
  const channelsQuota: { channel: AcquisitionChannel; count: number }[] = [
    { channel: 'WhatsApp student groups', count: 112 },
    { channel: 'Student ambassadors and referrals', count: 98 },
    { channel: 'College clubs and coding communities', count: 62 },
    { channel: 'College placement and technical communities', count: 42 },
    { channel: 'Small targeted paid promotions', count: 21 },
    { channel: 'Email outreach', count: 13 },
  ];

  const flatChannelList: AcquisitionChannel[] = [];
  channelsQuota.forEach(q => {
    for (let i = 0; i < q.count; i++) {
      flatChannelList.push(q.channel);
    }
  });

  // Deterministic shuffle of flat list across days
  // Day distribution: Day 1: 42, Day 2: 58, Day 3: 71, Day 4: 86, Day 5: 91 = 348 total
  const dayDistribution = [
    { day: 1, count: 42, date: '2026-10-22' },
    { day: 2, count: 58, date: '2026-10-23' },
    { day: 3, count: 71, date: '2026-10-24' },
    { day: 4, count: 86, date: '2026-10-25' },
    { day: 5, count: 91, date: '2026-10-26' },
  ];

  const results: Registration[] = [];
  let channelIdx = 0;

  dayDistribution.forEach(({ day, count, date }) => {
    for (let i = 0; i < count; i++) {
      const globalId = channelIdx + 1;
      const ch = flatChannelList[channelIdx % flatChannelList.length];
      channelIdx++;

      const fn = firstNames[(globalId * 3) % firstNames.length];
      const ln = lastNames[(globalId * 7) % lastNames.length];
      const col = colleges[(globalId * 5) % colleges.length];
      const refCode = `${fn.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5)}${10 + (globalId % 90)}`;

      // Assign referrer for ambassadors channel or 1 in every 3 WhatsApp entries
      let refBy: string | undefined = undefined;
      if (ch === 'Student ambassadors and referrals') {
        refBy = ambassadors[globalId % ambassadors.length];
      } else if (globalId % 4 === 0) {
        refBy = ambassadors[(globalId * 2) % ambassadors.length];
      }

      const hour = 9 + (globalId % 12);
      const min = (globalId * 7) % 60;
      const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:00Z`;

      results.push({
        id: `reg-${globalId.toString().padStart(3, '0')}`,
        name: `${fn} ${ln}`,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}${globalId}@student.edu`,
        college: col,
        gradYear: '2027',
        whatsapp: globalId % 2 === 0 ? `98${(10000000 + globalId * 9876).toString().slice(0, 8)}` : undefined,
        referralCode: refCode,
        referredBy: refBy,
        channel: ch,
        createdAt: `${date}T${timeStr}`,
        dayOfCampaign: day,
      });
    }
  });

  return results;
}

export const CAMPAIGN_ACTIVITIES: DailyActivity[] = [
  {
    id: 'act-1',
    day: 1,
    dateStr: 'Day 1 (Mon)',
    title: 'Campus Ambassador Kickoff & Club Outreach',
    channel: 'College clubs and coding communities',
    description: 'Shared workshop flyer and custom referral links with 18 student leads across top Tier-2/3 engineering colleges.',
    registrationsGained: 42,
    spendToday: 250,
    status: 'Completed',
  },
  {
    id: 'act-2',
    day: 2,
    dateStr: 'Day 2 (Tue)',
    title: 'WhatsApp Batch Broadcast & Placement Wing Notice',
    channel: 'WhatsApp student groups',
    description: 'Circulated 1-click WhatsApp message in 35 unmoderated final-year discussion groups & unofficial placement circles.',
    registrationsGained: 58,
    spendToday: 180,
    status: 'Completed',
  },
  {
    id: 'act-3',
    day: 3,
    dateStr: 'Day 3 (Wed)',
    title: 'Mini Targeted Instagram/Meta Story Boost',
    channel: 'Small targeted paid promotions',
    description: 'Ran hyper-targeted carousel ad targeting B.Tech CSE/IT 4th-year students (Age 20-22) in Hyderabad, Bengaluru & Pune.',
    registrationsGained: 71,
    spendToday: 380,
    status: 'Completed',
  },
  {
    id: 'act-4',
    day: 4,
    dateStr: 'Day 4 (Thu)',
    title: 'Referral Incentive Sprint ("Invite 3 Friends, Unlock AI Pack")',
    channel: 'Student ambassadors and referrals',
    description: 'Launched peer referral leaderboard incentive: free GitHub prompt library & resume template for students with 3+ referrals.',
    registrationsGained: 86,
    spendToday: 240,
    status: 'Completed',
  },
  {
    id: 'act-5',
    day: 5,
    dateStr: 'Day 5 (Fri - Today)',
    title: 'College Tech Societies & Discord Server Blitz',
    channel: 'College placement and technical communities',
    description: 'Partnered with student chapters for co-announcements; midday email push to past hackathon participants.',
    registrationsGained: 91,
    spendToday: 410,
    status: 'In Progress',
  },
  {
    id: 'act-6',
    day: 6,
    dateStr: 'Day 6 (Sat)',
    title: 'Pre-Event Reminder & "Only 50 Spots Left" Scarcity Nudge',
    channel: 'WhatsApp student groups',
    description: 'Automated follow-up in WhatsApp groups with countdown timer and preview of the project code preview.',
    registrationsGained: 85,
    spendToday: 300,
    status: 'Upcoming',
  },
  {
    id: 'act-7',
    day: 7,
    dateStr: 'Day 7 (Sun - Workshop Day)',
    title: 'Final 2-Hour Urgency Broadcast & Live Room Join Link',
    channel: 'Email outreach',
    description: 'Final WhatsApp ping + calendar invite push 2 hours before the 60-minute hands-on build session.',
    registrationsGained: 67,
    spendToday: 240,
    status: 'Upcoming',
  },
];
