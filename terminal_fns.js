import * as data from "./terminal_data.js"

let folder = data.folders;
let folder_path = ".";

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
  // console.log(folder);

  if (folder == "." || folder == "")
    return get_item(links.slice(1), curFolder, curFolderName);

  if (folder == "..")
    return get_item(links.slice(1), get_parent(curFolderName, data.folders), get_parent_name(curFolderName, data.folders, "."));
  
  // console.log(curFolder.hasOwnProperty(folder));
  if (!curFolder.hasOwnProperty(folder))
    return null;
  
  // if (links.length == 1)
  //   return curFolder[folder];
  
  // console.log(links.slice(1));
  return get_item(links.slice(1), curFolder[folder], folder);
}

const get_item_from_path = (path) => {
  if (path == ".")
    return folder;
  
  const links = path.split("/");
  // console.log(links);
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
  let links = path.split("/").filter(i => i!="");
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
  // console.log(temp);
  // console.log(temp.join("$$"));
  return temp;
}

const create_shrub_line = (prefix, name, isFolder) => {
  return `${prefix}${create_dir_elem(name, isFolder)}`;
}

const folder_to_shrub = (folder, depth, path, isLast, fileLines) => {
  // const prefix = isLast ? (depth == 1 ? ("    ").repeat(depth - 1) + "├── " : "│   " + ("    ").repeat(depth - 2) + "├── ") : ("│   ").repeat(depth - 1) + "├── ";
  const prefix = ("│   ").repeat(fileLines) + ("    ").repeat(depth - fileLines) + "├── ";
  const lastKey = Object.keys(folder).slice(-1);
  const data = {};
  data["tree"] = depth == 0 ? [create_dir_elem(path, true)] : [];
  data["dir"] = 0;
  data["files"] = 0;

  if (!is_folder(folder)) {
    // console.log(data["tree"], folder);
    data["tree"][0] += " [error opening dir: not a directory]";
    return data;
  }

  for (const key in folder) {
    if (folder.hasOwnProperty(key)) {
      const element = folder[key];
      data["tree"].push(create_shrub_line(lastKey == key ? prefix.replace("├── ", "└── ") : prefix, key, is_folder(element)));
      if (is_folder(element)) {
        data["dir"]++;
        const subdata = folder_to_shrub(element, depth + 1, "", lastKey == key, lastKey == key ? fileLines : fileLines + 1);
        data["tree"] = data["tree"].concat(subdata["tree"]);
        data["dir"] += subdata["dir"];
        data["files"] += subdata["files"];
      }
      else
        data["files"]++;
      // console.log(tree);
    }
    // console.log(data["tree"]);
  }

  // const last = tree.pop();
  // tree.push(last.replace("├── ", "└── "));

  // console.log(tree, depth, path);
  // return tree;
  return data;
}

const format_tree = (folder, path) => {
  const data = folder_to_shrub(folder, 0, path, false, 0);

  const tree = data["tree"].filter(i => i.trim() != "");
  tree.push(" ");
  tree.push(`${data["dir"]} director${data["dir"] == 1 ? "y" : "ies"}, ${data["files"]} file${data["files"] == 1 ? "" : "s"}`);
  // console.log(tree);
  return tree;
}

const common_prefix = (strings) => {
  if (strings.length == 0)
    return null;
  // if (strings.length == 1)
  //   return strings[0];
  
  let prefix = strings[0];
  // console.log(prefix);
  for (let i = 1; i < strings.length; i++) {
    while (strings[i].indexOf(prefix) < 0)
      prefix = prefix.substr(0, prefix.length - 1);
  }
  // console.log(prefix.indexOf(" "));
  // return prefix.indexOf(" ") >= 0 ? `'${prefix}'` : prefix;
  return prefix.replace(/\ /g, "\\ ");
}

const autofill_dir = (path) => {
  const links = path.replace(/\\\ /g, " ").split("/");
  const fill = links.pop();
  const lookup = links.length > 0 ? get_item_from_path(links.join("/")) : folder;
  // console.log(fill);

  if (!is_folder(lookup))
    return path;
  
  const possible = Object.keys(lookup).filter(k => k.startsWith(fill));
  const prefix = common_prefix(possible);
  // console.log(prefix);
  if (prefix)
    links.push(prefix);
  return prefix ? links.join("/") : path;
}

const autofill_command = (command, possible) => {
  possible = possible.filter(p => p.startsWith(command));
  // console.log(possible);
  const prefix = common_prefix(possible);
  return prefix ? prefix : command;
}

const exec = (commandline) => {
  // console.log(commandline);
  // console.log(commandline.match(/\\\ /g));
  // https://stackoverflow.com/questions/49179609/split-string-on-spaces-and-quotes-keeping-quoted-substrings-intact
  const commandline_inputs = commandline.match(/"[^"]*"|'[^']*'|(\\\ |\S)+/g).map(m => m.slice(0, 1) === '"' ? m.slice(1, -1) : m.slice(0, 1) === "'" ? m.slice(1, -1) : m).map(m => m.replace(/\\\ /g, " "));
  // console.log(commandline_inputs);
  // commandline_inputs.forEach(i => {console.log(i)});
  const command = commandline_inputs[0];
  const args = commandline_inputs.splice(1).filter(i => i != "");
  
  const path = args.length > 0 ? args[0].trim() : ".";
  const lookup = get_item_from_path(path);

  // console.log(lookup);
  // console.log(folder);
  // console.log(folder_path);

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
        folder = data.folders;
        folder_path = ".";
        return;
      }
      if (lookup != null && is_folder(lookup)) {
        folder = lookup;
        set_folder_path(path);
        // console.log(folder);
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
  
    case "tree":
      return format_tree(lookup, path);
      break;

    case "help": 
      return data.terminal_data["help"];

    case "welcome":
      return data.terminal_data["welcome"];

    default:
      return [`${command}: unknown command`];
  }
}

const implemented_commands = ["ls", "dir", "cd", "cat", "tree", "help", "welcome"];

export {folder_path, autofill_dir, autofill_command, exec, implemented_commands};