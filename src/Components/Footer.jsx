const Footer = () => {
  return (
    <>
      <footer className="mt-16 text-center border-t py-10 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} DooZen News — All rights reserved</p>
        <p className="mt-1">
          Built with ❤️ by{" "}
          <a
            href="https://github.com/TheVinayakGore"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Vinayak Gore
          </a>
        </p>
      </footer>
    </>
  );
};

export default Footer;
