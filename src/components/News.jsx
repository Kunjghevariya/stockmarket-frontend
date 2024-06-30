import React from 'react';
import stockMarketNews from './data';

const News = () => {
  const NewsItem = ({ headline, content, source, date }) => (
    <div className="news-item bg-white p-4 m-2 rounded shadow-md w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
      <h2 className="font-bold text-lg">{headline}</h2>
      <p className="text-md">{content}</p>
      <hr className="my-2" />
      <p className="text-sm text-gray-600">{source}</p>
      <p className="text-sm text-gray-600">{date}</p>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center m-4">
      {stockMarketNews.map((news) => (
        <NewsItem
          key={news.id}
          headline={news.headline}
          content={news.content}
          source={news.source}
          date={news.date}
          tickers={news.tickers}
        />
      ))}
    </div>
  );
};

export default News;
