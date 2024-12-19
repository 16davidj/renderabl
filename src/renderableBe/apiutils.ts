// Fetch a picture URL from Google Custom Image Search API
// @query: the query to search for
// @ratio: the aspect ratio the picture must satisfy
export async function getPictureUrl(query : string, ratio: number) : Promise<string> {
    try {
      const CX = '70fc0f5d68c984853';
      const FILE_TYPE = 'jpg';
      const googleApiUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${CX}&q=${query}&searchType=image&num=5&fileType=${FILE_TYPE}`;
      // Use fetch to call the Google API
      const response = await fetch(googleApiUrl);
      if (!response.ok) {
        throw new Error(`Google API error: ${response.statusText}`);
      }
      const data = await response.json();
      for (const item of data.items) {
        if (item.link && item.image.width > 0 && item.image.height > 0) {
          const aspectRatio = item.image.width / item.image.height;
          if (aspectRatio >= ratio) {
            return item.link
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data from Google API:', error);
      return "";
    }
}

// Fetch a youtube video id from YouTube V3 Data API
// @query: query to search for
export async function getYouTubeVodId(query : string) : Promise<string> {
    try {
        const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?key=${process.env.GOOGLE_API_KEY}&part=snippet&q=${query}&maxResults=5`;
        const response = await fetch(youtubeApiUrl);
        if (!response.ok) {
        throw new Error(`YouTube API error: ${response.statusText}`);
        }
        const data = await response.json();
        for (const item of data.items) {
        if (item.id && item.id.videoId) {
            return item.id.videoId;
        }
        }
    } catch (error) {
        console.error('Error fetching data from YouTube V3 Data API:', error);
        return "";
    }
}