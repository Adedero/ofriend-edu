import { generateHTML } from "./html-parse";

export default function filterMentions(input = '', mentions = [], filteredMentions = []) {
  const outputHTML = generateHTML(input);

  const par = document.createElement('p');
  par.style.display = 'none';
  par.innerHTML = outputHTML;
  document.body.appendChild(par);

  const tags = par.querySelectorAll('.mention-link');
  tags.forEach(tag => {
    const username = tag.innerText.split('@')[1];

    const user = mentions.find(u => u.name.split(' ').join('') === username);

    if (user) {
      tag.innerText = `@${user.name}`;
      tag.setAttribute('data-user', user.id)
      //tag.href = `/app/0/profile/${user.id}`;
      filteredMentions.push({ id: user.id, name: user.name });
    }
  });
  document.body.removeChild(par);

  return par.innerHTML;
}