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

const terminal_data = {
  "welcome": [
    // `Last login: ${login_timestamp} from annaqiu.com`,
    `Last login: ${login_timestamp}`,
    "",
    "Welcome! This mini shell is made by Anna Qiu and was made entirely using HTML, CSS, and JavaScript.",
    "For more information and to see what commands are supported, type help."
  ],
  "help": [
    "supported commands: `ls` (aliased with `dir`), `tree`, `cd`, `cat`, `clear`"
  ]
}

export {folders, terminal_data};