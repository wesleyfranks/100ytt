const Footer = () => {
  return (
    <footer
      className="
        flex 
        flex-col
        items-center
        justify-center
        text-center
        w-full
        py-6
        bg-gray-100 
        dark:bg-gray-900
        text-gray-500 
        dark:text-gray-400
        border-t 
        border-gray-200
        dark:border-gray-700
      "
    >
      <p className="text-[4vw] leading-none mb-4">
        <strong>
          Videos posted since December 31st up to March 31st, 2025.
        </strong>
      </p>
      <p className="text-sm leading-relaxed max-w-3xl px-4">
        <i>
          <strong>Videos of value</strong> are videos that are filled with
          educational content, tutorials, helpful information, and stories that
          are entertaining and fun. The videos would be something for you as a
          viewer to say, <strong>"I got something out of this video."</strong>.
        </i>
      </p>
    </footer>
  );
};

export default Footer;
