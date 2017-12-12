// a form that includes a text input and a submit button
// listens for the submit
// creates an API query using the text input
// SAMPLE REQUEST
// https://www.googleapis.com/youtube/v3/search?part=snippet&q=calisthenics&type=video&key=AIzaSyCbPOEs1xm4D_cEvM8BDSfrYJMcRJirqfg

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_API_KEY = 'AIzaSyCbPOEs1xm4D_cEvM8BDSfrYJMcRJirqfg';
let SEARCH_TERM = "";
let PREVIOUS_PAGE = "";
let NEXT_PAGE = "";


function getDataFromApi(pageID, callback) {
  const query = {
    part: 'snippet',
    q: `${SEARCH_TERM}`,
    type: 'video',
    key: `${YOUTUBE_API_KEY}`
  }
  // if a pageID was provided (next or previous clicks), insert it into the query string
  if (pageID !== ""){
    query.pageToken = pageID;
  };
  // console.log(query);
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function renderResult(result) {
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
  //Insert here a line with number of results found, results listed, and button to go to previous or next page
  
  PREVIOUS_PAGE = data.prevPageToken;
  NEXT_PAGE = data.nextPageToken;
  console.log(`${PREVIOUS_PAGE}`);
  const resultsText = `
    <div>
      <h3>${data.pageInfo.totalResults} Results Found</h3>
      <button class="js-previous-results">\<\< Previous ${data.pageInfo.resultsPerPage} Results</button>
      <button class="js-next-results">Next ${data.pageInfo.resultsPerPage} Results\>\></button>
    </div>
    `;
  const results = resultsText + data.items.map((item, index) => renderResult(item));
  $('.js-search-results').html(results);

}


function watchPrevious(){
  $('.js-search-results').on('click', '.js-previous-results', event => {
    event.preventDefault();
    getDataFromApi(PREVIOUS_PAGE, displayYouTubeSearchData);
    });
}


function watchNext(){
  $('.js-search-results').on('click', '.js-next-results', event => {
    event.preventDefault();
    getDataFromApi(NEXT_PAGE, displayYouTubeSearchData);
    });
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const pageID = undefined;
    SEARCH_TERM = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(pageID, displayYouTubeSearchData);
  });
}

$(watchSubmit);
$(watchPrevious);
$(watchNext);