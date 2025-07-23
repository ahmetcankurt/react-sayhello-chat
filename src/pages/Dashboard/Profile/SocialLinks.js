import { memo } from "react";
import InfoItem from "./InfoItem"; // InfoItem bileşenini bu şekilde içe aktar
import { socialMediaLinks } from "../../../utils/socialMediaLinks"; // Sosyal medya bağlantılarını içe aktar

const SocialLinks = ({ socials = [] }) => {
    const visibleSocials = socials.filter((item) => item.isPublic !== false);
    return (
        <>
            {
                visibleSocials.map((social, index) => {
                    const matchedIcon = socialMediaLinks.find(
                        (item) => item.name.toLowerCase() === social.name.toLowerCase()
                    );

                    return (
                        <InfoItem
                            key={index}
                            iconClass={matchedIcon?.icon || "bx bx-link"}
                            href={social.url}
                        >
                            {social.name}
                        </InfoItem>
                    );
                })
            }
        </>
    );
};

export default memo(SocialLinks)