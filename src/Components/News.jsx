import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import { FaRegSquareCaretRight } from "react-icons/fa6";
import { FaRegCaretSquareLeft } from "react-icons/fa";

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const apiKey = import.meta.env.VITE_API_KEY;
  const url = `https://api.currentsapi.services/v1/latest-news?language=hi&apiKey=${apiKey}`;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.news) {
          const filteredArticles = data.news.filter((article) => article.image);
          setArticles(filteredArticles);
        } else {
          setError("No news data found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [url]);

  const formatDate = (dateString) => {
    return dateString.split(" +")[0];
  };

  const indexOfLastArticle = currentPage * itemsPerPage;
  const indexOfFirstArticle = indexOfLastArticle - itemsPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const handleNextPage = () => {
    if (currentPage < Math.ceil(articles.length / itemsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 w-full min-h-screen flex flex-col justify-between">
      <main>
        <h1 className="text-2xl md:text-3xl font-bold my-20 text-center">
          📰 Latest News
        </h1>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentArticles.map((article, index) => (
            <li
              key={index}
              className="flex flex-col justify-between border rounded-lg hover:shadow-xl hover:scale-[1.02] transition-transform overflow-hidden h-[40rem]"
            >
              <img
                src={article.image}
                alt="news"
                className="w-full h-80 object-cover"
              />
              <div className="flex flex-col text-base text-gray-600 p-4 overflow-hidden">
                <h2 className="text-lg font-semibold text-black mb-2">
                  {article.title.slice(0, 60)}...
                </h2>
                <p className="mb-2">
                  <span className="font-medium">📝 Description :</span>{" "}
                  {article.description?.slice(0, 100)}...
                </p>
                <p className="mb-2">
                  <span className="font-medium">✍️ Author :</span>{" "}
                  {article.author || "Unknown"}
                </p>
                <p>
                  <span className="font-medium">📅 Published :</span>{" "}
                  {formatDate(article.published)}
                </p>
              </div>
              <Link
                to={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="m-4 text-sm leading-6 border border-black hover:text-black text-white bg-black hover:bg-white p-2 text-center rounded-md hover:scale-105 transition-transform"
              >
                Read more
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex flex-col sm:flex-row items-center justify-between mt-10 w-full">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="flex items-center py-2 px-5 bg-gray-300 text-black hover:bg-blue-500 hover:text-white rounded-md hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <FaRegCaretSquareLeft className="mr-3 w-5 h-5" />
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= Math.ceil(articles.length / itemsPerPage)}
            className="flex items-center py-2 px-5 bg-gray-300 text-black hover:bg-blue-500 hover:text-white rounded-md hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Next
            <FaRegSquareCaretRight className="ml-3 w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default News;
