import DOMPurify from "dompurify";

const sanitize = (HTMLString: string) => {
  const sanitized = DOMPurify.sanitize(HTMLString, {
    ALLOWED_TAGS: ['a', 'span', 'br', 'p', 'div'],
    ALLOWED_ATTR: ['class', 'href', 'id', 'target']
  });
  return sanitized;
};

export default sanitize;
