const {QMainWindow, QListView, QLineEdit, QGridLayout, QWidget, QLabel, FlexLayout, QScrollArea, QPushButton, QListWidget, QListWidgetItem} = require("@nodegui/nodegui");

const win = new QMainWindow;
const win_width  = 900;
const win_height = 685;
win.setFixedSize(win_width, win_height);
win.setWindowTitle("fs-date-archivist");

const root = new QWidget;
root.setObjectName("root");
win.setCentralWidget(root);

root.setStyleSheet(`
   *
   {
      font-family: Consolas, monospace;
      font-size: 20px;
      outline: none;
   }
   #root
   {
      color: #eed;
      background-color: #111;
   }
   QLabel {
      color: white;
      border-bottom: 2px solid #ccd;
      outline: none;
   }
   QScrollArea, QScrollBar {
      background-color: #222;
   }
   QScrollBar::add-page, QScrollBar::sub-page {
      background: none;
   }
   QScrollBar::up-arrow, QScrollBar::down-arrow {
      display: none;
   }
   QScrollBar::handle {
      background: #444;
      border: 2px solid white;
   }
   QListWidget, QLineEdit {
      color: white;
      background-color: #222;
      border: 2px solid white;
   }
   QListWidget::item:selected {
      color: white;
      background-color: rgba(100, 149, 237, 0.5);
   }
`);

const lbl_cwd = new QLabel(root);
lbl_cwd.setObjectName("lbl_cwd");
lbl_cwd.setText(`output file (cwd is "${process.cwd()}"):`);
lbl_cwd.move(10, 11);

const btn_height = 30;

const go_button = new QPushButton(root);
go_button.setText("start");
const go_button_width  = 80;
go_button.move(win_width - go_button_width - 10, 10);
go_button.resize(go_button_width, 2 * btn_height);

const output_input = new QLineEdit(root);
output_input.move(11, 39);
output_input.resize(win_width - 22 - go_button_width - 10, 30);

const err_lbl = new QLabel(root);
err_lbl.move(11, 70);
err_lbl.resize(win_width - 20, 30);

const depth1_lbl = new QLabel(root);
depth1_lbl.setText("depth1: ");
depth1_lbl.move(11, 130);

const depth1_add = new QPushButton(root);
depth1_add.setText("add path");
const depth1_add_width  = 120;
const depth1_btn_height = 30;
depth1_add.move(win_width - depth1_add_width - 10, 124);
depth1_add.resize(depth1_add_width, btn_height);

const depth1_remove = new QPushButton(root);
depth1_remove.setText("remove path");
const depth1_remove_width = 140;
depth1_remove.move(win_width - depth1_remove_width - 10 - depth1_add_width - 10, 124);
depth1_remove.resize(depth1_remove_width, btn_height);

const depth1_input = new QLineEdit(root);
depth1_input.move(11, 160);
depth1_input.resize(win_width - 22, 30);

const depth1_list = new QListWidget(root);
depth1_list.move(11, 200);
depth1_list.resize(win_width - 22, 170);

depth1_add.addEventListener("clicked", () => {
   const path = depth1_input.text();
   depth1_input.clear();
   if (path.length == 0) {
      return;
   }

   const qlwi = new QListWidgetItem;
   qlwi.setText(path);
   depth1_list.addItem(qlwi);
});

depth1_remove.addEventListener("clicked", () => {
   depth1_list.takeItem(depth1_list.currentRow());
});

const recursive_lbl = new QLabel(root);
recursive_lbl.setText("recursive: ");
recursive_lbl.move(11, 395);

const recursive_add = new QPushButton(root);
recursive_add.setText("add path");
const recursive_add_width  = 120;
const recursive_btn_height = 30;
recursive_add.move(win_width - recursive_add_width - 10, 390);
recursive_add.resize(recursive_add_width, btn_height);

const recursive_remove = new QPushButton(root);
recursive_remove.setText("remove path");
const recursive_remove_width = 140;
recursive_remove.move(win_width - recursive_remove_width - 10 - recursive_add_width - 10, 390);
recursive_remove.resize(recursive_remove_width, btn_height);

const recursive_input = new QLineEdit(root);
recursive_input.move(11, 426);
recursive_input.resize(win_width - 22, 30);

const recursive_list = new QListWidget(root);
recursive_list.move(11, 464);
recursive_list.resize(win_width - 22, 210);

recursive_add.addEventListener("clicked", () => {
   const path = recursive_input.text();
   recursive_input.clear();
   if (path.length == 0) {
      return;
   }

   const qlwi = new QListWidgetItem;
   qlwi.setText(path);
   recursive_list.addItem(qlwi);
});

recursive_remove.addEventListener("clicked", () => {
   recursive_list.takeItem(recursive_list.currentRow());
});

const fs_date_archivist = require("./core");
const fs = require("fs");

go_button.addEventListener("clicked", () => {
   const ouf = output_input.text();
   if (ouf.length == 0) {
      err_lbl.setText("you need to enter a path here ^^^^");
      return;
   }

   if (fs.existsSync(ouf)) {
      err_lbl.setText("will not overwrite output file. delete manually");
      return;
   }

   var count;
   const depth1 = [];
   count = depth1_list.count();
   for (let i = 0; i < count; ++i) {
      depth1.push(depth1_list.item(i).text());
   }

   const recursive = [];
   count = recursive_list.count();
   for (let i = 0; i < count; ++i) {
      recursive.push(recursive_list.item(i).text());
   }

   const obj = fs_date_archivist({depth1, recursive});
   fs.writeFileSync(ouf, JSON.stringify(obj));

   err_lbl.setText("done");
});

win.show();
global.win = win;
