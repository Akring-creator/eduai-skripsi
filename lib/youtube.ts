import axios from 'axios';
import { YoutubeTranscript } from 'youtube-transcript';

export const searchYoutube = async (searchQuery: string) => {
  searchQuery = encodeURIComponent(searchQuery);

  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`
    );
    const videoId = data.items[0].id.videoId;

    return videoId;
  } catch (error) {
    console.log('[YOUTUBE_SEARCH_ERROR] ' + error);
    return null;
  }
};

export async function getTranscript(videoId: string) {
  try {
    let transcript_arr = await YoutubeTranscript.fetchTranscript(videoId);
    let transcript = '';
    for (let t of transcript_arr) {
      transcript += t.text + ' ';
    }
    return transcript.replaceAll('\n', '');
  } catch (error) {
    console.log('[YOUTUBE_TRANSCRIPT_ERROR] ' + error);
    return '';
  }
}
