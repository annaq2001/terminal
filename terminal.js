import * as data from "./terminal_data.js";

const tab_width = 2;
const terminal = document.querySelector("div#terminal_lines");

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

const add_line = (commandline) => {
  console.log(commandline);
  const item = create_elem("div", {
    class: "terminal_item"
  });
  terminal.appendChild(item);
  const command = create_elem("div", {
    class: "terminal_commandline"
  });
  item.appendChild(command);
  command.appendChild(create_elem("span", {
    class: "terminal_directory"
  }, data.folder_path.slice(1) == "" ? "~" : data.folder_path.slice(1)));
  command.innerHTML += " ";
  command.appendChild(create_elem("span", {
    class: "terminal_command"
  }, commandline));
  const res = data.exec(commandline);
  // console.log(res);
  item.appendChild(create_elem("div", {
    class: "terminal_stdout"
  }, format_lines(res)));
}

const add_welcome = () => {
  const welcome = document.querySelector("div#welcome");
  welcome.appendChild(create_elem("div", {
    class: "terminal_stdout"
  }, format_lines(data.exec("welcome"))));
}
add_welcome();

var scrollbar;
document.addEventListener("DOMContentLoaded", function () {
  //The first argument are the elements to which the plugin shall be initialized
  //The second argument has to be at least a empty object or a object with your desired options
  scrollbar = OverlayScrollbars(document.querySelectorAll('div#terminal'), {
    className: "os-theme-thin-light"
  });
});

const terminal_stdin = document.querySelector("input#terminal_stdin");
const terminal_cur_directory = document.querySelector("div#terminal_cur_directory");
terminal_stdin.onchange = () => {
  add_line(terminal_stdin.value);
  terminal_stdin.value = "";
  terminal_cur_directory.innerHTML = data.folder_path.slice(1) == "" ? "~ " : data.folder_path.slice(1) + " ";
  // document.querySelector("div#terminal").scrollTo(0, document.querySelector("div#terminal").scrollHeight);
  scrollbar.scroll([0, "100%"]);
}