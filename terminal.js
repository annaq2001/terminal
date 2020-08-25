// import * as data from "./terminal_data.js";
import * as fns from "./terminal_fns.js";
// alert("hello");

const tab_width = 4;
let terminal_prefix = "bash";
const terminal = document.querySelector("div#terminal_lines");

fns.implemented_commands.push("clear");
fns.implemented_commands.push("settings");
fns.implemented_commands.push("files");

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
  }, commandline == "mobile_help" ? "help" : commandline));
  if (commandline.trim() == "settings") {
    show_settings();
    return;
  }
  if (commandline.trim() == "files") {
    show_files();
    return;
  }
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
// alert(fns.exec("welcome"));

const fill_files = () => {
  const files = document.querySelector("div#files");
  const lines = fns.exec("tree");
  lines[0] += " [root directory]";
  lines.pop();
  lines.pop();
  files.innerHTML = format_lines(lines);
}
fill_files();

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

  OverlayScrollbars(document.querySelectorAll("div#settings, div#files"), {
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

const stdin = [
  [],
  []
];
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

const update_cur_dir = () => {
  terminal_cur_directory.innerHTML = create_prefix() + (fns.folder_path.slice(1) == "" ? "~" : fns.folder_path.slice(1));
}

const root = document.documentElement;
Array.from(document.querySelectorAll("div#settings input[type='color']")).forEach(s => {
  s.onchange = () => {
    root.style.setProperty("--" + s.id, s.value);
  }
});
document.querySelector("div#settings input#terminal_prefix").onchange = () => {
  terminal_prefix = document.querySelector("div#settings input#terminal_prefix").value;
  update_cur_dir();
  update_cursor();
}

const show_settings = () => {
  const window_width = window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  const window_height = window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  const settings = document.querySelector("div#settings_window");
  const settings_width = settings.offsetWidth;
  const settings_height = settings.offsetHeight;

  const max_left = window_width * 0.65 - settings_width;
  const max_top = window_height * 0.65 - settings_height;

  if (settings.style.display != "block") {
    // settings.style.left = Math.random() * max_left + "px";
    settings.style.left = (Math.random() * max_left) / window_width * 100 + "%";
    // settings.style.top = Math.random() * max_top + "px";
    settings.style.top = (Math.random() * max_top) / window_height * 100 + "%";
    settings.style.display = "block";
  }

  settings.focus();
}

const show_files = () => {
  const window_width = window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  const window_height = window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  const files = document.querySelector("div#files_window");
  const files_width = files.offsetWidth;
  const files_height = files.offsetHeight;

  const max_left = window_width * 0.65 - files_width;
  const max_top = window_height * 0.65 - files_height;

  if (files.style.display != "block") {
    // files.style.left = Math.random() * max_left + "px";
    files.style.left = (Math.random() * max_left) / window_width * 100 + "%";
    // files.style.top = Math.random() * max_top + "px";
    files.style.top = (Math.random() * max_top) / window_height * 100 + "%";
    files.style.display = "block";
  }

  files.focus();
}

const close_window = (e) => {
  const parent = document.getElementById(e.getAttribute("for"));
  // console.log(parent);
  parent.style.display = "none";
  parent.style.webkitTransform = "";
  parent.style.transform = "";
  parent.setAttribute("data-x", "");
  parent.setAttribute("data-y", "");

  if (e.getAttribute("for") == "terminal_window")
    document.querySelector("div#show_terminal button").style.display = "block";
}

// console.log(document.querySelectorAll(".close[for]"));
Array.from(document.querySelectorAll(".close[for]")).forEach(c => {
  c.onclick = () => {
    close_window(c);
  }
});

const toggle_height = (e) => {
  const parent = document.getElementById(e.getAttribute("for"));
  /*if (parent.style.height) {
    parent.style.height = "";
    parent.style.maxHeight = "";
    e.setAttribute("title", "maximize");
  }
  else {
    parent.style.height = "auto";
    parent.style.maxHeight = "100%";
    e.setAttribute("title", "minimize");
  }

  if (e.getAttribute("for") == "files") {
    if (parent.parentElement.style.width) {
      parent.parentElement.style.width = "";
      // parent.style.maxHeight = "";
      // e.setAttribute("title", "maximize");
    } else {
      parent.parentElement.style.width = "450px";
      // parent.style.maxHeight = "100%";
      // e.setAttribute("title", "minimize");
    }
  }*/
  parent.classList.toggle("maximized");
  if (e.getAttribute("title") == "minimize")
    e.setAttribute("title", "maximize");
  else
    e.setAttribute("title", "minimize");
}

Array.from(document.querySelectorAll(".minimize[for]")).forEach(c => {
  c.onclick = () => {
    console.log(c);
    toggle_height(c);
  }
});

// document.querySelector("div#terminal_window .minimize").onclick = () => {
//   const parent = document.getElementById("terminal_window");
//   console.log("clicked");
//   if (parent.style.height) {
//     parent.style.height = "";
//     parent.style.width = "";
//     parent.style.maxWidth = "";
//     parent.style.top = "";
//     parent.style.borderRadius = "";
//     document.querySelector("div#terminal_window .minimize").setAttribute("title", "maximize");
//   } else {
//     parent.style.height = "100%";
//     parent.style.width = "100%";
//     parent.style.maxWidth = "100%";
//     parent.style.top = "0";
//     parent.style.borderRadius = "0";
//     document.querySelector("div#terminal_window .minimize").setAttribute("title", "minimize");
//   }
// }

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
        // terminal_cur_directory.innerHTML = create_prefix() + (fns.folder_path.slice(1) == "" ? "~" : fns.folder_path.slice(1));
        update_cur_dir();
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
        if (stdin[0].length > 0)
          e.preventDefault();
        // console.log(stdin);
        // console.log(stdin[0].join("").split(" ").slice(-1)[0]);
        if (stdin[0].join("").match(" ")) {
          const filled_dir = fns.autofill_dir(stdin[0].join("").split(" ").slice(1).join(" "));
          stdin[0] = (stdin[0].join("").split(" ")[0] + " " + filled_dir).split("");
        } else {
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

const create_button = (name, command, c = "") => {
  return `<button class="terminal_command_button ${c}" input="${command}">${name}</button>`;
}

const terminal_buttons = document.querySelector("div#terminal_buttons");
const update_buttons = () => {
  const cur_path = stdin.map(i => i.length > 0 ? i.join("") : "").join("").split(" ")[1];
  let dirs = fns.get_dir_items(cur_path);
  terminal_buttons.innerHTML = "";

  if (dirs.length == 0)
    dirs = ["enter"];
  else
    dirs.unshift("enter", "../");

  console.log(dirs);
  dirs.forEach((d) => {
    if (d == "enter") {
      terminal_buttons.innerHTML += create_button(d, d);
      return;
    }

    if (d == "../") {
      terminal_buttons.innerHTML += create_button("../", "../", "folder");
      return;
    }

    if (d.endsWith("/"))
      terminal_buttons.innerHTML += create_button(d, d, "folder");
    else
      terminal_buttons.innerHTML += create_button(d, d, "file");
  });
}

const reset_buttons = () => {
  terminal_buttons.innerHTML = `<button class="terminal_command_button" input="ls ">ls</button><button class="terminal_command_button" input="tree ">tree</button><button class="terminal_command_button" input="cd ">cd</button><button class="terminal_command_button" input="cat ">cat</button><button class="terminal_command_button" input="mobile_help">help</button><button class="terminal_command_button" input="clear">clear</button>`;
}

terminal_buttons.onclick = (e) => {
  console.log(e.target);
  if (e.target.getAttribute("input")) {
    const command = e.target.getAttribute("input");
    scrollbar.scroll([0, "100%"]);
    switch (command) {
      case "clear":
        clear_terminal();
        break;
      case "mobile_help":
        add_line(command);
        break;
      case "enter":
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
        // terminal_cur_directory.innerHTML = create_prefix() + (fns.folder_path.slice(1) == "" ? "~" : fns.folder_path.slice(1));
        update_cur_dir();
        reset_buttons();
        break;
      default:
        stdin[0] = stdin[0].concat(command.split(""));
        // update_stdin();
        // update_cursor();
        update_buttons();
        console.log(stdin);
    }
    update_cursor();
    update_stdin();
  }
}

// make the windows draggable
import interact from 'https://cdn.jsdelivr.net/npm/@interactjs/interactjs/index.js';

interact('.window_top').draggable({
  // enable inertial throwing
  inertia: false,

  listeners: {
    // call this function on every dragmove event
    move: dragMoveListener
  },
  // keep the element within the area of it's parent
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: 'main',
      endOnly: true
    })
  ],
});

function dragMoveListener(event) {
  var target = event.target.parentElement;
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform =
    'translate(' + x + 'px, ' + y + 'px)';
  target.style.transform =
    'translate(' + x + 'px, ' + y + 'px)';
  // target.style.marginLeft = x + 'px';
  // target.style.marginTop = y + 'px';

  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

function test() {
  alert("test imports");
}
export {
  test
};