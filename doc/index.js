import './styles/index.scss';
import './src/nav';
import './src/demos/sprite'
import 'highlight.js/styles/default.css';
import hlt from 'highlight.js';


function syncCode(el,code){
  const dom = document.querySelector(el);
  dom.innerHTML = code;
}
import spriteCode from './src/demos/sprite?raw'


syncCode('#code-sprite',spriteCode)

hlt.highlightAll();
