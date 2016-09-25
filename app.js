/**
 * https://developer.mozilla.org/en/docs/Web/API/Fetch_API
 *
 * Using the fetch API and the following URL
 * http://gateway.marvel.com/v1/public/comics?apikey=fc67721c305c84f50f7c6646c9b8d9d0
 * do the following things:
 *
 * I've imported lodash for you, but please do not use any other
 * libraries
 *
 * Use as much ES2015 as you can, the only browser you need to support
 * is the latest version of Chrome
 *
 * 1. Fetch the data
 * 2. Filter the data so that it only includes comics with less than
 *    100 pages
 * 3. Filter the data so that it only includes comics that cost less
 *    than 4 dollars
 * 4. Display the title and first image for each comic
 * 5. Add a link to the detail page for the comic to the title and
 *    image
 * 6. Rewrite the code to use XMLHttpRequest and Promises instead
 *    of the fetch API
 * 7. Rewrite the code to use a more functional style using lodash/fp.
 *    Please speak to me before attempting this
 */

/* Utilities */

const log = (value) => {
  console.log(value);
  return value;
};

const prop = R.prop;

const gt = R.gt;

const nth = R.nth;

const compose = R.compose;

const map = R.map;

const filter = R.filter;

const join = R.join;

const getPath = prop('path');

const getExtension = prop('extension');

const getPrice = prop('price');

const getPrices = prop('prices');

const getUrl = prop('url');

const getUrls = prop('urls');

const getTitle = prop('title');

const getResults = prop('results');

const getImages = prop('images');

const getData = prop('data');

const getPageCount = prop('pageCount');

const getFirst = nth(0);

const lt100 = gt(100);

const lt4 = gt(4);

const getFirstImage = compose(getFirst, getImages);

const responseToJSON = (response) => response.json();

/* Application */

const dataSource =
  'http://gateway.marvel.com/v1/public/comics?apikey=fc67721c305c84f50f7c6646c9b8d9d0';

const mountPoint = document.getElementById('comics');

const template = _.template(`
  <% _.each(comics, (comic) => { %>
    <ul>
      <li>
        <a href="<%= comic.url %>">
          <%= comic.title %>
          <img src="<%= comic.image %>">
        </a>
      </li>
    </ul>
  <% }); %>
`);

const getComicsFromResponse = compose(getResults, getData);

const getComicPrice = compose(getPrice, getFirst, getPrices);

const getComicUrl = compose(getUrl, getFirst, getUrls);

const getComicPath = compose(getPath, getFirstImage);

const getComicExtension = compose(getExtension, getFirstImage);

const getComicTemplateData = (comic) => ({
  url: getComicUrl(comic),
  title: getTitle(comic),
  image: join('.', [
    getComicPath(comic),
    getComicExtension(comic)
  ])
});

const prepareComicsForDisplay = map(getComicTemplateData);

const getLt100Pages = filter(compose(lt100, getPageCount));

const getLt4Dollars = filter(compose(lt4, getComicPrice));

const displayComics = (mountPoint, template, comics) =>
  mountPoint.innerHTML = template({ comics });

const parseResponse = compose(getComicsFromResponse, responseToJSON);

const filterComics = compose(getLt4Dollars, getLt100Pages);

const renderComics = compose(
  displayComics.bind(null, mountPoint, template),
  prepareComicsForDisplay
);

fetch(dataSource)
  .then(parseResponse)
  .then(filterComics)
  .then(renderComics);
