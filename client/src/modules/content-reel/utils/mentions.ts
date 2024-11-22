import { type Ref } from 'vue';
import { type MentionedUser } from '../types';
import { parseUrlsAndMentions } from "./html-parser";

export const handleMention = (
  user: MentionedUser,
  textRef: Ref<string>,
  mentionArray: Ref<MentionedUser[]>,
  textareaId: string
) => {
  mentionArray.value.push({ id: user.id, name: user.name });
  textRef.value = textRef.value.concat(`@${user.name.split(' ').join('')} `);
  document.getElementById(textareaId)?.focus();
};

interface ParsedMentions {
  userId: string;
  name: string;
}

export const parseMentions = (input: string, mentions: MentionedUser[]) => {
  const outputHTML = parseUrlsAndMentions(input);

  const par = document.createElement('p');
  par.style.display = 'none';
  par.innerHTML = outputHTML;
  document.body.appendChild(par);

  const filteredMentions: ParsedMentions[] = [];

  const tags = par.querySelectorAll('.mention-link') as NodeListOf<HTMLParagraphElement>;
  tags.forEach(tag => {
    const username = tag.innerText.split('@')[1];

    const user = mentions.find(user => user.name.split(' ').join('') === username);

    if (user) {
      tag.innerText = `@${user.name}`;
      tag.setAttribute('data-user', user.id)
      filteredMentions.push({ userId: user.id, name: user.name });
    }
  });
  document.body.removeChild(par);

  return {
    text: par.innerHTML,
    mentions: filteredMentions
  }
}
