import React from 'react';
import styles from './index.module.scss';
import teamMembers from '../../data/teamMemberData';

const TeamMemberLinks = ({ links }) => {
    return (
        <div className={styles.links}>
            {links.map((link, index) => (
                <a key={index}
                   href={link.url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className={styles.link}
                   aria-label={link.label}>
                    <i className={link.icon}></i>
                </a>
            ))}
        </div>
    );
};

const TeamMember = ({ name, role, imageSrc, links }) => {
    return (
        <div className={styles.teamMember}>
            <div className={styles.headshot}>
                <img src={imageSrc} alt={name} />
            </div>
            <h3 className={styles.name}>{name}</h3>
            <p className={styles.role}>{role}</p>
            <TeamMemberLinks links={links} />
        </div>
    );
};

const AboutPageGallery = () => {
    return (
        <div className={styles.gallery}>
            {teamMembers.map((member) => (
                <TeamMember
                    key={member.name}
                    name={member.name}
                    role={member.role}
                    imageSrc={member.imageSrc}
                    links={member.links}
                />
            ))}
        </div>
    );
};


export { AboutPageGallery, TeamMember };