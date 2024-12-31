import { FaYoutube, FaTwitter, FaInstagram } from 'react-icons/fa';

const SocialIcons = () => {
  return (
    <div className="flex space-x-4 mt-1 text-blue-600 dark:text-blue-400">
      <a
        href="https://www.youtube.com/@WesleyFranks"
        target="_blank"
        rel="noopener noreferrer nofollow"
        aria-label="YouTube Channel"
        title="YouTube"
        className="inline-flex items-center hover:text-blue-500 dark:hover:text-blue-300"
      >
        <FaYoutube size={24} />
      </a>
      <a
        href="https://x.com/wesleyfranks"
        target="_blank"
        rel="noopener noreferrer nofollow"
        aria-label="Twitter Profile"
        title="Twitter"
        className="inline-flex items-center hover:text-blue-500 dark:hover:text-blue-300"
      >
        <FaTwitter size={24} />
      </a>
      <a
        href="https://instagram.com/wesleyfranks"
        target="_blank"
        rel="noopener noreferrer nofollow"
        aria-label="Instagram Profile"
        title="Instagram"
        className="inline-flex items-center hover:text-blue-500 dark:hover:text-blue-300"
      >
        <FaInstagram size={24} />
      </a>
    </div>
  );
};

export default SocialIcons;
