import React, { useEffect, useState } from "react";
import apiFetch from "../utils/api";

const News = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiFetch("/api/v1/news");
        if (mounted && data?.articles) {
          setArticles(data.articles);
        }
      } catch (err) {
        console.error("News fetch error:", err);
      }
    })();

    return () => (mounted = false);
  }, []);

  const NewsItem = ({ article }) => (
    <div className="news-item bg-white p-4 m-2 rounded shadow-md w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
      <img
        src={article.urlToImage || "/placeholder-news.jpg"}
        alt=""
        className="rounded mb-2 w-full h-40 object-cover"
      />
      <h2 className="font-bold text-lg">{article.title}</h2>
      <p className="text-md">{article.description}</p>
      <hr className="my-2" />
      <p className="text-sm text-gray-600">{article.source?.name}</p>
      <p className="text-sm text-gray-600">
        {new Date(article.publishedAt).toLocaleString()}
      </p>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center m-4">
      {articles.map((article, i) => (
        <NewsItem key={i} article={article} />
      ))}
    </div>
  );
};

export default News;
