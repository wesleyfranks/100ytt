const fs = require('fs');

// Function to generate random titles
function generateRandomTitle() {
  const adjectives = [
    'Amazing',
    'Incredible',
    'Exciting',
    'Unbelievable',
    'Fantastic',
    'Hilarious',
    'Heartwarming',
    'Jaw-dropping',
    'Inspirational',
  ];
  const topics = [
    'Adventure',
    'Journey',
    'Challenge',
    'Story',
    'Tutorial',
    'Discovery',
    'Experience',
    'Experiment',
    'Lesson',
  ];
  const endings = [
    'You Need to See!',
    'That Changed My Life',
    'You Won’t Believe!',
    'For Beginners',
    'in Under 10 Minutes',
    'Gone Wrong',
    'Worth Watching!',
    'That Made Me Laugh',
    'To Brighten Your Day',
  ];

  // Randomly pick one from each array
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const ending = endings[Math.floor(Math.random() * endings.length)];

  // Combine to form a title
  return `${adjective} ${topic} ${ending}`;
}

// Function to generate fake video data
function generateFakeVideos() {
  const videoCount = Math.floor(Math.random() * 100) + 1; // Random number between 1 and 100
  const videos = [];
  const startDate = new Date('2024-12-31T00:00:00Z').getTime(); // Start date
  const endDate = new Date('2025-03-31T23:59:59Z').getTime(); // End date

  for (let i = 1; i <= videoCount; i++) {
    const videoId = Math.random().toString(36).substr(2, 11); // Random 11-character string

    // Generate a random date between startDate and endDate
    const randomDate = new Date(
      startDate + Math.random() * (endDate - startDate)
    ).toISOString();

    // Generate a random title
    const title = generateRandomTitle();

    videos.push({
      id: { videoId: videoId },
      snippet: {
        title: title,
        publishedAt: randomDate, // Random date within range
        thumbnails: {
          medium: {
            url: `https://i9.ytimg.com/vi/2a1iLOxj0rg/mqdefault.jpg?sqp=CKSi17sG-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGHIgVChCMA8=&rs=AOn4CLB9rK9hZ80cpgw-s7fNBJefhkJmeQ`,
          },
        },
      },
    });
  }
  return videos;
}

// Generate fake videos
const fakeVideos = generateFakeVideos();

// Write to a JSON file
fs.writeFileSync('./public/videos.json', JSON.stringify(fakeVideos, null, 2), 'utf-8');

console.log(
  `Fake JSON data with ${fakeVideos.length} videos has been generated and saved to public/videos.json`
);