// import * as data from "./terminal_data.js";
import * as fns from "./terminal_fns.js";

const tab_width = 4;
const terminal_prefix = "bash";
const terminal = document.querySelector("div#terminal_lines");

fns.implemented_commands.push("clear");

const create_elem = (selector, attributes = {}, html = "") => {
  let temp = document.createElement(selector);
  if (attributes != null) {
    for (let a in attributes) temp.setAttribute(a, attributes[a]);
  }
  if (html != '') temp.innerHTML = html;
  return temp;
}

const create_p = (txt) => {
  return `<p>${txt}</p>`;
}

const format_lines = (lines = []) => {
  let line = "";
  if (lines.length > 0)
    lines.forEach(l => l == " " ? line += create_p("\xa0") : line += create_p(l));
  // console.log(line);
  line = line.replace(/\$\$/g, ("\xa0").repeat(tab_width));
  // console.log(line);
  line = line.replace(/ {2}/g, "\xa0\xa0");
  // console.log(line);
  return line;
}

const create_prefix = () => {
  return `<span class="terminal_prefix">${terminal_prefix}:</span>`;
}

const add_line = (commandline) => {
  // console.log(commandline);
  const item = create_elem("div", {
    class: "terminal_item" + (commandline.split(" ")[0] == "tree" ? " terminal_tree" : "")
  });
  terminal.appendChild(item);
  const command = create_elem("div", {
    class: "terminal_commandline"
  });
  item.appendChild(command);
  command.appendChild(create_elem("span", {
    class: "terminal_directory"
  }, create_prefix() + (fns.folder_path.slice(1) == "" ? "~" : fns.folder_path.slice(1))));
  command.innerHTML += " ";
  command.appendChild(create_elem("span", {
    class: "terminal_command"
  }, commandline));
  // const res = fns.exec(commandline);
  // console.log(res);
  item.appendChild(create_elem("div", {
    class: "terminal_stdout"
  }, format_lines(commandline.length > 0 ? fns.exec(commandline) : [])));
}

const add_welcome = () => {
  const welcome = document.querySelector("div#welcome");
  welcome.appendChild(create_elem("div", {
    class: "terminal_stdout"
  }, format_lines(fns.exec("welcome"))));
}
add_welcome();

const clear_terminal = () => {
  Array.from(document.querySelectorAll(".terminal_item")).forEach((i) => {
    i.parentElement.removeChild(i);
  })
}

var scrollbar;
document.addEventListener("DOMContentLoaded", function () {
  //The first argument are the elements to which the plugin shall be initialized
  //The second argument has to be at least a empty object or a object with your desired options
  scrollbar = OverlayScrollbars(document.querySelectorAll('div#terminal'), {
    className: "os-theme-thin-light"
  });
});

// const terminal_stdin = document.querySelector("input#terminal_stdin");
// const terminal_cur_directory = document.querySelector("span#terminal_cur_directory");
// terminal_stdin.onchange = () => {
//   if (terminal_stdin.value.trim() == "clear")
//     clear_terminal();
//   else
//     add_line(terminal_stdin.value);
//   terminal_stdin.value = "";
//   terminal_cur_directory.innerHTML = fns.folder_path.slice(1) == "" ? "~" : fns.folder_path.slice(1);
//   // document.querySelector("div#terminal").scrollTo(0, document.querySelector("div#terminal").scrollHeight);
//   scrollbar.scroll([0, "100%"]);
// }

const terminal_cur_directory = document.querySelector("span#terminal_cur_directory");
let terminal_focused = false;
document.querySelector("div#terminal_window").onfocus = () => {
  // terminal_stdin.focus();
  terminal_focused = true;
  // console.log(terminal_focused);
  document.querySelector("div#terminal_window").classList.add("terminal_focused");
}

document.querySelector("div#terminal_window").onblur = () => {
  terminal_focused = false;
  // console.log(terminal_focused);
  document.querySelector("div#terminal_window").classList.remove("terminal_focused");
}

const stdin = [[], []];
const inputs = [];
let cur_stdin = null;
let cur_input = -1;
let scrolled = false;
// console.log(stdin, inputs);

const update_stdin = () => {
  document.querySelector("span#terminal_stdin_text").innerHTML = stdin.map(i => i.join("")).join("");
}

const cursor = document.querySelector("span#terminal_stdin_cursor");
const update_cursor = () => {
  cursor.innerHTML = "\xa0".repeat(Math.max(fns.folder_path.slice(1).length, 1) + terminal_prefix.length + 2 + stdin[0].length);
}
terminal_cur_directory.innerHTML = create_prefix() + (fns.folder_path.slice(1) == "" ? "~" : fns.folder_path.slice(1));
update_cursor();

window.onkeydown = (e) => {
  if (terminal_focused) {
    switch (e.key) {
      case "Enter":
        const input = stdin.map(i => i.length > 0 ? i.join("") : "").join("");
        inputs.push(input);

        if (input.trim() == "clear")
          clear_terminal();
        else
          add_line(input);

        stdin[0] = [];
        stdin[1] = [];
        cur_stdin = null;
        cur_input = -1;
        scrolled = false;
        terminal_cur_directory.innerHTML = create_prefix() + (fns.folder_path.slice(1) == "" ? "~" : fns.folder_path.slice(1));
        break;
      
      case "ArrowLeft":
        stdin[1].unshift(stdin[0].pop());
        // console.log(stdin);
        break;
      
      case "ArrowRight":
        if (stdin[1].length == 0)
          break;
        stdin[0].push(stdin[1][0]);
        stdin[1] = stdin[1].slice(1);
        // console.log(stdin);
        break;

      case "ArrowUp":
        if (cur_stdin == null)
          cur_stdin = stdin.map(i => i.length > 0 ? i.join("") : "").join("");
        
        if (inputs.length == 0)
          break;
        
        if (cur_input < 0)
          cur_input = inputs.length - 1;
        else if (cur_input > 0)
          cur_input--;
        
        stdin[0] = inputs[cur_input].split("");
        stdin[1] = [];
        scrolled = true;
        // console.log(stdin);
        break;

      case "ArrowDown":
        if (cur_input == inputs.length - 1 && scrolled) {
          stdin[0] = cur_stdin ? cur_stdin.split("") : [];
          stdin[1] = [];
          cur_input = -1;
          cur_stdin = null;
          break;
        }

        if (0 <= cur_input && cur_input < inputs.length - 1) {
          cur_input++;
          stdin[0] = inputs[cur_input].split("");
          stdin[1] = [];
        }
          
        // console.log(stdin);
        
        break;

      case "Backspace":
        stdin[0].pop();
        break;

      case "Delete":
        stdin[1] = stdin[1].slice(1);
        break;

      case "Tab":
        e.preventDefault();
        // console.log(stdin);
        // console.log(stdin[0].join("").split(" ").slice(-1)[0]);
        if (stdin[0].join("").match(" ")) {
          const filled_dir = fns.autofill_dir(stdin[0].join("").split(" ").slice(1).join(" "));
          stdin[0] = (stdin[0].join("").split(" ")[0] + " " + filled_dir).split("");
        }
        else {
          const filled_command = fns.autofill_command(stdin[0].join(""), fns.implemented_commands);
          // console.log(filled_command);
          stdin[0] = filled_command.split("");
        }
        break;

      default:
        if (e.key.length == 1)
          stdin[0].push(e.key);
        // console.log(stdin);
    }
    stdin[0] = stdin[0].length > 0 ? stdin[0].filter(i => i != undefined) : [];
    stdin[1] = stdin[1].length > 0 ? stdin[1].filter(i => i != undefined) : [];
    update_stdin();
    update_cursor();
    // console.log(stdin);
    scrollbar.scroll([0, "100%"]);
    // document.querySelector("div#terminal_window").focus();
  }
}

