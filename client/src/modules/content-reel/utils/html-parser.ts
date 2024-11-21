import DOMPurify from 'dompurify';

/* export const showLinks = (text) => {
  const urlRegex = /((https?:\/\/|ftp:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?].*)?)/gi;
   const rawHTML = `<div>${
    text
      .replace(urlRegex, (match) => {
        const href = match.startsWith('http://') || match.startsWith('https://') || match.startsWith('ftp://') ? match : `http://${match}`;
        return `<a href="${href}" target="_blank" class="matched-link text-[blue] hover:underline">${match}</a>`;
      })
  }</div>`;

  const sanitized = DOMPurify.sanitize(rawHTML, {
    ALLOWED_TAGS: ['a', 'span', 'br', 'p', 'div'],
    ALLOWED_ATTR: ['class', 'href', 'target']
  });

  return sanitized;
} */

export const parseUrlsAndMentions = (text: string) => {
  const urlRegex = /((https?:\/\/|ftp:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?][^\s]*)?)/gi;
  const mentionRegex = /(@[a-zA-Z0-9_]+)/g;
  const breakRegex = /\n/g;
  const rawHTML = `
  <div>
  ${ text
      .replace(urlRegex, (match) => {
        const href = match.startsWith('http://') || match.startsWith('https://') || match.startsWith('ftp://') ? match : `http://${match}`;
        return `<a href="${href}" target="_blank" class="matched-link text-blue-500 hover:underline">${match}</a>`;
      })
      .replace(mentionRegex, '<span class="mention-link cursor-pointer p-1 bg-blue-50/30 hover:bg-blue-50 text-primary-300 font-medium">$1</span>')
      .replace(breakRegex, '<br>')
    }
  </div>`;

  const sanitized = DOMPurify.sanitize(rawHTML, {
    ALLOWED_TAGS: ['a', 'span', 'br', 'p', 'div'],
    ALLOWED_ATTR: ['class', 'href', 'id', 'target']
  });
  return sanitized;
};

export const unparseUrlAndMentions = (generatedHTML: string) => {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = generatedHTML;

  //Handle mention links
  const mentionLinks = tempElement.querySelectorAll('.mention-link') as NodeListOf<HTMLElement>;
  mentionLinks.forEach(link => {
    const mentionText = link.innerText;
    const textNode = document.createTextNode(mentionText);
    link.parentNode?.replaceChild(textNode, link);
  });

  // Handle URL links
  const urlLinks = tempElement.querySelectorAll('.matched-link') as NodeListOf<HTMLElement>;
  urlLinks.forEach(link => {
    const urlText = link.innerText;
    const textNode = document.createTextNode(urlText);
    link.parentNode?.replaceChild(textNode, link);
  });

  return tempElement.textContent;
}
