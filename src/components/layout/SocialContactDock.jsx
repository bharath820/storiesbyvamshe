const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/storiesby_vamshe?igsh=MWsxdnlzamhianQ2aw==",
    className: "social-contact-dock__link social-contact-dock__link--instagram",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.6" />
        <circle cx="16.75" cy="7.25" r="1.1" />
      </svg>
    )
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/919030501106?text=Hi%20Stories%20by%20Vamshe%2C%20I%20would%20like%20to%20book%20a%20session.",
    className: "social-contact-dock__link social-contact-dock__link--whatsapp",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 32 32" focusable="false">
        <path d="M16.02 4.4c-6.38 0-11.56 5.05-11.56 11.27 0 2.08.6 4.1 1.72 5.85L4.1 27.6l6.34-1.99a11.9 11.9 0 0 0 5.58 1.39c6.38 0 11.56-5.05 11.56-11.27S22.4 4.4 16.02 4.4Zm0 20.2a9.42 9.42 0 0 1-4.8-1.32l-.36-.21-3.76 1.18 1.23-3.6-.24-.37a8.61 8.61 0 0 1-1.4-4.61c0-4.88 4.18-8.86 9.33-8.86s9.33 3.98 9.33 8.86-4.18 8.93-9.33 8.93Z" />
        <path d="M21.2 18.7c-.28-.14-1.67-.8-1.93-.89-.26-.1-.45-.14-.64.14-.19.27-.73.89-.9 1.07-.17.18-.33.2-.62.07-.28-.14-1.2-.43-2.28-1.36-.84-.75-1.41-1.67-1.58-1.94-.16-.27-.02-.42.13-.56.13-.13.28-.34.42-.5.14-.17.19-.28.28-.47.1-.18.05-.34-.02-.48-.07-.14-.64-1.5-.88-2.06-.23-.54-.47-.46-.64-.47h-.55c-.19 0-.5.07-.76.34-.26.27-1 1-1 2.43 0 1.43 1.07 2.82 1.21 3.01.14.18 2.1 3.12 5.09 4.38.71.3 1.26.48 1.69.62.71.22 1.36.19 1.87.12.57-.08 1.67-.66 1.9-1.3.24-.64.24-1.19.17-1.3-.07-.12-.26-.19-.54-.33Z" />
      </svg>
    )
  }
];

export function SocialContactDock() {
  return (
    <aside className="social-contact-dock" aria-label="Quick social links">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className={link.className}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${link.name}`}
          title={link.name}
        >
          {link.icon}
        </a>
      ))}
    </aside>
  );
}
