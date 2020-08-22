const today = new Date();
const login_timestamp = today.toString();

const folders = {
  "about": [
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium pariatur dignissimos amet laboriosam qui quisquam dolorum excepturi eum in assumenda, facilis recusandae magnam vitae tempore, suscipit voluptates hic labore laudantium quibusdam! Dignissimos magni, earum laudantium nostrum quia aliquid reprehenderit corporis odit esse necessitatibus debitis fuga quam. Adipisci iste in enim!"
  ],
  "contact": [
    "phone:   (###) ###-####",
    "email:   annaq@andrew.cmu.edu"
  ],
  "folder 1": {
    "file 1.1": [
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores, aperiam.",
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias iure ratione blanditiis odit obcaecati suscipit."
    ],
    "file 1.2": [
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi, aperiam.",
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quos, eum?",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, quidem!",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, quia!",
      "Ut minima dolorum dolore accusantium explicabo expedita debitis, officia recusandae.",
      "Incidunt beatae libero voluptatum! Quidem sed doloremque esse dolor. Nostrum."
    ],
    "folder 1.3": {
      "file 1.3.1": [
        "hahaha"
      ]
    }
  },
  "folder 2": {
    "file 2.1": [
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis, ratione.",
      "Harum et unde at ratione tenetur distinctio quaerat, dignissimos quis!",
      "Dolore quis omnis doloribus iste repellat velit ut id placeat!"
    ]
  },
  "folder 3": {
    "file 3.1": [
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
      "Nisi iusto nulla enim tempore eligendi placeat optio.",
      "Totam quaerat nobis quod odit beatae quia hic.",
      "Inventore vero dignissimos nesciunt voluptatem temporibus officiis facilis!",
      " ",
      "Veritatis incidunt aliquam enim! Dolorem beatae animi fuga!",
      "Odit numquam quo, necessitatibus id officiis qui perferendis!"
    ],
    "file 3.2": [
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consectetur odit voluptatibus nobis minus eligendi dignissimos?",
      "Nostrum, expedita animi necessitatibus et quo veniam quod dolorem corrupti eius? Voluptates magnam quam pariatur?",
      "Rem ipsum distinctio numquam, eius laboriosam debitis, asperiores, hic dolores sapiente voluptatem vitae corrupti nobis?"
    ]
  },
  "file with styling": [
    `<a href="https://google.com" target="_blank">here is a link to google!</a>`,
    "here is some <b>bold</b>, <i>italics</i>, <u>underline</u>"
  ]
}

let folder = folders;
let folder_path = ".";

const terminal_data = {
  "welcome": [
    // `Last login: ${login_timestamp} from annaqiu.com`,
    `Last login: ${login_timestamp}`,
    "",
    "Welcome! This mini shell made entirely using HTML, CSS, and JavaScript.",
    "For more information and to see what commands are supported, type help."
  ],
  "help": [
    "supported commands: `ls` (aliased with `dir`), `cd`, `cat`"
  ]
}

const is_folder = (item) => {
  return typeof item == "object" && !Array.isArray(item);
}

const get_parent = (folderName, curFolder) => {
  if (curFolder.hasOwnProperty(folderName))
    return curFolder;
  if (!is_folder(curFolder))
    return null;
  
  for (const key in curFolder) {
    if (curFolder.hasOwnProperty(key)) {
      const parent = get_parent(folderName, curFolder[key]);
      if (parent != null)
        return parent;
    }
  }

  return null;
}

const get_parent_name = (folderName, curFolder, curFolderName) => {
  if (!is_folder(curFolder))
    return null;
  if (curFolder.hasOwnProperty(folderName))
    return curFolderName;

  for (const key in curFolder) {
    if (curFolder.hasOwnProperty(key)) {
      const parent = get_parent(folderName, curFolder[key]);
      if (parent != null)
        return key;
    }
  }

  return null;
}

const get_item = (links, curFolder, curFolderName) => {
  if (links.length == 0)
    return curFolder;

  const folder = links[0];
  console.log(folder);

  if (folder == ".")
    return get_item(links.slice(1), curFolder, curFolderName);

  if (folder == "..")
    return get_item(links.slice(1), get_parent(curFolderName, folders), get_parent_name(curFolderName, folders, "."));
  
  console.log(curFolder.hasOwnProperty(folder));
  if (!curFolder.hasOwnProperty(folder))
    return null;
  
  // if (links.length == 1)
  //   return curFolder[folder];
  
  console.log(links.slice(1));
  return get_item(links.slice(1), curFolder[folder], folder);
}

const get_item_from_path = (path) => {
  if (path == ".")
    return folder;
  
  const links = path.split("/");
  console.log(links);
  // let curFolder = folder;
  // for (let i = 0; i < links.length; i++) {
  //   if (curFolder.hasOwnProperty(links[i]) && is_folder(curFolder[links[i]]))
  //     curFolder = curFolder[links[i]];
  //   else
  //     return null;
  // }
  // return is_folder(curFolder) ? curFolder : null;
  return get_item(links, folder, folder_path.split("/").slice(-1));
}

const set_folder_path = (path) => {
  let links = path.split("/");
  while (links.length > 0) {
    switch (links[0]) {
      case ".":
        break;
      case "..":
        folder_path = folder_path.split("/").slice(0, folder_path.split("/").length - 1).join("/");
        break;
      default:
        folder_path += "/" + links[0];
    }

    links = links.slice(1);
  }
}

const create_dir_elem = (name, isFolder) => {
  return `<span class="${isFolder ? "folder" : "file"}">${name}</span>`;
}

const format_directories = (folder) => {
  let temp = [];
  for (const key in folder) {
    if (folder.hasOwnProperty(key)) {
      const dir = folder[key];
      // temp.push(create_dir_elem(key.split(" ").length > 1 ? `'${key}'` : key, is_folder(dir)));
      temp.push(key);
    }
  }
  temp = temp.sort((a, b) => a.localeCompare(b, 'en', {
      sensitivity: 'base'
    })).map((key) => {
      return create_dir_elem(key.split(" ").length > 1 ? `'${key}'` : key, is_folder(folder[key]));
    });
  console.log(temp);
  // console.log(temp.join("$$"));
  return temp;
}

const exec = (commandline) => {
  console.log(commandline);
  // https://stackoverflow.com/questions/49179609/split-string-on-spaces-and-quotes-keeping-quoted-substrings-intact
  const commandline_inputs = commandline.match(/"[^"]*"|'[^']*'|\S+/g).map(m => m.slice(0, 1) === '"' ? m.slice(1, -1) : m.slice(0, 1) === "'" ? m.slice(1, -1) : m);
  const command = commandline_inputs[0];
  const args = commandline_inputs.splice(1);
  
  const path = args.length > 0 ? args[0].trim() : ".";
  const lookup = get_item_from_path(path);

  console.log(lookup);
  console.log(folder);
  console.log(folder_path);

  switch (command) {
    case "ls":
    case "dir":
      if (lookup == null)
        return [`${command}: cannot access '${path}': no such file or directory`];
      if (is_folder(lookup))
        return [format_directories(lookup).join("$$")];
      else
        return [path];
    
    case "cd":
      // const path = args.length > 0 ? args.length[0].trim() : ".";
      // const lookup = get_item_from_path(path);
      if (args.length == 0) {
        folder = folders;
        folder_path = ".";
        return;
      }
      if (lookup != null && is_folder(lookup)) {
        folder = lookup;
        set_folder_path(path);
        console.log(folder);
        return;
      } else if (lookup == null)
        return [`cd: ${path}: no such file or directory`];
      else
        return [`cd: ${path}: not a directory`];
    
    case "cat":
      if (args.length == 0)
        return ["cat: no file input"];
      
      // const path = args[0].trim();
      // const lookup = get_item_from_path(path);
      if (lookup != null && !is_folder(lookup))
        return lookup;
      else if (lookup == null)
        return [`cat: ${path}: no such file or directory`];
      else
        return [`cat: ${path}: is a directory`];
  
    // case "tree":
    //   break;

    case "help": 
      return terminal_data["help"];

    case "welcome":
      return terminal_data["welcome"];

    default:
      return [`${command}: unknown command`];
  }
}

export {terminal_data, folder_path, exec};