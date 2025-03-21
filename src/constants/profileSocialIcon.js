import {
  FaEnvelope,
  FaInstagramSquare,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaTwitter,
} from 'react-icons/fa';

const ProfileSocialIcon = () => {
  return [
    { component: FaEnvelope, key: "email", valueKey: "email", label: "E-mail" },
    { component: FaInstagramSquare, key: "instagram", valueKey: "instagram", label: "Instagram" },
    { component: FaPhone, key: "phone", valueKey: "phone", label: "Phone" },
    { component: FaLinkedin, key: "linkedin", valueKey: "linkedin", label: "Linkedin" },
    { component: FaGithub, key: "github", valueKey: "github", label: "Github" },
    { component: FaTwitter, key: "twitter", valueKey: "twitter", label: "Twitter" },
  ];
};

export default ProfileSocialIcon
