// a form that includes a text input and a submit button
// listens for the submit
// creates an API query using the text input
// SAMPLE REQUEST
// https://www.googleapis.com/youtube/v3/search?part=snippet&q=calisthenics&type=video&key=AIzaSyCbPOEs1xm4D_cEvM8BDSfrYJMcRJirqfg

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_API_KEY = 'AIzaSyCbPOEs1xm4D_cEvM8BDSfrYJMcRJirqfg';

function getDataFromApi(searchTerm, callback) {
  const query = {
    part: 'snippet',
    q: `${searchTerm}`,
    // per_page: 5,
    type: 'video',
    key: `${YOUTUBE_API_KEY}`
  }
  console.log(query);
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function renderResult(result) {
  console.log(`${result.snippet.channelId}`);
  return `
    <div>
      <h2>
      <a class="js-result-name" href="https://www.youtube.com/watch?v=${result.id.videoId}" target="_blank">${result.snippet.title}</a>
      </h2>
      <h3>
      <a class="js-result-channel" href="https://www.youtube.com/channel/${result.snippet.channelId}" target="_blank">${result.snippet.channelTitle}</a>
      </h3>
      <a class="js-result-thumbnail" href="https://www.youtube.com/watch?v=${result.id.videoId}" target="_blank"><img src="${result.snippet.thumbnails.medium.url}" alt='video thumbnail'></a>
    </div>
  `;
}

function displayYouTubeSearchData(data) {
  const results = data.items.map((item, index) => renderResult(item));
  $('.js-search-results').html(results);
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, displayYouTubeSearchData);
  });
}

$(watchSubmit);