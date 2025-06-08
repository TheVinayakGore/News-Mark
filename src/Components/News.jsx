import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const itemsPerPage = 25;

  // Use a more reliable query term (avoid "tesla" which might be too restrictive)
  const apiKey = import.meta.env.VITE_API_KEY;
  const url = `https://newsapi.org/v2/top-headlines?category=technology&language=en&apiKey=${apiKey}`;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging

        if (data.status === "ok" && data.articles) {
          // Less restrictive filtering - only require title and url
          const filteredArticles = data.articles.filter(
            (article) => article.title && article.url
          );

          console.log("Filtered Articles:", filteredArticles); // Debugging

          setArticles(filteredArticles);
          setDisplayedArticles(filteredArticles.slice(0, itemsPerPage));
        } else {
          setError(data.message || "No news data found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [url]);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleString();
  };

  const handleLoadMore = () => {
    const nextPageArticles = articles.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );
    setDisplayedArticles((prevArticles) => [
      ...prevArticles,
      ...nextPageArticles,
    ]);
    setCurrentPage((prevPage) => prevPage + 1);
  };

  if (loading) return;
  <div className="flex items-center justify-center m-auto p-20 w-full h-screen">
    <Spinner />
  </div>;
  if (error) return <p className="text-center text-red-500">Error : {error}</p>;

  return (
    <div className="w-full min-h-screen flex flex-col justify-between">
      <main className="pt-20">
        <h1 className="text-3xl md:text-6xl font-bold text-center mb-10 md:mb-20">
          📰 Latest News
        </h1>
        {displayedArticles.length === 0 && !loading ? (
          <p className="text-center">
            No articles found. Try refreshing the page.
          </p>
        ) : (
          <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedArticles.map((article, index) => (
                <li
                  key={`${article.url}-${index}`} // More unique key
                  className="flex flex-col justify-between border rounded-lg hover:shadow-xl hover:scale-[1.02] transition-transform overflow-hidden h-auto"
                >
                  <div className="h-60 sm:h-72 md:h-80 overflow-hidden">
                    <img
                      src={
                        article.urlToImage ||
                        "https://via.placeholder.com/400x200?text=No+Image"
                      }
                      alt={article.title || "News image"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x200?text=Image+Not+Available";
                      }}
                    />
                  </div>
                  <div className="flex flex-col text-base text-gray-600 p-4 overflow-hidden">
                    <h2 className="text-base lg:text-lg font-semibold text-black mb-2 line-clamp-2">
                      {article.title || "No title available"}
                    </h2>
                    <p className="mb-2 text-xs lg:text-sm line-clamp-3">
                      <span className="font-medium">📝 Description:</span>{" "}
                      {article.description || "No description available"}
                    </p>
                    <p className="mb-2 text-xs lg:text-sm">
                      <span className="font-medium">✍️ Author:</span>{" "}
                      {article.author || "Unknown"}
                    </p>
                    <p className="text-xs lg:text-sm">
                      <span className="font-medium">📅 Published:</span>{" "}
                      {formatDate(article.publishedAt)}
                    </p>
                  </div>
                  <Link
                    to={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="m-4 text-sm sm:text-base leading-6 border border-black hover:text-black text-white bg-black hover:bg-white p-2 sm:p-3 text-center rounded-md hover:scale-105 transition-transform"
                  >
                    Read more
                  </Link>
                </li>
              ))}
            </ul>

            {/* Load More Button */}
            {displayedArticles.length < articles.length && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleLoadMore}
                  className="flex items-center justify-center py-2 px-5 bg-blue-500 text-white hover:bg-blue-600 rounded-md hover:scale-105 transition-transform w-36"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default News;
